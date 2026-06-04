import { act, renderHook, waitFor } from "@testing-library/react";

import { enqueueCurationBlogPostForPublish } from "@/app/actions/blogPublishQueue";
import {
  fetchCurationArticleWithRecipes,
  generateCurationBlogPost,
} from "@/app/actions/curationBlog";

import { useBatchRewrite } from "./useBatchRewrite";

jest.mock("@/app/actions/blogPublishQueue", () => ({
  enqueueCurationBlogPostForPublish: jest.fn(),
}));

jest.mock("@/app/actions/curationBlog", () => ({
  fetchCurationArticleWithRecipes: jest.fn(),
  generateCurationBlogPost: jest.fn(),
}));

const mockedFetch = fetchCurationArticleWithRecipes as jest.MockedFunction<
  typeof fetchCurationArticleWithRecipes
>;
const mockedGenerate = generateCurationBlogPost as jest.MockedFunction<
  typeof generateCurationBlogPost
>;
const mockedEnqueue = enqueueCurationBlogPostForPublish as jest.MockedFunction<
  typeof enqueueCurationBlogPostForPublish
>;

const mockArticle = (slug: string) =>
  ({
    slug,
    title: `${slug} 제목`,
    coverImageKey: `cover/${slug}.jpg`,
    recipeIds: [`r-${slug}`],
  }) as never;

const mockRecipes = (slug: string) => [
  { id: `r-${slug}`, imageUrl: `https://example.com/${slug}.jpg` } as never,
];

const mockPost = () => ({ intro: "", sections: [], outro: "" }) as never;

const titles = { "slug-a": "큐레이션 A", "slug-b": "큐레이션 B" };

beforeEach(() => {
  jest.clearAllMocks();
});

