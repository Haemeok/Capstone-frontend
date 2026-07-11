const loadedSrcs = new Set<string>();

export const markImageLoaded = (src: string) => {
  loadedSrcs.add(src);
};

export const hasImageLoaded = (src: string) => loadedSrcs.has(src);
