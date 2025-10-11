import { useEffect, useState } from 'react';
import type { Advisory, ResponseAdvisory } from './types';

export function useAdvisoriesList() {
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
