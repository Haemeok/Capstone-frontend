import { fireEvent, render, screen } from "@testing-library/react";

import { format } from "@/shared/i18n";
import { ratingsMessages } from "@/shared/i18n/ratingsMessages";

import ReviewPage from "../page";

const mockPathname = jest.fn();
const replace = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useParams: () => ({ recipeId: "r1" }),
  useRouter: () => ({ replace, back: jest.fn() }),
}));

jest.mock("@/entities/recipe/model/hooks", () => ({
  useRecipeDetailQuery: () => ({ recipeData: { title: "김치찌개" } }),
}));
jest.mock("@/entities/user", () => ({
  useUserStore: () => ({ user: { nickname: "민수", profileImage: "" } }),
}));
const addToast = jest.fn();
jest.mock("@/shared/ui/toast", () => ({ useToastStore: () => ({ addToast }) }));

let postSuccess: () => void;
const postReview = jest.fn((_v, h) => {
  postSuccess = h.onSuccess;
});
jest.mock("@/features/recipe-review/model/hooks", () => ({
  __esModule: true,
  default: () => ({ mutate: postReview, isPending: false }),
}));

const HANGUL = /[가-힣]/;

describe("RatePage i18n (T-11~T-14)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("ja 렌더 한글 잔존 0 + 제출 라벨 (T-11)", () => {
    mockPathname.mockReturnValue("/ja/recipes/r1/rate");
    const f = ratingsMessages.ja.form;
    const { container } = render(<ReviewPage />);
    expect(screen.getByText(f.submit)).toBeInTheDocument();
    // recipeName(김치찌개)과 nickname(민수)은 콘텐츠라 한글 허용 → 제외하고 chrome만 스캔
    const chrome =
      container.textContent?.replace("김치찌개", "").replace("민수", "") ?? "";
    expect(HANGUL.test(chrome)).toBe(false);
  });

  it("ja 프롬프트에 recipeName 치환 (T-12)", () => {
    mockPathname.mockReturnValue("/ja/recipes/r1/rate");
    const f = ratingsMessages.ja.form;
    render(<ReviewPage />);
    expect(
      screen.getByText(format(f.prompt, { recipeName: "김치찌개" }))
    ).toBeInTheDocument();
  });

  it("ja 평가 등록 성공 토스트 successToast (T-13)", () => {
    mockPathname.mockReturnValue("/ja/recipes/r1/rate");
    const f = ratingsMessages.ja.form;
    render(<ReviewPage />);
    fireEvent.click(screen.getAllByRole("button")[4]);
    fireEvent.click(screen.getByText(f.submit));
    postSuccess();
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({ message: f.successToast })
    );
  });

  it("ko 렌더는 '평가하기' (T-14)", () => {
    mockPathname.mockReturnValue("/recipes/r1/rate");
    render(<ReviewPage />);
    expect(screen.getByText(ratingsMessages.ko.form.title)).toBeInTheDocument();
  });
});
