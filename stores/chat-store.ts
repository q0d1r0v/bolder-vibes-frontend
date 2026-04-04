'use client';

import { create } from 'zustand';
import { getAiModels } from '@/lib/api/conversations.api';

export interface FileOperation {
  type: 'create' | 'update' | 'delete';
  path: string;
  content?: string;
  fileId?: string;
}

interface ChatState {
  isStreaming: boolean;
  streamingContent: string;
  streamingConversationId: string | null;
  fileOperations: FileOperation[];
  selectedModel: string;
  planMode: boolean;
  availableModels: Array<{ id: string; name: string; description: string }>;
  modelsLoaded: boolean;
}

interface ChatActions {
  startStreaming: (conversationId: string) => void;
  appendChunk: (chunk: string) => void;
  addFileOperation: (op: FileOperation) => void;
  endStreaming: () => void;
  setSelectedModel: (model: string) => void;
  setPlanMode: (enabled: boolean) => void;
  reset: () => void;
  loadModels: () => Promise<void>;
}

// Default model ID - will be replaced with first available model from API
const DEFAULT_MODEL_ID = 'claude-sonnet-4-20250514';

export const useChatStore = create<ChatState & ChatActions>((set, get) => ({
  isStreaming: false,
  streamingContent: '',
  streamingConversationId: null,
  fileOperations: [],
  selectedModel: DEFAULT_MODEL_ID,
  planMode: false,
  availableModels: [],
  modelsLoaded: false,

  loadModels: async () => {
    try {
      const models = await getAiModels();
      if (models.length > 0) {
        set({
          availableModels: models.map((m) => ({
            id: m.id,
            name: m.name,
            description: m.description,
          })),
          modelsLoaded: true,
          // If still using default model, switch to first available
          selectedModel: get().selectedModel === DEFAULT_MODEL_ID 
            ? models[0].id 
            : get().selectedModel,
        });
      }
    } catch {
      // Fallback: keep the hardcoded default
      set({ modelsLoaded: true });
    }
  },

  startStreaming: (conversationId) =>
    set({
      isStreaming: true,
      streamingContent: '',
      streamingConversationId: conversationId,
      fileOperations: [],
    }),

  appendChunk: (chunk) =>
    set((state) => ({
      streamingContent: state.streamingContent + chunk,
    })),

  addFileOperation: (op) =>
    set((state) => ({
      fileOperations: [...state.fileOperations, op],
    })),

  endStreaming: () =>
    set({
      isStreaming: false,
      streamingContent: '',
      streamingConversationId: null,
    }),

  setSelectedModel: (model) => set({ selectedModel: model }),

  setPlanMode: (enabled) => set({ planMode: enabled }),

  reset: () =>
    set({
      isStreaming: false,
      streamingContent: '',
      streamingConversationId: null,
      fileOperations: [],
    }),
}));