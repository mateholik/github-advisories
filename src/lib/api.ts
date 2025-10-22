import type { ResponseAdvisory } from './types';

export const fetchAdvisories = async (
  params?: Record<string, string>
): Promise<ResponseAdvisory[]> => {
  const query = new URLSearchParams({ ...params, per_page: '50' });

  const response = await fetch(`https://api.github.com/advisories?${query}`);
  const data = await response.json();

  if (!response.ok) throw new Error('fetchAdvisories error: ' + data.message);
  return data;
};
