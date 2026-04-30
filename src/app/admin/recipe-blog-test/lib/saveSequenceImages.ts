declare global {
  interface Window {
    showDirectoryPicker?: (options?: {
      mode?: "read" | "readwrite";
    }) => Promise<FileSystemDirectoryHandle>;
  }
}

export type SaveItem = {
  imageUrl: string;
  fileName: string;
};

const urlToBlob = async (url: string): Promise<Blob> => {
  const res = await fetch(url);
  return await res.blob();
};

const downloadOne = async (item: SaveItem): Promise<void> => {
  const blob = await urlToBlob(item.imageUrl);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = item.fileName;
  a.click();
  URL.revokeObjectURL(url);
};

export const saveSequenceImages = async (
  items: SaveItem[],
  folderName: string
): Promise<void> => {
  if (!("showDirectoryPicker" in window)) {
    for (const item of items) {
      await downloadOne(item);
    }
    return;
  }

  const rootHandle = await window.showDirectoryPicker!({ mode: "readwrite" });
  const subHandle = await rootHandle.getDirectoryHandle(folderName, {
    create: true,
  });

  for (const item of items) {
    const blob = await urlToBlob(item.imageUrl);
    const fileHandle = await subHandle.getFileHandle(item.fileName, {
      create: true,
    });
    const writable = await fileHandle.createWritable();
    await writable.write(blob);
    await writable.close();
  }
};
