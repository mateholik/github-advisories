import { Input } from '@/components/ui/input';
import ErrorMessage from '../components/ErrorMessage';
import Loader from '../components/Loader';
import { useFilterAdvisoriesList } from '../lib/hooks';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AdvisoriesList from '@/components/AdvisoriesList';

import { useQuery } from '@tanstack/react-query';
import type { ResponseAdvisory } from '@/lib/types';
import { Button } from '@/components/ui/button';

export default function Homepage() {
  const {
    data = null,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ['advisories'],
    queryFn: async (): Promise<ResponseAdvisory[]> => {
      const response = await fetch(
        'https://api.github.com/advisories?per_page=50'
      );
      if (!response.ok) throw new Error('Failed to fetch advisories');
      return await response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const {
    searchText,
    setSearchText,
    setSelectedSeverity,
    severityOptions,
    filteredAdvisoriesList,
    clearForm,
    selectedSeverity,
  } = useFilterAdvisoriesList(data);

  return (
    <div>
      {isFetching && (
        <div className='pt-8'>
          <Loader />
        </div>
      )}

      {isError && <ErrorMessage errorMessage={error.message} />}

      {filteredAdvisoriesList && !isError && !isFetching && (
        <>
          <div className='grid md:grid-cols-3 gap-4 py-8'>
            <Input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder='Search'
            />
            <Select
              value={selectedSeverity}
              onValueChange={(value) => setSelectedSeverity(value)}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Severity' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                {severityOptions.map((option) => (
                  <SelectItem
                    className='capitalize'
                    key={option}
                    value={option}
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={clearForm}>Clear</Button>
          </div>

          <AdvisoriesList advisoriesList={filteredAdvisoriesList} />

          {filteredAdvisoriesList.length === 0 && (
            <ErrorMessage errorMessage='No items found' />
          )}
        </>
      )}
    </div>
  );
}
