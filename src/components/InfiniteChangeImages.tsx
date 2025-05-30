import React, { useState, useEffect } from 'react';

interface InfiniteChangeImagesProps {
  images: string[];
  intervalMs?: number;
  altPrefix?: string;
  className?: string;
}

const InfiniteChangeImages = ({
  images,
  intervalMs = 300,
  altPrefix = 'Image',
  className = '',
}: InfiniteChangeImagesProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, intervalMs);

    return () => {
      clearInterval(timer);
    };
  }, [images, intervalMs]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <img
      src={images[currentIndex]}
      alt={`${altPrefix} ${currentIndex + 1}`}
      className={className}
      style={{ display: 'block' }}
    />
  );
};

export default InfiniteChangeImages;
