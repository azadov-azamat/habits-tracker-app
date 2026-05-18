import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppErrorStore } from '@/store/app-error-store';
import { createSafeJsonStorage } from '@/store/persist-storage';

type TestState = { value: string };

beforeEach(() => {
  useAppErrorStore.getState().clearAppError();
  jest.clearAllMocks();
  jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('createSafeJsonStorage', () => {
  it('returns null and reports when hydration read fails', async () => {
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('read failed'));
    const storage = createSafeJsonStorage<TestState>('test-store')!;

    await expect(storage.getItem('test-key')).resolves.toBeNull();

    expect(useAppErrorStore.getState().currentError).toMatchObject({
      kind: 'persistence',
      messageKey: 'errors.persistence',
    });
  });

  it('reports write failures without throwing', async () => {
    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('write failed'));
    const storage = createSafeJsonStorage<TestState>('test-store')!;

    await expect(
      storage.setItem('test-key', { state: { value: 'a' }, version: 1 }),
    ).resolves.toBeUndefined();

    expect(useAppErrorStore.getState().currentError?.kind).toBe('persistence');
  });

  it('reports remove failures without throwing', async () => {
    (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(new Error('remove failed'));
    const storage = createSafeJsonStorage<TestState>('test-store')!;

    await expect(storage.removeItem('test-key')).resolves.toBeUndefined();

    expect(useAppErrorStore.getState().currentError?.kind).toBe('persistence');
  });
});
