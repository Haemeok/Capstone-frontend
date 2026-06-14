"use client";

import { useAuthDict } from "@/shared/i18n";

const LoginErrorPage = () => {
  const t = useAuthDict();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-ink text-lg font-bold">{t.error.title}</p>
      <p className="text-ink-muted text-sm">{t.error.description}</p>
      <a
        href="/login"
        className="bg-olive-light hover:bg-olive-dark flex h-12 items-center rounded-xl px-6 font-medium text-white transition-colors"
      >
        {t.error.retry}
      </a>
    </div>
  );
};

export default LoginErrorPage;
