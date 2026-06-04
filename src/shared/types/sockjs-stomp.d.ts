declare global {
  interface Window {
    SockJS: SockJSConstructor;
    StompJs: StompJsNamespace;
    gapi?: {
      ytsubscribe?: {
        go: () => void;
      };
    };
  }
}

export interface SockJSOptions {
  transports?: string[];
  timeout?: number;
}

export interface SockJSConstructor {
  new (
    url: string,
    protocols?: string[] | null,
    options?: SockJSOptions
  ): SockJSInstance;
}

export interface SockJSCloseEvent {
  code: number;
  reason: string;
  wasClean: boolean;
}

export interface SockJSMessageEvent {
  data: string;
}

export interface SockJSInstance {
  readyState: number;
  onopen: ((event?: Event) => void) | null;
  onmessage: ((event: SockJSMessageEvent) => void) | null;
  onclose: ((event?: SockJSCloseEvent) => void) | null;
  onerror: ((event?: Event) => void) | null;
  send(data: string): void;
  close(): void;
}

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
    errorCallback?: (error: StompFrame | Event) => void
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

export interface StompStatic {
  over(ws: SockJSInstance): StompClient;
  client(url: string): StompClient;
}

export interface StompJsNamespace {
  Stomp: StompStatic;
}

export {};
