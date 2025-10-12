import AdvisoriesList from '@/components/AdvisoriesList';
import ErrorMessage from '@/components/ErrorMessage';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SEVERITI_OPTIONS } from '@/lib/consts';
import type { ResponseAdvisory } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export default function Search() {
  const [packageName, setPackageName] = useState('');
  const [packageVersion, setPackageVersion] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  const {
    data = null,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['advisories', packageName, packageVersion, selectedSeverity],
    queryFn: async (): Promise<ResponseAdvisory[]> => {
      const params = new URLSearchParams();
      if (packageName) params.append('affects', packageName);
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    refetch();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className='grid grid-cols-3 gap-x-4 py-8'>
        <Input
          value={packageName}
          onChange={(event) => setPackageName(event.target.value.trim())}
          placeholder='Package name'
        />
        <Input
          placeholder='Package version'
          value={packageVersion}
          onChange={(event) => setPackageVersion(event.target.value.trim())}
        />
        <Select onValueChange={(value) => setSelectedSeverity(value)}>
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
