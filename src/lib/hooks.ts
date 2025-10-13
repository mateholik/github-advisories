import { useEffect, useMemo, useState } from 'react';
import type { ResponseAdvisory } from './types';
import semver from 'semver';
import { useSearchParams } from 'react-router';

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

type UseSearchPageForm = {
  initialFormData: FormData;
  initialSeverity: string;
};
type SearchParams = {
  affects?: string;
  severity?: string;
};
export const useSearchPageForm = ({
  initialFormData,
  initialSeverity,
}: UseSearchPageForm) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [selectedSeverity, setSelectedSeverity] = useState(initialSeverity);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  console.log({ initialFormData });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const isValid = () => {
    const errors: FormErrors = {};
    if (!formData.packageName.trim())
      errors.packageName = 'This field is required';
    if (
      formData.packageVersion.trim().length > 0 &&
      !semver.valid(formData.packageVersion.trim())
    )
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

export function useAdvisorySearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const affects = searchParams.get('affects') || '';
  const severity = searchParams.get('severity') || 'all';

  const handleSetSearchParams = (
    name: string,
    version?: string,
    severity?: string
  ) => {
    const params: SearchParams = {};
    if (name) params.affects = version ? `${name}@${version}` : name;
    if (severity && severity !== 'all') params.severity = severity;
    setSearchParams(params);
  };

  return {
    affects,
    severity,
    handleSetSearchParams,

    searchParamsString: searchParams.toString(),
  };
}
