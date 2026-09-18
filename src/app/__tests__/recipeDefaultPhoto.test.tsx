import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import { recipeDetail } from "@/shared/i18n/messages/en/recipeDetail";
import { recordPhotoMessages } from "@/shared/i18n/recordPhotoMessages";

import type { RecordPhotoEditorProps } from "@/entities/recipe/model/recordPhoto.types";

import { CookingRecordPhotoField } from "@/features/cooking-record-photo-edit/ui/CookingRecordPhotoField";
import { RecipeCookingRecordForm } from "@/features/recipe-complete/ui/RecipeCookingRecordForm";
jest.mock("next/navigation", () => ({ usePathname: () => "/recipes/test" }));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));
const copy = recipeDetail.cookingRecord;
it("T-01: edits and submits the default recipe image through the real photo field", async () => {
  const image = document.createElement("img");
  Object.defineProperties(image, {
    naturalWidth: { value: 1600 },
    naturalHeight: { value: 900 },
  });
  const dimensions = jest
    .spyOn(window, "Image")
    .mockImplementation(() => image);
  const onSubmit = jest.fn();
  const PhotoEditor = (props: RecordPhotoEditorProps) => (
    <CookingRecordPhotoField
      {...props}
      copy={recordPhotoMessages.en}
      stickerProcessingMode="after-save"
      onRetry={jest.fn()}
      catalog={{
        status: "ready",
        catalog: {
          plates: [
            {
              plateId: "plate-real",
              name: "Real plate",
              imageUrl: "/plate.webp",
              category: "plain",
            },
          ],
          maskShapes: [{ value: "ROUNDED_DIAMOND", label: "Diamond" }],
        },
      }}
    />
  );
  try {
    render(
      <RecipeCookingRecordForm
        recipeId="recipe-real"
        recipeTitle="Recipe"
        recipeImageUrl="/recipe.webp"
        copy={copy}
        isSubmitting={false}
        photoEditor={PhotoEditor}
        onSubmit={onSubmit}
        onSkip={jest.fn()}
      />
    );
    await act(async () => {
      fireEvent.load(image);
    });
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Edit photo" })).toBeEnabled()
    );
    fireEvent.click(screen.getByRole("button", { name: "Real plate" }));
    fireEvent.click(screen.getByRole("button", { name: "Rounded diamond" }));
    fireEvent.click(screen.getByRole("button", { name: "Edit photo" }));
    fireEvent.keyDown(screen.getByRole("application"), { key: "+" });
    fireEvent.click(screen.getByRole("button", { name: "Done" }));
    fireEvent.click(screen.getByRole("button", { name: copy.submit }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const photo = onSubmit.mock.calls[0][0].photo;
    expect(photo).toEqual(
      expect.objectContaining({
        originalFile: null,
        originalUrl: "/recipe.webp",
        imageSize: { width: 1600, height: 900 },
        plateId: "plate-real",
        shape: { kind: "mask", value: "ROUNDED_DIAMOND" },
      })
    );
    expect(photo.crop.zoom).toBeGreaterThan(1);
  } finally {
    dimensions.mockRestore();
  }
});
