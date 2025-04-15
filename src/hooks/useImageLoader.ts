import { useState, useEffect } from 'react';

export const useImageLoader = (src: string, options = { preload: true }) => {
  const [status, setStatus] = useState({
    loaded: false,
    error: false,
    loading: true,
  });

  useEffect(() => {
    setStatus({
      loaded: false,
      error: false,
      loading: true,
    });

    if (!src) {
      setStatus({
        loaded: false,
        error: true,
        loading: false,
      });
      return;
    }

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setStatus({
        loaded: true,
        error: false,
        loading: false,
      });
    };

    img.onerror = () => {
      setStatus({
        loaded: false,
        error: true,
        loading: false,
      });
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return status;
};
