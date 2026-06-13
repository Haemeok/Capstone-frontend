import { api } from "@/shared/api/client";

import { getIngredients } from "../api";

jest.mock("@/shared/api/client", () => ({
  api: { get: jest.fn().mockResolvedValue({ content: [] }) },
}));

const getMock = api.get as jest.Mock;

const lastParams = () => getMock.mock.calls.at(-1)?.[1]?.params ?? {};

describe("getIngredients lang 전파", () => {
  beforeEach(() => getMock.mockClear());

  it("ja면 params에 lang=ja", async () => {
    await getIngredients({
      category: null,
      pageParam: 0,
      isMine: false,
      lang: "ja",
    });
    expect(lastParams().lang).toBe("ja");
  });

  it("en면 params에 lang=en", async () => {
    await getIngredients({
      category: null,
      pageParam: 0,
      isMine: false,
      lang: "en",
    });
    expect(lastParams().lang).toBe("en");
  });

  it("ko면 lang 미포함 (회귀: 기존 ko 호출 불변)", async () => {
    await getIngredients({
      category: null,
      pageParam: 0,
      isMine: false,
      lang: "ko",
    });
    expect("lang" in lastParams()).toBe(false);
  });

  it("lang 미지정이면 ko로 간주해 lang 미포함", async () => {
    await getIngredients({ category: null, pageParam: 0, isMine: false });
    expect("lang" in lastParams()).toBe(false);
  });
});
