'use client';

import { create } from 'zustand';

interface SocketState {
  isConnected: boolean;
  currentProjectRoom: string | null;
}

interface SocketActions {
  setConnected: (connected: boolean) => void;
  setProjectRoom: (projectId: string | null) => void;
}

export const useSocketStore = create<SocketState & SocketActions>((set) => ({
  isConnected: false,
  currentProjectRoom: null,

  setConnected: (isConnected) => set({ isConnected }),
  setProjectRoom: (currentProjectRoom) => set({ currentProjectRoom }),
}));
