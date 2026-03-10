'use client';

import { create } from 'zustand';
import type { ProjectFile } from '@/types';

interface EditorState {
  activeFileId: string | null;
  openTabs: ProjectFile[];
  unsavedChanges: Record<string, string>;
}

interface EditorActions {
  openFile: (file: ProjectFile) => void;
  closeTab: (fileId: string) => void;
  setActiveFile: (fileId: string) => void;
  setUnsavedContent: (fileId: string, content: string) => void;
  clearUnsaved: (fileId: string) => void;
  updateFileContent: (fileId: string, content: string) => void;
  reset: () => void;
}

export const useEditorStore = create<EditorState & EditorActions>((set) => ({
  activeFileId: null,
  openTabs: [],
  unsavedChanges: {},

  openFile: (file) =>
    set((state) => {
      const exists = state.openTabs.some((t) => t.id === file.id);
      return {
        openTabs: exists ? state.openTabs : [...state.openTabs, file],
        activeFileId: file.id,
      };
    }),

  closeTab: (fileId) =>
    set((state) => {
      const tabs = state.openTabs.filter((t) => t.id !== fileId);
      const { [fileId]: _, ...rest } = state.unsavedChanges;
      return {
        openTabs: tabs,
        unsavedChanges: rest,
        activeFileId:
          state.activeFileId === fileId
            ? tabs[tabs.length - 1]?.id || null
            : state.activeFileId,
      };
    }),

  setActiveFile: (fileId) => set({ activeFileId: fileId }),

  setUnsavedContent: (fileId, content) =>
    set((state) => ({
      unsavedChanges: { ...state.unsavedChanges, [fileId]: content },
    })),

  clearUnsaved: (fileId) =>
    set((state) => {
      const { [fileId]: _, ...rest } = state.unsavedChanges;
      return { unsavedChanges: rest };
    }),

  updateFileContent: (fileId, content) =>
    set((state) => ({
      openTabs: state.openTabs.map((t) =>
        t.id === fileId ? { ...t, content } : t
      ),
    })),

  reset: () =>
    set({
      activeFileId: null,
      openTabs: [],
      unsavedChanges: {},
    }),
}));
