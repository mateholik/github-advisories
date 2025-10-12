import { useMemo, useState } from 'react';
import type { ResponseAdvisory } from './types';

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
