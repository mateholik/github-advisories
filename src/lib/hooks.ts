import { useEffect, useMemo, useState } from 'react';
import type { Advisory, ResponseAdvisory } from './types';

export function useFetchAdvisoriesList() {
  const [advisoriesList, setAdvisoriesList] = useState<Advisory[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchList() {
      setIsLoading(true);
      try {
        const response = await fetch(
          'https://api.github.com/advisories?per_page=50'
        );
        const data: ResponseAdvisory[] = await response.json();

        if (!response.ok) {
          const errorMessage: string =
            typeof data === 'object' && data !== null && 'message' in data
              ? String(
                  (data as { message?: unknown }).message ??
                    'something went wrong'
                )
              : 'something went wrong';

          throw new Error(errorMessage);
        }

        const mappedData: Advisory[] = data.map((advisory) => ({
          name: advisory.summary || '',
          cveId: advisory.cve_id || '',
          description: advisory.description || '',
          severity: advisory.severity || 'low',
        }));

        console.log(mappedData);

        setAdvisoriesList(mappedData);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }
    fetchList();
  }, []);

  return {
    advisoriesList,
    isLoading,
    error,
  };
}

export function useFilterAdvisoriesList(advisoriesList: Advisory[] | null) {
  const [searchText, setSearchText] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  const severityOptions = useMemo(
    () => Array.from(new Set(advisoriesList?.map((item) => item.severity))),
    [advisoriesList]
  );

  const filteredBySearchAdvisoriesList = useMemo(
    () =>
      advisoriesList?.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
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
    filteredList: filteredBySearchAndSeverityAdvisoriesList,
  };
}
