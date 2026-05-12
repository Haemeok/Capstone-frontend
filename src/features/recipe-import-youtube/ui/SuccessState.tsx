"use client";

import { CheckCircle } from "lucide-react";

export const SuccessState = () => (
  <>
    <CheckCircle className="mx-auto h-10 w-10 text-green-400" />
    <p className="mt-2 text-sm font-semibold text-white">완료!</p>
  </>
);
