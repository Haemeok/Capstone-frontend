import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { registerServiceWorker } from './utils/serviceWorker';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// 앱 렌더링 후 서비스 워커 등록
registerServiceWorker();
