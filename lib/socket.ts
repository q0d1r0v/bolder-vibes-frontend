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
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
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
