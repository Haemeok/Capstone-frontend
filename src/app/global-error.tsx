"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="flex max-w-md flex-col items-center gap-6 text-center">
            <div className="text-6xl">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900">
              문제가 발생했어요
            </h1>
            <p className="text-gray-600">
              일시적인 오류가 발생했습니다.
              <br />
              페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => reset()}
                className="rounded-lg bg-gray-100 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200"
              >
                다시 시도
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="rounded-lg bg-olive-light px-6 py-3 font-medium text-white transition-colors hover:bg-olive-dark"
              >
                홈으로 가기
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
