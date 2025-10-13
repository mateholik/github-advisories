import type { ResponseAdvisory } from './types';

export const fetchAdvisories = async (
  params?: Record<string, string>
): Promise<ResponseAdvisory[]> => {
  const query = new URLSearchParams({ ...params, per_page: '50' });

  const response = await fetch(`https://api.github.com/advisories?${query}`);
  if (!response.ok) throw new Error('Failed to fetch filtered advisories');
  return await response.json();
};
