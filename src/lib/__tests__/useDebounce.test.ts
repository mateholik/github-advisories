// useDebounce.test.ts
import { renderHook, act } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { useDebounce } from '@/lib/hooks';

vi.useFakeTimers();

test('should debounce value updates', () => {
  const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
    initialProps: { value: 'a' },
  });

  // initially returns same value
  expect(result.current).toBe('a');

  // change value
  rerender({ value: 'b' });

  // advance time less than debounce delay
  act(() => {
    vi.advanceTimersByTime(300);
  });
  expect(result.current).toBe('a'); // not updated yet

  // advance past delay
  act(() => {
    vi.advanceTimersByTime(200);
  });
  expect(result.current).toBe('b');
});
