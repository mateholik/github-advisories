import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ResponseAdvisory, SearchParams } from './types';
import semver from 'semver';
import { useSearchParams } from 'react-router';

export function useClientFilters() {
  const [searchText, setSearchText] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  const debouncedSearchText = useDebounce(searchText, 400);

  const filterByNameAndSeverity = useCallback(
    (item: ResponseAdvisory) => {
      return (
        item.summary.toLowerCase().includes(debouncedSearchText.toLowerCase()) &&
        (selectedSeverity === 'all' || item.severity === selectedSeverity)
      );
    },
    [selectedSeverity, debouncedSearchText]
  );

  const clearForm = () => {
    setSearchText('');
    setSelectedSeverity('all');
  };
  return {
    searchText,
    setSearchText,
    setSelectedSeverity,
    selectedSeverity,
    filterByNameAndSeverity,
    clearForm,
  };
}

type FormData = {
  packageName: string;
  packageVersion: string;
};

type FormErrors = {
  packageName?: string;
  packageVersion?: string;
};

type UseSearchPageForm = {
  initialFormData: FormData;
  initialSeverity: string;
};

export const useSearchPageForm = ({ initialFormData, initialSeverity }: UseSearchPageForm) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [selectedSeverity, setSelectedSeverity] = useState(initialSeverity);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const isValid = () => {
    const errors: FormErrors = {};
    if (!formData.packageName.trim()) errors.packageName = 'This field is required';
    if (formData.packageVersion.trim().length > 0 && !semver.valid(formData.packageVersion.trim()))
      errors.packageVersion = 'Invalid version format. Example: 1.2.3';

    setFormErrors(errors);

    const isValid = !Object.keys(errors).length;
    return isValid;
  };

  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  useEffect(() => {
    setSelectedSeverity(initialSeverity);
  }, [initialSeverity]);

  return {
    formData,
    formErrors,
    handleInputChange,
    isValid,
    setFormData,
    selectedSeverity,
    setSelectedSeverity,
  };
};

export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const affects = searchParams.get('affects') || '';
  const severity = searchParams.get('severity') || 'all';

  const handleSetSearchParams = (name: string, version?: string, severity?: string) => {
    const params: SearchParams = {};
    if (name) params.affects = version ? `${name}@${version}` : name;
    if (severity && severity !== 'all') params.severity = severity;
    setSearchParams(params);
  };
  const searchParamsObject = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams]
  );

  return {
    affects,
    severity,
    handleSetSearchParams,
    searchParamsObject,
  };
}

export function useDebounce<T>(value: T, time = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => setDebouncedValue(value), time);
    return () => clearTimeout(timerId);
  }, [value, time]);

  return debouncedValue;
}
