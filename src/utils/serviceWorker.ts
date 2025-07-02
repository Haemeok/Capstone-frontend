// 서비스 워커 등록 및 관리 유틸리티

export const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    console.log('이 브라우저는 서비스 워커를 지원하지 않습니다.');
    return;
  }

  // 개발 환경에서는 서비스 워커를 등록하지 않음
  if (!import.meta.env.PROD) {
    console.log('개발 환경에서는 서비스 워커가 등록되지 않습니다.');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('서비스 워커 등록 성공:', registration);

    // 서비스 워커 업데이트 감지
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // 기존 서비스 워커가 있고 새 버전이 설치됨 - 자동 업데이트
            console.log('새 버전이 감지되었습니다. 자동으로 업데이트합니다.');
            skipWaiting();
            window.location.reload();
          } else {
            // 첫 번째 설치
            console.log('앱이 오프라인에서도 사용 가능합니다.');
          }
        }
      });
    });

    // 서비스 워커가 컨트롤러 역할을 시작할 때
    if (registration.waiting) {
      console.log('새 버전이 대기 중입니다. 자동으로 업데이트합니다.');
      skipWaiting();
      window.location.reload();
    }

    return registration;
  } catch (error) {
    console.error('서비스 워커 등록 실패:', error);
  }
};

// 서비스 워커 업데이트 강제 적용
export const skipWaiting = () => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
  }
};

// 캐시 수동 업데이트
export const updateCache = async () => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'UPDATE_CACHE' });
  }
};