describe("useBatchRewrite — runRewrite", () => {
  it("2개 슬러그 happy path: queued → fetching → generating → ready 전이", async () => {
    mockedFetch.mockImplementation(
      async (slug: string) =>
        ({
          success: true,
          article: mockArticle(slug),
          recipes: mockRecipes(slug),
        }) as never
    );
    mockedGenerate.mockResolvedValue({
      success: true,
      post: mockPost(),
    } as never);

    const { result } = renderHook(() => useBatchRewrite());

    await act(async () => {
      await result.current.runRewrite(["slug-a", "slug-b"], "epigung", titles);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.items[0]).toMatchObject({
      slug: "slug-a",
      title: "큐레이션 A",
      phase: "ready",
      tone: "epigung",
    });
    expect(result.current.items[0].ready?.post).toBeDefined();
    expect(result.current.items[1].phase).toBe("ready");
    expect(result.current.isRunning).toBe(false);
  });

  it("fetch 실패 슬러그는 failed, 다음 슬러그는 계속 처리", async () => {
    mockedFetch.mockImplementation(async (slug: string) => {
      if (slug === "slug-a")
        return { success: false, error: "fetch 실패" } as never;
      return {
        success: true,
        article: mockArticle(slug),
        recipes: mockRecipes(slug),
      } as never;
    });
    mockedGenerate.mockResolvedValue({
      success: true,
      post: mockPost(),
    } as never);

    const { result } = renderHook(() => useBatchRewrite());

    await act(async () => {
      await result.current.runRewrite(["slug-a", "slug-b"], "epigung", titles);
    });

    expect(result.current.items[0]).toMatchObject({
      slug: "slug-a",
      phase: "failed",
      error: "fetch 실패",
    });
    expect(result.current.items[1].phase).toBe("ready");
  });

  it("generate 실패 슬러그는 failed, 다음 슬러그는 계속 처리", async () => {
    mockedFetch.mockImplementation(
      async (slug: string) =>
        ({
          success: true,
          article: mockArticle(slug),
          recipes: mockRecipes(slug),
        }) as never
    );
    mockedGenerate.mockImplementation(async (article: { slug: string }) => {
      if (article.slug === "slug-a") {
        return { success: false, error: "LLM timeout" } as never;
      }
      return { success: true, post: mockPost() } as never;
    });

    const { result } = renderHook(() => useBatchRewrite());

    await act(async () => {
      await result.current.runRewrite(["slug-a", "slug-b"], "epigung", titles);
    });

    expect(result.current.items[0].phase).toBe("failed");
    expect(result.current.items[0].error).toBe("LLM timeout");
    expect(result.current.items[1].phase).toBe("ready");
  });

  it("isRunning 토글: 시작 시 true, 종료 후 false", async () => {
    let resolveFetch: (
      v: Awaited<ReturnType<typeof fetchCurationArticleWithRecipes>>
    ) => void = () => {};
    mockedFetch.mockImplementation(
      () =>
        new Promise((res) => {
          resolveFetch = res;
        })
    );
    mockedGenerate.mockResolvedValue({
      success: true,
      post: mockPost(),
    } as never);

    const { result } = renderHook(() => useBatchRewrite());

    let pending!: Promise<void>;
    act(() => {
      pending = result.current.runRewrite(["slug-a"], "epigung", titles);
    });

    await waitFor(() => expect(result.current.isRunning).toBe(true));

    await act(async () => {
      resolveFetch({
        success: true,
        article: mockArticle("slug-a"),
        recipes: mockRecipes("slug-a"),
        missingRecipeIds: [],
      });
      await pending;
    });

    expect(result.current.isRunning).toBe(false);
  });

  it("cancel() 후 다음 슬러그로 가지 않음", async () => {
    let resolveFirst: (
      v: Awaited<ReturnType<typeof fetchCurationArticleWithRecipes>>
    ) => void = () => {};
    mockedFetch
      .mockImplementationOnce(
        () =>
          new Promise((res) => {
            resolveFirst = res;
          })
      )
      .mockImplementation(
        async (slug: string) =>
          ({
            success: true,
            article: mockArticle(slug),
            recipes: mockRecipes(slug),
          }) as never
      );
    mockedGenerate.mockResolvedValue({
      success: true,
      post: mockPost(),
    } as never);

    const { result } = renderHook(() => useBatchRewrite());

    let pending!: Promise<void>;
    act(() => {
      pending = result.current.runRewrite(
        ["slug-a", "slug-b"],
        "epigung",
        titles
      );
    });

    await waitFor(() => expect(mockedFetch).toHaveBeenCalledTimes(1));

    act(() => {
      result.current.cancel();
    });

    await act(async () => {
      resolveFirst({
        success: true,
        article: mockArticle("slug-a"),
        recipes: mockRecipes("slug-a"),
        missingRecipeIds: [],
      });
      await pending;
    });

    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(result.current.items[0].phase).toBe("ready");
    expect(result.current.items[1].phase).toBe("queued");
  });
});

describe("useBatchRewrite — enqueueAllReady", () => {
  const prepareReady = async (slugs: string[]) => {
    mockedFetch.mockImplementation(
      async (slug: string) =>
        ({
          success: true,
          article: mockArticle(slug),
          recipes: mockRecipes(slug),
        }) as never
    );
    mockedGenerate.mockResolvedValue({
      success: true,
      post: mockPost(),
    } as never);

    const hook = renderHook(() => useBatchRewrite());
    await act(async () => {
      await hook.result.current.runRewrite(slugs, "epigung", titles);
    });
    return hook;
  };

  it("ready → enqueueing → enqueued 전이 + packagePath 보관", async () => {
    const { result } = await prepareReady(["slug-a", "slug-b"]);

    mockedEnqueue.mockImplementation(
      async (input: { curationTitle: string }) =>
        ({
          success: true,
          packagePath: `/queue/${input.curationTitle}`,
          savedSlots: [],
          skippedSlots: [],
        }) as never
    );

    await act(async () => {
      await result.current.enqueueAllReady();
    });

    expect(result.current.items[0].phase).toBe("enqueued");
    expect(result.current.items[0].enqueued?.packagePath).toContain(
      "slug-a 제목"
    );
    expect(result.current.items[1].phase).toBe("enqueued");
    expect(result.current.isEnqueueing).toBe(false);
  });

  it("서버 dup error 면 enqueue-failed + error 메시지 보관", async () => {
    const { result } = await prepareReady(["slug-a"]);

    mockedEnqueue.mockResolvedValue({
      success: false,
      error: "이미 큐에 있어요 (slug=slug-a): curation-...",
    } as never);

    await act(async () => {
      await result.current.enqueueAllReady();
    });

    expect(result.current.items[0].phase).toBe("enqueue-failed");
    expect(result.current.items[0].error).toContain("이미 큐에 있어요");
  });

  it("ready 가 아닌 항목 (failed) 은 skip — enqueue 호출 안 됨", async () => {
    mockedFetch.mockImplementation(async (slug: string) => {
      if (slug === "slug-a") return { success: false, error: "fail" } as never;
      return {
        success: true,
        article: mockArticle(slug),
        recipes: mockRecipes(slug),
      } as never;
    });
    mockedGenerate.mockResolvedValue({
      success: true,
      post: mockPost(),
    } as never);

    const { result } = renderHook(() => useBatchRewrite());
    await act(async () => {
      await result.current.runRewrite(["slug-a", "slug-b"], "epigung", titles);
    });

    mockedEnqueue.mockResolvedValue({
      success: true,
      packagePath: "/queue/x",
      savedSlots: [],
      skippedSlots: [],
    } as never);

    await act(async () => {
      await result.current.enqueueAllReady();
    });

    expect(mockedEnqueue).toHaveBeenCalledTimes(1);
    expect(result.current.items[0].phase).toBe("failed");
    expect(result.current.items[1].phase).toBe("enqueued");
  });
});

describe("useBatchRewrite — reset", () => {
  it("reset() 호출 후 items 가 비워짐", async () => {
    mockedFetch.mockImplementation(
      async (slug: string) =>
        ({
          success: true,
          article: mockArticle(slug),
          recipes: mockRecipes(slug),
        }) as never
    );
    mockedGenerate.mockResolvedValue({
      success: true,
      post: mockPost(),
    } as never);

    const { result } = renderHook(() => useBatchRewrite());
    await act(async () => {
      await result.current.runRewrite(["slug-a"], "epigung", titles);
    });
    expect(result.current.items).toHaveLength(1);

    act(() => {
      result.current.reset();
    });

    expect(result.current.items).toHaveLength(0);
  });
});
