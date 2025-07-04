import { create } from "zustand";

import { ToastType } from "./types";

let toastId = 0;

type ToastState = {
  toastList: ToastType[];
  addToast: (toast: Omit<ToastType, "id">) => number;
  removeToast: (id: number) => void;
};

export const useToastStore = create<ToastState>((set) => ({
  toastList: [],
  addToast: (toast) => {
    const id = ++toastId;
    const newToast: ToastType = { id, ...toast };
    set((state) => ({ toastList: [...state.toastList, newToast] }));
    return id;
  },
  removeToast: (id) => {
    set((state) => ({
      toastList: state.toastList.filter((toast) => toast.id !== id),
    }));
  },
}));
