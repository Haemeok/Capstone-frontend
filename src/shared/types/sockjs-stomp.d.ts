// SockJS + STOMP CDN 타입 정의 (최소한 필요한 부분만)

declare global {
  interface Window {
    SockJS: typeof SockJS;
    Stomp: typeof Stomp;
  }
}

// SockJS 타입 정의
export interface SockJSOptions {
  transports?: string[];
  timeout?: number;
}

export interface SockJS {
  new (
    url: string,
    protocols?: string[],
    options?: SockJSOptions
  ): SockJSInstance;
}

export interface SockJSInstance {
  readyState: number;
  onopen: ((event?: any) => void) | null;
  onmessage: ((event: { data: string }) => void) | null;
  onclose: ((event?: any) => void) | null;
  onerror: ((event?: any) => void) | null;
  send(data: string): void;
  close(): void;
}

// STOMP 타입 정의
export interface StompHeaders {
  [key: string]: string;
}

export interface StompMessage {
  command: string;
  headers: StompHeaders;
  body: string;
  ack(): void;
  nack(): void;
}

export interface StompSubscription {
  id: string;
  unsubscribe(): void;
}

export interface StompFrame {
  command: string;
  headers: StompHeaders;
  body: string;
}

export interface StompClient {
  connect(
    headers: StompHeaders,
    connectCallback: (frame?: StompFrame) => void,
    errorCallback?: (error: any) => void
  ): void;
  disconnect(disconnectCallback?: () => void): void;
  send(destination: string, headers?: StompHeaders, body?: string): void;
  subscribe(
    destination: string,
    callback: (message: StompMessage) => void,
    headers?: StompHeaders
  ): StompSubscription;
  connected: boolean;
  ws: SockJSInstance;
  debug?: (message: string) => void;
}

export interface Stomp {
  over(ws: SockJSInstance): StompClient;
  client(url: string): StompClient;
}

export {};
