import { useState } from "react";

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";

import { recordPhotoMessages } from "@/shared/i18n/recordPhotoMessages";

import type {
  RecordPhotoCatalogState,
  RecordPhotoDraft,
} from "@/entities/recipe/model/recordPhoto.types";
import { createEmptyPhotoDraft } from "@/entities/recipe/model/recordPhotoView";

import type {
  PreparedRecordSticker,
  RecordStickerSession,
} from "../../model/recordStickerPreview.types";
import { CookingRecordPhotoField } from "../CookingRecordPhotoField";

jest.mock("next/navigation", () => ({
  usePathname: () => "/dev/cooking-record-ui",
}));
const catalog: RecordPhotoCatalogState = {
  status: "ready",
  catalog: {
    plates: [
      {
        plateId: "plate-1",
        name: "Sample plate",
        imageUrl: "/plate.webp",
        category: "plain",
      },
      {
        plateId: "plate-new",
        name: "New plate",
        imageUrl: "/new.webp",
        category: "other",
      },
    ],
    maskShapes: [{ value: "CIRCLE", label: "Circle" }],
  },
};
const initial: RecordPhotoDraft = {
  ...createEmptyPhotoDraft(),
  originalUrl: "/food.webp",
  imageSize: { width: 1200, height: 900 },
};
const Harness = ({
  state = catalog,
  photo = initial,
  session,
  onBusyChange,
}: {
  state?: RecordPhotoCatalogState;
  photo?: RecordPhotoDraft;
  session?: RecordStickerSession;
  onBusyChange?: (busy: boolean) => void;
}) => {
  const [value, setValue] = useState(photo);
  return (
    <>
      <input aria-label="Memo" defaultValue="Tasty" />
      <CookingRecordPhotoField
        value={value}
        onChange={setValue}
        copy={recordPhotoMessages.en}
        catalog={state}
        onRetry={() => undefined}
        stickerSession={session}
        onBusyChange={onBusyChange}
      />
      <output aria-label="Draft">{JSON.stringify(value)}</output>
    </>
  );
};

test("sticker processing starts only in sticker mode and plate selection returns in dish mode", async () => {
  let resolve: (result: PreparedRecordSticker) => void = () => undefined;
  const session = {
    prepare: jest.fn(
      () =>
        new Promise<PreparedRecordSticker>((done) => {
          resolve = done;
        })
    ),
  };
  const busy = jest.fn();
  render(
    <Harness
      photo={{
        ...initial,
        originalFile: new File(["food"], "food.jpg", { type: "image/jpeg" }),
      }}
      session={session}
      onBusyChange={busy}
    />
  );
  expect(session.prepare).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Sample plate" }));
  fireEvent.click(screen.getByRole("button", { name: "Make a sticker" }));
  expect(
    screen.getByText(recordPhotoMessages.en.stickerProcessing)
  ).toBeVisible();
  expect(busy).toHaveBeenLastCalledWith(true);
  expect(
    screen.queryByRole("group", { name: "Plate" })
  ).not.toBeInTheDocument();
  await act(async () =>
    resolve({
      originalKey: "original-ready",
      stickerKey: "sticker-ready",
      imageUrl: "/actual-sticker.webp",
      imageSize: { width: 600, height: 900 },
    })
  );
  await waitFor(() => expect(busy).toHaveBeenLastCalledWith(false));
  expect(
    screen.queryByText(recordPhotoMessages.en.stickerProcessing)
  ).not.toBeInTheDocument();
  expect(screen.getByLabelText("Draft")).toHaveTextContent(
    '"stickerKey":"sticker-ready"'
  );
  expect(screen.getByLabelText("Draft")).toHaveTextContent('"plateId":null');
  fireEvent.click(screen.getByRole("button", { name: "Place on a plate" }));
  expect(screen.getByLabelText("Draft")).toHaveTextContent(
    '"plateId":"plate-1"'
  );
  fireEvent.click(screen.getByRole("button", { name: "Make a sticker" }));
  expect(session.prepare).toHaveBeenCalledTimes(1);
});

