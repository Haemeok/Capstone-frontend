export const WEBSOCKET_CONFIG = {
  DEFAULT_URL: "/ws/notifications",
  MAX_RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY: 1000,
  HEARTBEAT_INTERVAL: 30000,

  // CDN URLs
  SOCKJS_CDN_URL:
    "https://cdn.jsdelivr.net/npm/sockjs-client@1.6.1/dist/sockjs.min.js",
  STOMP_CDN_URL:
    "https://cdn.jsdelivr.net/npm/@stomp/stompjs@7.0.0/bundles/stomp.umd.min.js",
} as const;
