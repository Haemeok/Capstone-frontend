import { isNonLocalizedPath } from "../isNonLocalizedPath";

describe("isNonLocalizedPath", () => {
  it.each(["/events/app-install", "/events/app-install/"])(
    "%s는 한국어 전용 경로로 판별한다",
    (pathname) => {
      expect(isNonLocalizedPath(pathname)).toBe(true);
    }
  );

  it.each(["/events/app-install-extra", "/events/app-install//"])(
    "%s는 한국어 전용 경로로 판별하지 않는다",
    (pathname) => {
      expect(isNonLocalizedPath(pathname)).toBe(false);
    }
  );
});