test("photo shape and plate stay independent across category changes", () => {
  render(<Harness />);
  fireEvent.click(screen.getByRole("button", { name: "Sample plate" }));
  fireEvent.click(screen.getByRole("button", { name: "Circle" }));
  expect(screen.getByLabelText("Draft")).toHaveTextContent(
    '"plateId":"plate-1"'
  );
  fireEvent.click(screen.getByRole("button", { name: "Make a sticker" }));
  fireEvent.click(screen.getByRole("button", { name: "Place on a plate" }));
  fireEvent.click(screen.getByRole("button", { name: "Other" }));
  expect(
    screen.queryByRole("button", { name: "Sample plate" })
  ).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "New plate" })).toBeVisible();
  expect(screen.getByLabelText("Draft")).toHaveTextContent(
    '"plateId":"plate-1"'
  );
  expect(screen.getByLabelText("Memo")).toHaveValue("Tasty");
  fireEvent.click(screen.getByRole("button", { name: "No plate" }));
  expect(screen.getByLabelText("Draft")).toHaveTextContent('"plateId":null');
});
test("catalog failure and empty state preserve the existing draft", () => {
  const { rerender } = render(<Harness />);
  fireEvent.click(screen.getByRole("button", { name: "Sample plate" }));
  rerender(<Harness state={{ status: "error" }} />);
  expect(screen.getByRole("button", { name: "Try again" })).toBeVisible();
  expect(screen.getByLabelText("Draft")).toHaveTextContent(
    '"plateId":"plate-1"'
  );
  rerender(
    <Harness
      state={{ status: "ready", catalog: { plates: [], maskShapes: [] } }}
    />
  );
  expect(screen.getByRole("button", { name: "No plate" })).toBeVisible();
  expect(screen.getByRole("button", { name: "Make a sticker" })).toBeVisible();
});
test("cancel discards crop changes and done commits them", () => {
  render(<Harness />);
  fireEvent.click(screen.getByRole("button", { name: "Edit photo" }));
  fireEvent.keyDown(screen.getByRole("application"), { key: "+" });
  fireEvent.click(
    within(screen.getByRole("dialog")).getAllByRole("button", {
      name: "Cancel",
    })[0]
  );
  expect(screen.getByLabelText("Draft")).toHaveTextContent('"zoom":1');
  fireEvent.click(screen.getByRole("button", { name: "Edit photo" }));
  fireEvent.keyDown(screen.getByRole("application"), { key: "+" });
  fireEvent.click(screen.getByRole("button", { name: "Done" }));
  expect(screen.getByLabelText("Draft")).not.toHaveTextContent('"zoom":1}');
});

test("저장 후 처리하는 스티커는 저장을 막지 않고 서버가 지원하는 사진 변경만 제공합니다", () => {
  const onBusyChange = jest.fn();
  render(
    <CookingRecordPhotoField
      value={{ ...initial, shape: { kind: "sticker" } }}
      catalog={catalog}
      copy={recordPhotoMessages.en}
      onChange={jest.fn()}
      onRetry={jest.fn()}
      stickerProcessingMode="after-save"
      onBusyChange={onBusyChange}
    />
  );
  expect(
    screen.queryByRole("button", { name: "Edit photo" })
  ).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Change photo" })).toBeVisible();
  expect(onBusyChange).toHaveBeenLastCalledWith(false);
  expect(
    screen.getByText(recordPhotoMessages.en.stickerAfterSave)
  ).toBeVisible();
});

test("수정 가능한 원본이 없으면 사진 추가 전 스타일 선택만 막고 파일 변경은 허용합니다", () => {
  render(
    <CookingRecordPhotoField
      value={initial}
      catalog={catalog}
      requireUpload
      copy={recordPhotoMessages.en}
      onChange={jest.fn()}
      onRetry={jest.fn()}
    />
  );
  expect(screen.getByRole("button", { name: "Make a sticker" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Sample plate" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Change photo" })).toBeEnabled();
});
