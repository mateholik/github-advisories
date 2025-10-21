import type { ResponseAdvisory } from '@/lib/types';
import AdvisoriesList from './AdvisoriesList';
import Count from './Count';
import ErrorMessage from './ErrorMessage';

type AdvisoriesListHolderProps = {
  filteredList: ResponseAdvisory[];
};

export default function AdvisoriesListHolder({ filteredList }: AdvisoriesListHolderProps) {
  return (
    <section>
      {filteredList.length > 0 && (
        <div className="mb-8">
          <Count amount={filteredList.length} />
        </div>
      )}

      <AdvisoriesList advisoriesList={filteredList} />

      {filteredList.length === 0 && <ErrorMessage errorMessage="No items found" />}
    </section>
  );
}
