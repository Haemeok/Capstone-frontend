export const WEBSOCKET_CONFIG = {
  DEFAULT_URL: "/ws/notifications",
  MAX_RECONNECT_ATTEMPTS: 1,
  RECONNECT_DELAY: 1000,
  HEARTBEAT_INTERVAL: 30000,

  SOCKJS_CDN_URL:
    "https://cdn.jsdelivr.net/npm/sockjs-client@1.6.1/dist/sockjs.min.js",
  STOMP_CDN_URL:
    "https://cdn.jsdelivr.net/npm/@stomp/stompjs@7.1.1/bundles/stomp.umd.min.js",
} as const;
