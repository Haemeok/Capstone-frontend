import { useBatchPublishStore } from "../batchPublishStore";

describe("useBatchPublishStore", () => {
  beforeEach(() => {
    useBatchPublishStore.setState({ items: {} });
  });

  it("setStatus는 해당 key의 status를 갱신한다", () => {
    const { setStatus } = useBatchPublishStore.getState();
    setStatus("a", "generating");
    expect(useBatchPublishStore.getState().items.a.status).toBe("generating");
    setStatus("a", "publishing");
    expect(useBatchPublishStore.getState().items.a.status).toBe("publishing");
  });

  it("setError는 status=error로 만들고 error 메시지 저장", () => {
    const { setError } = useBatchPublishStore.getState();
    setError("a", "boom");
    const s = useBatchPublishStore.getState().items.a;
    expect(s.status).toBe("error");
    expect(s.error).toBe("boom");
  });

  it("setGenerated는 status=generated + result 저장하고 error를 비운다", () => {
    const { setError, setGenerated } = useBatchPublishStore.getState();
    setError("a", "prev");
    const fakeResult = {
      slug: "a",
      h1: "h",
      dek: "d",
      markdown: "m",
      recipeIds: [],
      toneSeed: "friendly",
      thumbnailUrl: "",
      provider: "",
      category: "기타",
      coverImageKey: null,
    } as never;
    setGenerated("a", fakeResult);
    const s = useBatchPublishStore.getState().items.a;
    expect(s.status).toBe("generated");
    expect(s.result).toBe(fakeResult);
    expect(s.error).toBeUndefined();
  });

  it("setDone은 status=done + articleId 저장", () => {
    const { setDone } = useBatchPublishStore.getState();
    setDone("a", 42);
    const s = useBatchPublishStore.getState().items.a;
    expect(s.status).toBe("done");
    expect(s.articleId).toBe(42);
  });

  it("reset(key) 단일 키 제거", () => {
    const { setStatus, reset } = useBatchPublishStore.getState();
    setStatus("a", "done");
    setStatus("b", "done");
    reset("a");
    expect(useBatchPublishStore.getState().items.a).toBeUndefined();
    expect(useBatchPublishStore.getState().items.b).toBeDefined();
  });

  it("reset() 전체 클리어", () => {
    const { setStatus, reset } = useBatchPublishStore.getState();
    setStatus("a", "done");
    setStatus("b", "done");
    reset();
    expect(useBatchPublishStore.getState().items).toEqual({});
  });
});
