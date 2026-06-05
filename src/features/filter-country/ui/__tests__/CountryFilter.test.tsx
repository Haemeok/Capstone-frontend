import { render, screen } from "@testing-library/react";

let capturedProps: { availableValues?: string[] } | null = null;

jest.mock("@/widgets/CategoryPicker/CategoryPicker", () => ({
  __esModule: true,
  default: (props: { availableValues: string[]; trigger: React.ReactNode }) => {
    capturedProps = props;
    return props.trigger;
  },
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ replace: jest.fn() })),
  useSearchParams: jest.fn(),
}));

import { useSearchParams } from "next/navigation";

import { CountryFilter } from "../CountryFilter";

const mockParams = (search: string) =>
  (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(search));

describe("CountryFilter", () => {
  beforeEach(() => {
    capturedProps = null;
  });

  it("필터 옵션은 일본·기타 둘뿐이고 한국은 없다", () => {
    mockParams("");
    render(<CountryFilter />);
    expect(capturedProps?.availableValues).toEqual(["일본", "기타"]);
  });

  it("선택이 없으면 기본 라벨 '국가'를 보여준다", () => {
    mockParams("");
    render(<CountryFilter />);
    expect(screen.getByText("국가")).toBeInTheDocument();
  });

  it("선택이 있으면 칩이 선택값을 보여준다", () => {
    mockParams("creatorCountryTags=JP");
    render(<CountryFilter />);
    expect(screen.getByText("일본")).toBeInTheDocument();
  });
});
