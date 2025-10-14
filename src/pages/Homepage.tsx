import { Input } from '@/components/ui/input';
import ErrorMessage from '../components/ErrorMessage';
import Loader from '../components/Loader';
import { useClientFilters } from '../lib/hooks';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AdvisoriesList from '@/components/AdvisoriesList';

import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { SEVERITY_OPTIONS } from '@/lib/consts';
import { useMemo } from 'react';
import { fetchAdvisories } from '@/lib/api';
import Count from '@/components/Count';

export default function Homepage() {
  const {
    data = null,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ['advisories'],
    queryFn: () => fetchAdvisories(),
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const {
    searchText,
    setSearchText,
    setSelectedSeverity,
    filterByNameAndSeverity,
    clearForm,
    selectedSeverity,
  } = useClientFilters();

  const filteredList = useMemo(
    () => data?.filter(filterByNameAndSeverity) || [],
    [data, filterByNameAndSeverity]
  );

  return (
    <div>
      {isFetching && (
        <div className='pt-8'>
          <Loader />
        </div>
      )}

      {isError && <ErrorMessage errorMessage={error.message} />}

      {filteredList && !isError && !isFetching && (
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
                {SEVERITY_OPTIONS.map((option) => (
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
          <div className='-mt-4 mb-4'>
            <Count amount={filteredList.length} />
          </div>

          <AdvisoriesList advisoriesList={filteredList} />

          {filteredList.length === 0 && (
            <ErrorMessage errorMessage='No items found' />
          )}
        </>
      )}
    </div>
  );
}
