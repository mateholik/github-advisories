import { renderHook, act } from '@testing-library/react';
import { expect, test } from 'vitest';
import { useSearchPageForm } from '@/lib/hooks';

test('initializes with given values', () => {
  const initialData = Object.freeze({
    packageName: 'react',
    packageVersion: '18.2.0',
  });

  const { result } = renderHook(() =>
    useSearchPageForm({
      initialFormData: initialData,
      initialSeverity: 'high',
    })
  );

  expect(result.current.formData.packageName).toBe('react');
  expect(result.current.formData.packageVersion).toBe('18.2.0');
  expect(result.current.selectedSeverity).toBe('high');
});

test('updates formData on input change', () => {
  const initialData = Object.freeze({
    packageName: 'react',
    packageVersion: '',
  });

  const { result } = renderHook(() =>
    useSearchPageForm({
      initialFormData: initialData,
      initialSeverity: 'low',
    })
  );

  act(() => {
    result.current.handleInputChange({
      target: { name: 'packageName', value: 'vue' },
    } as any);
  });

  expect(result.current.formData.packageName).toBe('vue');
  expect(result.current.formErrors.packageName).toBe('');
});

test('sets validation errors correctly', () => {
  const initialData = Object.freeze({
    packageName: '',
    packageVersion: 'not-semver',
  });

  const { result } = renderHook(() =>
    useSearchPageForm({
      initialFormData: initialData,
      initialSeverity: 'medium',
    })
  );

  act(() => {
    result.current.isValid();
  });

  expect(result.current.formErrors.packageName).toBe('This field is required');
  expect(result.current.formErrors.packageVersion).toBe('Invalid version format. Example: 1.2.3');
});

test('passes validation when input is correct', () => {
  const initialData = Object.freeze({
    packageName: 'react',
    packageVersion: '1.2.3',
  });

  const { result } = renderHook(() =>
    useSearchPageForm({
      initialFormData: initialData,
      initialSeverity: 'low',
    })
  );

  let valid: boolean;
  act(() => {
    valid = result.current.isValid();
  });

  expect(valid!).toBe(true);
  expect(result.current.formErrors).toEqual({});
});
