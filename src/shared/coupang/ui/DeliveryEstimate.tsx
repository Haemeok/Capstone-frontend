"use client";

import { useSyncExternalStore } from "react";

import { computeDeliveryEstimate } from "../lib/computeDeliveryEstimate";

const emptySubscribe = () => () => {};

export const DeliveryEstimate = () => {
  const label = useSyncExternalStore(
    emptySubscribe,
    () => computeDeliveryEstimate(new Date()),
    () => null
  );

  if (!label) return null;

  return <p className="text-sm font-medium text-green-600">{label}</p>;
};
