import { create } from 'zustand';

export type AppErrorKind = 'notification' | 'persistence' | 'startup' | 'habit-action';

export type AppError = {
  kind: AppErrorKind;
  messageKey: string;
  retryLabelKey?: string;
  createdAt: number;
};

type AppErrorState = {
  currentError: AppError | null;
  setAppError: (error: Omit<AppError, 'createdAt'>) => void;
  clearAppError: () => void;
};

export const useAppErrorStore = create<AppErrorState>((set) => ({
  currentError: null,
  setAppError: (error) => set({ currentError: { ...error, createdAt: Date.now() } }),
  clearAppError: () => set({ currentError: null }),
}));
