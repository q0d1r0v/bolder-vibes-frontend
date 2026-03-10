'use client';

import { create } from 'zustand';
import type { AgentTask, AgentStep } from '@/types';

interface AgentState {
  currentTask: AgentTask | null;
  steps: AgentStep[];
  isRunning: boolean;
  partialOutput: string;
}

interface AgentActions {
  setTask: (task: AgentTask) => void;
  addStep: (step: AgentStep) => void;
  updateStep: (stepId: string, updates: Partial<AgentStep>) => void;
  setPartialOutput: (output: string) => void;
  appendPartialOutput: (chunk: string) => void;
  completeTask: (result: AgentTask['result']) => void;
  failTask: (error: string) => void;
  reset: () => void;
}

export const useAgentStore = create<AgentState & AgentActions>((set) => ({
  currentTask: null,
  steps: [],
  isRunning: false,
  partialOutput: '',

  setTask: (task) =>
    set({
      currentTask: task,
      steps: [],
      isRunning: true,
      partialOutput: '',
    }),

  addStep: (step) =>
    set((state) => ({
      steps: [...state.steps, step],
      partialOutput: '',
    })),

  updateStep: (stepId, updates) =>
    set((state) => ({
      steps: state.steps.map((s) =>
        s.id === stepId ? { ...s, ...updates } : s
      ),
    })),

  setPartialOutput: (output) => set({ partialOutput: output }),

  appendPartialOutput: (chunk) =>
    set((state) => ({ partialOutput: state.partialOutput + chunk })),

  completeTask: (result) =>
    set((state) => ({
      currentTask: state.currentTask
        ? { ...state.currentTask, status: 'COMPLETED', result }
        : null,
      isRunning: false,
    })),

  failTask: (error) =>
    set((state) => ({
      currentTask: state.currentTask
        ? { ...state.currentTask, status: 'FAILED', errorMessage: error }
        : null,
      isRunning: false,
    })),

  reset: () =>
    set({
      currentTask: null,
      steps: [],
      isRunning: false,
      partialOutput: '',
    }),
}));
