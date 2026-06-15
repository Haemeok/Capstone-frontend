import { render } from "@testing-library/react";

import { recipeFormMessages } from "@/shared/i18n/recipeFormMessages";

import { REMIX_REDIRECT_ERRORS } from "../lib/remixRedirectErrors";
import { RemixRedirectToast } from "../RemixRedirectToast";

const mockPathname = jest.fn();
const mockParams = new URLSearchParams();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({ replace: jest.fn() }),
  useSearchParams: () => mockParams,
}));

const addToast = jest.fn();
jest.mock("@/widgets/Toast/model/store", () => ({
  useToastStore: () => ({ addToast }),
}));

describe("RemixRedirectToast i18n (T-08)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams.delete("error");
  });

  it("ja NOT_CLONEABLE → remixNotCloneable", () => {
    mockPathname.mockReturnValue("/ja/recipes/r1");
    mockParams.set("error", REMIX_REDIRECT_ERRORS.NOT_CLONEABLE);
    render(<RemixRedirectToast />);
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({
        message: recipeFormMessages.ja.ui.remixNotCloneable,
      })
    );
  });

  it("ja ALREADY_CLONED → remixAlreadyCloned", () => {
    mockPathname.mockReturnValue("/ja/recipes/r1");
    mockParams.set("error", REMIX_REDIRECT_ERRORS.ALREADY_CLONED);
    render(<RemixRedirectToast />);
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({
        message: recipeFormMessages.ja.ui.remixAlreadyCloned,
      })
    );
  });
});
