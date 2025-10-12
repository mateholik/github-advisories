import { useMemo, useState } from 'react';
import type { ResponseAdvisory } from './types';

export function useFilterAdvisoriesList(
  advisoriesList: ResponseAdvisory[] | null
) {
  const [searchText, setSearchText] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  const severityOptions = useMemo(
    () =>
      Array.from(new Set(advisoriesList?.map((item) => item.severity) || [])),
    [advisoriesList]
  );

  const filteredBySearchAdvisoriesList = useMemo(
    () =>
      advisoriesList?.filter((item) =>
        item.summary.toLowerCase().includes(searchText.toLowerCase())
      ),
    [advisoriesList, searchText]
  );

  const filteredBySearchAndSeverityAdvisoriesList = useMemo(
    () =>
      selectedSeverity === 'all'
        ? filteredBySearchAdvisoriesList
        : filteredBySearchAdvisoriesList?.filter(
            (item) => item.severity === selectedSeverity
          ),
    [filteredBySearchAdvisoriesList, selectedSeverity]
  );
  return {
    searchText,
    setSearchText,
    setSelectedSeverity,
    severityOptions,
    filteredAdvisoriesList: filteredBySearchAndSeverityAdvisoriesList,
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

export const useSearchPageForm = () => {
  const [formData, setFormData] = useState<FormData>({
    packageName: '',
    packageVersion: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const isValid = () => {
    const errors: FormErrors = {};
    if (!formData.packageName.trim())
      errors.packageName = 'This field is required';
    if (!formData.packageVersion.trim())
      errors.packageVersion = 'This field is required';

    setFormErrors(errors);

    const isValid = !Object.keys(errors).length;
    return isValid;
  };

  return {
    formData,
    formErrors,
    handleInputChange,
    isValid,
  };
};
