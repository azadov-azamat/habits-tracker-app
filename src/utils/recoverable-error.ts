import { useAppErrorStore, type AppErrorKind } from '@/store/app-error-store';

type ReportRecoverableErrorInput = {
  kind: AppErrorKind;
  messageKey: string;
  retryLabelKey?: string;
  source: string;
  error: unknown;
};

export type ActionResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: unknown };

export function reportRecoverableError({
  kind,
  messageKey,
  retryLabelKey,
  source,
  error,
}: ReportRecoverableErrorInput): void {
  useAppErrorStore.getState().setAppError({ kind, messageKey, retryLabelKey });

  if (__DEV__) {
    console.warn(`[recoverable:${source}]`, error);
  }
}

export async function toActionResult<T>(
  source: string,
  run: () => Promise<T>,
  options: Omit<ReportRecoverableErrorInput, 'source' | 'error'>,
): Promise<ActionResult<T>> {
  try {
    return { ok: true, value: await run() };
  } catch (error) {
    reportRecoverableError({ ...options, source, error });
    return { ok: false, error };
  }
}
