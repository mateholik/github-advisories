import { renderHook, act } from '@testing-library/react';
import { beforeEach, expect, test, vi } from 'vitest';
import { useQueryParams } from '@/lib/hooks';

// 🧱 Mock react-router's useSearchParams
const mockSetSearchParams = vi.fn();
const mockGet = vi.fn();

vi.mock('react-router', () => ({
  useSearchParams: () => {
    const params = new URLSearchParams(mockGet());
    return [params, mockSetSearchParams];
  },
}));

beforeEach(() => {
  mockSetSearchParams.mockClear();
  mockGet.mockClear();
});

test('returns default values when URL params are empty', () => {
  mockGet.mockReturnValue('');
  const { result } = renderHook(() => useQueryParams());

  expect(result.current.affects).toBe('');
  expect(result.current.severity).toBe('all');
  expect(result.current.searchParamsObject).toEqual({});
});

test('returns parsed values from URL params', () => {
  mockGet.mockReturnValue('affects=react@18.2.0&severity=high');
  const { result } = renderHook(() => useQueryParams());

  expect(result.current.affects).toBe('react@18.2.0');
  expect(result.current.severity).toBe('high');
  expect(result.current.searchParamsObject).toEqual({
    affects: 'react@18.2.0',
    severity: 'high',
  });
});

test('handleSetSearchParams sets correct params when all values provided', () => {
  mockGet.mockReturnValue('');
  const { result } = renderHook(() => useQueryParams());

  act(() => {
    result.current.handleSetSearchParams('react', '18.2.0', 'medium');
  });

  expect(mockSetSearchParams).toHaveBeenCalledWith({
    affects: 'react@18.2.0',
    severity: 'medium',
  });
});

test('handleSetSearchParams omits severity when it is "all"', () => {
  mockGet.mockReturnValue('');
  const { result } = renderHook(() => useQueryParams());

  act(() => {
    result.current.handleSetSearchParams('react', '18.2.0', 'all');
  });

  expect(mockSetSearchParams).toHaveBeenCalledWith({
    affects: 'react@18.2.0',
  });
});

test('handleSetSearchParams sets affects without version', () => {
  mockGet.mockReturnValue('');
  const { result } = renderHook(() => useQueryParams());

  act(() => {
    result.current.handleSetSearchParams('vue');
  });

  expect(mockSetSearchParams).toHaveBeenCalledWith({
    affects: 'vue',
  });
});
