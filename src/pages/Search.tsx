import AdvisoriesList from '@/components/AdvisoriesList';
import Count from '@/components/Count';
import ErrorMessage from '@/components/ErrorMessage';
import InputWrapper from '@/components/InputWrapper';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchAdvisories } from '@/lib/api';
import { SEVERITY_OPTIONS } from '@/lib/consts';
import { useQueryParams, useSearchPageForm } from '@/lib/hooks';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

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
      <form onSubmit={handleSubmit} className="grid gap-4 py-8 md:grid-cols-3">
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
        <div className="space-y-2">
          <Label>Severity</Label>
          <Select
            name="severity"
            onValueChange={(value) => setSelectedSeverity(value)}
            value={selectedSeverity}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SEVERITY_OPTIONS.map((option) => (
                <SelectItem className="capitalize" key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Search</Button>
      </form>

      {isFetching && <Loader />}

      {isError && <ErrorMessage errorMessage={error.message} />}

      {data &&
        !isFetching &&
        !isError &&
        (data.length > 0 ? (
          <>
            <div className="-mt-4 mb-4">
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
