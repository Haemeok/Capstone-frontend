export const Z_INDEX = {
  BASE: 0,
  STICKY: 10,
  HEADER: 20,
  DROPDOWN: 30,
  MODAL: 40,
  TOAST: 50,
} as const;

export type ZIndexLevel = (typeof Z_INDEX)[keyof typeof Z_INDEX];
