import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import AdvisoriesList from '@/components/AdvisoriesList';
import Count from '@/components/Count';
import ErrorMessage from '@/components/ErrorMessage';
import InputWrapper from '@/components/InputWrapper';
import Loader from '@/components/Loader';
import SelectWrapper from '@/components/SelectWrapper';
import { Button } from '@/components/ui/button';

import { fetchAdvisories } from '@/lib/api';
import { SEVERITY_OPTIONS } from '@/lib/consts';
import { useQueryParams, useSearchPageForm } from '@/lib/hooks';

export default function Search() {
  const { affects, severity, handleSetSearchParams, searchParamsObject } = useQueryParams();

  const [packageName = '', packageVersion = ''] = affects.split('@');

  const initialFormData = useMemo(
    () => ({
      packageName: packageName,
      packageVersion: packageVersion,
    }),
    [packageName, packageVersion]
  );

  const {
    formData,
    formErrors,
    isValid,
    handleInputChange,
    selectedSeverity,
    setSelectedSeverity,
  } = useSearchPageForm({
    initialFormData: initialFormData,
    initialSeverity: severity,
  });

  const {
    data = null,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ['advisories', affects, severity],
    queryFn: () => fetchAdvisories(searchParamsObject),
    enabled: !!affects,
    staleTime: 1000 * 60 * 5,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid()) return;

    handleSetSearchParams(formData.packageName, formData.packageVersion, selectedSeverity);
  };

  return (
    <div>
      <h1 className="py-12 text-center text-2xl md:py-20 md:text-4xl">
        Search for Latest global security advisories
      </h1>
      <form onSubmit={handleSubmit} className="mb-4 grid gap-4 md:grid-cols-3">
        <InputWrapper
          label="Package Name"
          value={formData.packageName}
          onChange={handleInputChange}
          id="packageName"
          name="packageName"
          type="text"
          placeholder="react"
          error={formErrors.packageName}
        />
        <InputWrapper
          label="Package Version"
          value={formData.packageVersion}
          onChange={handleInputChange}
          id="packageVersion"
          name="packageVersion"
          type="text"
          placeholder="19.1.1"
          error={formErrors.packageVersion}
        />
        <SelectWrapper
          label="Severity"
          onChange={setSelectedSeverity}
          options={SEVERITY_OPTIONS}
          value={selectedSeverity}
        />

        <Button type="submit">Search</Button>
      </form>

      {isFetching && <Loader />}

      {isError && <ErrorMessage errorMessage={error.message} />}

      {data &&
        !isFetching &&
        !isError &&
        (data.length > 0 ? (
          <>
            <div className="mb-4">
              <Count amount={data.length} />
            </div>
            <AdvisoriesList advisoriesList={data} />
          </>
        ) : (
          <ErrorMessage errorMessage="No advisories found" />
        ))}
    </div>
  );
}
