import { downloadMonthlyCookingRecordImage } from "../downloadMonthlyCookingRecordImage";

describe("downloadMonthlyCookingRecordImage", () => {
  it("월이 포함된 이름으로 PNG를 내려받고 임시 URL을 정리합니다", () => {
    const blob = new Blob(["png"], { type: "image/png" });
    const originalCreateObjectURL = Object.getOwnPropertyDescriptor(
      URL,
      "createObjectURL"
    );
    const originalRevokeObjectURL = Object.getOwnPropertyDescriptor(
      URL,
      "revokeObjectURL"
    );
    const createObjectURL = jest.fn().mockReturnValue("blob:monthly-record");
    const revokeObjectURL = jest.fn();
    Object.defineProperties(URL, {
      createObjectURL: { configurable: true, value: createObjectURL },
      revokeObjectURL: { configurable: true, value: revokeObjectURL },
    });
    const click = jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);
    const append = jest.spyOn(document.body, "append");

    downloadMonthlyCookingRecordImage(blob, "2026-08");

    expect(createObjectURL).toHaveBeenCalledWith(blob);
    expect(click).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:monthly-record");
    expect(append.mock.calls[0]?.[0]).toMatchObject({
      download: "recipio-cooking-record-2026-08.png",
      href: "blob:monthly-record",
    });

    click.mockRestore();
    append.mockRestore();
    restoreProperty(URL, "createObjectURL", originalCreateObjectURL);
    restoreProperty(URL, "revokeObjectURL", originalRevokeObjectURL);
  });
});

const restoreProperty = (
  target: typeof URL,
  key: "createObjectURL" | "revokeObjectURL",
  descriptor: PropertyDescriptor | undefined
) => {
  if (descriptor) {
    Object.defineProperty(target, key, descriptor);
    return;
  }
  Reflect.deleteProperty(target, key);
};
