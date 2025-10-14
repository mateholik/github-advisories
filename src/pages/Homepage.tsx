import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import ErrorMessage from '@/components/ErrorMessage';
import Loader from '@/components/Loader';
import AdvisoriesList from '@/components/AdvisoriesList';
import Count from '@/components/Count';
import InputWrapper from '@/components/InputWrapper';
import SelectWrapper from '@/components/SelectWrapper';
import { Button } from '@/components/ui/button';

import { useClientFilters } from '@/lib/hooks';
import { SEVERITY_OPTIONS } from '@/lib/consts';
import { fetchAdvisories } from '@/lib/api';

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
        <div className="pt-8">
          <Loader />
        </div>
      )}

      {isError && <ErrorMessage errorMessage={error.message} />}

      {filteredList && !isError && !isFetching && (
        <>
          <h1 className="py-12 text-center text-2xl md:py-20 md:text-4xl">
            50 Latest global security advisories
          </h1>
          <div className="mb-4 grid gap-4 md:grid-cols-3">
            <InputWrapper
              type="text"
              id="search"
              name="search"
              label="Search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="xss"
            />

            <SelectWrapper
              label="Severity"
              onChange={setSelectedSeverity}
              options={SEVERITY_OPTIONS}
              value={selectedSeverity}
            />

            <Button className="self-end" onClick={clearForm}>
              Clear
            </Button>
          </div>
          <div className="mb-8">
            <Count amount={filteredList.length} />
          </div>

          <AdvisoriesList advisoriesList={filteredList} />

          {filteredList.length === 0 && <ErrorMessage errorMessage="No items found" />}
        </>
      )}
    </div>
  );
}
