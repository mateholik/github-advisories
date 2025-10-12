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
import { useSearchPageForm } from '@/lib/hooks';
import type { ResponseAdvisory } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export default function Search() {
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  const { formData, formErrors, isValid, handleInputChange } =
    useSearchPageForm();

  const {
    data = null,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      'advisories',
      formData.packageName,
      formData.packageVersion,
      selectedSeverity,
    ],
    queryFn: async (): Promise<ResponseAdvisory[]> => {
      const params = new URLSearchParams();
      if (formData.packageName) {
        const affectsValue = formData.packageVersion
          ? `${formData.packageName}@${formData.packageVersion}`
          : formData.packageName;
        params.append('affects', affectsValue);
      }
      if (selectedSeverity !== 'all')
        params.append('severity', selectedSeverity);
      params.append('per_page', '50');

      const response = await fetch(
        `https://api.github.com/advisories?${params.toString()}`
      );
      if (!response.ok) throw new Error('Failed to fetch filtered advisories');
      return await response.json();
    },
    enabled: false,
  });

  console.log(data);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid()) return;
    refetch();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className='grid grid-cols-3 gap-4 py-8'>
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
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Severity' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All</SelectItem>
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
