"use client";

import { useEffect } from "react";
import { notFound } from "next/navigation";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const CommentsError = ({ error }: ErrorProps) => {
  useEffect(() => {
    if (error.message.includes("404") || error.message.includes("Not Found")) {
      notFound();
    }
  }, [error]);

  notFound();
};

export default CommentsError;