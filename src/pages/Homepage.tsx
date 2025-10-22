import { useMemo } from 'react';

import InputWrapper from '@/components/InputWrapper';
import SelectWrapper from '@/components/SelectWrapper';
import { Button } from '@/components/ui/button';

import { useClientFilters } from '@/lib/hooks';
import { SEVERITY_OPTIONS } from '@/lib/consts';
import AdvisoriesListHolder from '@/components/AdvisoriesListHolder';
import { useLoaderData } from 'react-router';

export default function Homepage() {
  const { advisories } = useLoaderData();

  const {
    searchText,
    setSearchText,
    setSelectedSeverity,
    filterByNameAndSeverity,
    clearForm,
    selectedSeverity,
  } = useClientFilters();

  const filteredList = useMemo(
    () => advisories?.filter(filterByNameAndSeverity) || [],
    [advisories, filterByNameAndSeverity]
  );

  return (
    <div>
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
        <AdvisoriesListHolder filteredList={filteredList} />
      </div>
    </div>
  );
}
