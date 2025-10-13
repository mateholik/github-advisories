import AdvisoriesList from '@/components/AdvisoriesList';
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
import { SEVERITI_OPTIONS } from '@/lib/consts';
import { useAdvisorySearchParams, useSearchPageForm } from '@/lib/hooks';
import type { ResponseAdvisory } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export default function Search() {
  const { affects, severity, handleSetSearchParams, searchParamsString } =
    useAdvisorySearchParams();

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

  const fetchAdvisories = async (): Promise<ResponseAdvisory[]> => {
    const response = await fetch(
      `https://api.github.com/advisories?${searchParamsString}&per_page=50`
    );
    if (!response.ok) throw new Error('Failed to fetch filtered advisories');
    return await response.json();
  };

  const {
    data = null,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ['advisories', affects, severity],
    queryFn: () => fetchAdvisories(),
    enabled: !!affects,
    staleTime: 1000 * 60 * 5,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid()) return;

    handleSetSearchParams(
      formData.packageName,
      formData.packageVersion,
      selectedSeverity
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className='grid md:grid-cols-3 gap-4 py-8'>
        <InputWrapper
          label='Package Name'
          value={formData.packageName}
          onChange={handleInputChange}
          id='packageName'
          name='packageName'
          type='text'
          placeholder='react'
          error={formErrors.packageName}
        />
        <InputWrapper
          label='Package Version'
          value={formData.packageVersion}
          onChange={handleInputChange}
          id='packageVersion'
          name='packageVersion'
          type='text'
          placeholder='19.1.1'
          error={formErrors.packageVersion}
        />
        <div className='space-y-2'>
          <Label>Severity</Label>
          <Select
            name='severity'
            onValueChange={(value) => setSelectedSeverity(value)}
            value={selectedSeverity}
          >
            <SelectTrigger className='w-full'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SEVERITI_OPTIONS.map((option) => (
                <SelectItem className='capitalize' key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type='submit'>Search</Button>
      </form>
      {isFetching && <Loader />}

      {isError && <ErrorMessage errorMessage={error.message} />}

      {data &&
        !isFetching &&
        !isError &&
        (data.length > 0 ? (
          <AdvisoriesList advisoriesList={data} />
        ) : (
          <ErrorMessage errorMessage='No advisories found' />
        ))}
    </div>
  );
}
