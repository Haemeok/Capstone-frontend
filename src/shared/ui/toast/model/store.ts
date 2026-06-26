import { create } from "zustand";

import { ToastType } from "./types";

let toastId = 0;

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

type ToastInput = DistributiveOmit<ToastType, "id">;

type ToastState = {
  toastList: ToastType[];
  addToast: (toast: ToastInput) => number;
  removeToast: (id: number) => void;
};

export const useToastStore = create<ToastState>((set) => ({
  toastList: [],
  addToast: (toast) => {
    const id = ++toastId;
    const newToast = { id, ...toast } as ToastType;
    set((state) => ({ toastList: [...state.toastList, newToast] }));
    return id;
  },
  removeToast: (id) => {
    set((state) => ({
      toastList: state.toastList.filter((toast) => toast.id !== id),
    }));
  },
}));
