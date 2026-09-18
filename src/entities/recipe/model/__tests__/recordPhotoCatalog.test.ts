import { api } from "@/shared/api/client";

import { getRecordPhotoCatalog } from "../recordPhotoCatalog";
jest.mock("@/shared/api/client", () => ({ api: { get: jest.fn() } }));
it("서버 목록 순서를 유지하고 새 접시도 기타에서 선택할 수 있습니다", async () => {
  jest.mocked(api.get).mockResolvedValue({
    plates: [
      { plateId: "future-plate", name: "New", imageUrl: "/new.webp" },
      { plateId: "Z6edXexm", name: "Renamed", imageUrl: "/known.webp" },
    ],
    maskShapes: [{ value: "CIRCLE", label: "원형" }],
  });
  const result = await getRecordPhotoCatalog();
  expect(
    result.plates.map(({ plateId, category }) => ({ plateId, category }))
  ).toEqual([
    { plateId: "future-plate", category: "other" },
    { plateId: "Z6edXexm", category: "botanical" },
  ]);
  expect(api.get).toHaveBeenCalledWith("/me/sticker-book/plates");
});
