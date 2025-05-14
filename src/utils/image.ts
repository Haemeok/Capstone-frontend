export const convertImageToWebP = async (
  file: File,
  quality: number = 0.8, // WebP 품질 설정
): Promise<{ blob: Blob; filename: string } | null> => {
  // WebP를 지원하지 않는 브라우저(매우 드묾) 또는 이미지 파일이 아닌 경우 처리
  if (!HTMLCanvasElement.prototype.toBlob || !file.type.startsWith('image/')) {
    console.warn('WebP conversion not supported or invalid file type.');
    // 원본 파일을 그대로 반환하거나, 에러 처리할 수 있습니다.
    // 여기서는 null을 반환하여 호출하는 쪽에서 원본을 사용하도록 유도할 수 있습니다.
    return null;
  }

  return new Promise((resolve) => {
    const image = new Image();
    image.src = URL.createObjectURL(file);

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('Failed to get canvas context for WebP conversion.');
        resolve(null); // 컨텍스트 가져오기 실패
        return;
      }

      ctx.drawImage(image, 0, 0);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(image.src); // 메모리 해제
          if (blob) {
            // 원본 파일 이름에서 확장자를 .webp로 변경
            const originalNameWithoutExtension =
              file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const newFilename = `${originalNameWithoutExtension}.webp`;
            resolve({ blob, filename: newFilename });
          } else {
            console.error('Canvas toBlob failed for WebP conversion.');
            resolve(null); // Blob 생성 실패
          }
        },
        'image/webp',
        quality,
      );
    };

    image.onerror = () => {
      URL.revokeObjectURL(image.src);
      console.error('Failed to load image for WebP conversion.');
      resolve(null); // 이미지 로드 실패
    };
  });
};
