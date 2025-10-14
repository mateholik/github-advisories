// src/lib/__tests__/useClientFilters.test.ts
import { renderHook, act } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { useClientFilters } from '@/lib/hooks';
import type { ResponseAdvisory } from '@/lib/types';

// Fake timers to control debounce delay
vi.useFakeTimers();

const mockAdvisories: ResponseAdvisory[] = [
  { summary: 'React vulnerability', severity: 'high' } as ResponseAdvisory,
  { summary: 'Vue issue', severity: 'medium' } as ResponseAdvisory,
  { summary: 'Angular bug', severity: 'low' } as ResponseAdvisory,
];

test('initial state is correct', () => {
  const { result } = renderHook(() => useClientFilters());

  expect(result.current.searchText).toBe('');
  expect(result.current.selectedSeverity).toBe('all');
});

test('updates searchText after debounce', () => {
  const { result } = renderHook(() => useClientFilters());

  act(() => {
    result.current.setSearchText('react');
  });

  // before debounce time
  act(() => vi.advanceTimersByTime(300));
  expect(result.current.filterByNameAndSeverity(mockAdvisories[0])).toBe(true); // still true because old '' text matches everything

  // after debounce time (400ms)
  act(() => vi.advanceTimersByTime(100));
  expect(result.current.filterByNameAndSeverity(mockAdvisories[0])).toBe(true); // "react" matches "React vulnerability"
  expect(result.current.filterByNameAndSeverity(mockAdvisories[1])).toBe(false); // "vue" doesn't match
});

test('filters by severity correctly', () => {
  const { result } = renderHook(() => useClientFilters());

  act(() => {
    result.current.setSelectedSeverity('medium');
  });

  const vueAdvisory = mockAdvisories[1];
  const reactAdvisory = mockAdvisories[0];

  expect(result.current.filterByNameAndSeverity(vueAdvisory)).toBe(true);
  expect(result.current.filterByNameAndSeverity(reactAdvisory)).toBe(false);
});

test('clearForm resets all fields', () => {
  const { result } = renderHook(() => useClientFilters());

  act(() => {
    result.current.setSearchText('react');
    result.current.setSelectedSeverity('high');
  });

  act(() => {
    result.current.clearForm();
  });

  expect(result.current.searchText).toBe('');
  expect(result.current.selectedSeverity).toBe('all');
});
