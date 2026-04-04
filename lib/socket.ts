import { io, type Socket } from 'socket.io-client';
import { WS_URL, WS_NAMESPACE } from './constants';
import { getAccessToken } from './auth-tokens';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(`${WS_URL}${WS_NAMESPACE}`, {
      auth: { token: getAccessToken() },
      transports: ['websocket', 'polling'],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    // Refresh auth token before each reconnect attempt so expired JWTs
    // don't cause permanent disconnection
    socket.on('reconnect_attempt', () => {
      if (socket) {
        socket.auth = { token: getAccessToken() };
      }
    });
  }
  return socket;
}

export function connectSocket(): void {
  const s = getSocket();
  s.auth = { token: getAccessToken() };
  if (!s.connected) {
    s.connect();
  }
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/**
 * Returns true if the socket is currently connected.
 */
export function isSocketConnected(): boolean {
  return socket?.connected ?? false;
}

/**
 * Wait for the socket to be connected (resolves immediately if already connected).
 * Rejects after timeoutMs if the socket doesn't connect in time.
 */
export function waitForConnection(timeoutMs = 5000): Promise<void> {
  const s = getSocket();
  if (s.connected) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      s.off('connect', onConnect);
      reject(new Error('Socket connection timed out'));
    }, timeoutMs);

    const onConnect = () => {
      clearTimeout(timer);
      resolve();
    };

    s.once('connect', onConnect);

    // Ensure connection attempt is in progress
    if (!s.connected && !s.active) {
      s.auth = { token: getAccessToken() };
      s.connect();
    }
  });
}
