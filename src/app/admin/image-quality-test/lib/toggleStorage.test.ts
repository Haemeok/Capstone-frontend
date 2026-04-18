import { MODELS } from "./models";
import { loadEnabledModels, saveEnabledModels } from "./toggleStorage";

beforeEach(() => localStorage.clear());

describe("toggleStorage", () => {
  it("returns all model ids by default when storage is empty", () => {
    expect(loadEnabledModels()).toEqual(MODELS.map((m) => m.id));
  });

  it("persists and reloads the enabled set", () => {
    saveEnabledModels(["seedream-v4", "flux-2-schnell"]);
    expect(loadEnabledModels()).toEqual(["seedream-v4", "flux-2-schnell"]);
  });

  it("filters out unknown ids when loading (registry changed)", () => {
    localStorage.setItem(
      "admin-image-test.enabled-models",
      JSON.stringify(["seedream-v4", "ghost-model"])
    );
    expect(loadEnabledModels()).toEqual(["seedream-v4"]);
  });
});
