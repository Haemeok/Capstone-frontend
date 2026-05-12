import { storage } from "@/shared/lib/storage";

import {
  UNSEEN_IMPORT_STORAGE_KEY,
  useUnseenImportStore,
} from "../unseenImportStore";

describe("unseenImportStore", () => {
  beforeEach(() => {
    storage.removeItem(UNSEEN_IMPORT_STORAGE_KEY);
    useUnseenImportStore.setState({ hasUnseenImport: false });
  });

  it("초기 상태는 false", () => {
    expect(useUnseenImportStore.getState().hasUnseenImport).toBe(false);
  });

  it("markUnseen이 hasUnseenImport를 true로 만든다", () => {
    useUnseenImportStore.getState().markUnseen();
    expect(useUnseenImportStore.getState().hasUnseenImport).toBe(true);
  });

  it("clearUnseen이 hasUnseenImport를 false로 되돌린다", () => {
    useUnseenImportStore.getState().markUnseen();
    useUnseenImportStore.getState().clearUnseen();
    expect(useUnseenImportStore.getState().hasUnseenImport).toBe(false);
  });

  it("markUnseen은 storage에도 true를 쓴다", () => {
    useUnseenImportStore.getState().markUnseen();
    expect(storage.getBooleanItem(UNSEEN_IMPORT_STORAGE_KEY)).toBe(true);
  });

  it("clearUnseen은 storage에서 키를 제거한다", () => {
    useUnseenImportStore.getState().markUnseen();
    useUnseenImportStore.getState().clearUnseen();
    expect(storage.getItem(UNSEEN_IMPORT_STORAGE_KEY)).toBeNull();
  });
});
