import Markdown from 'react-markdown';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { ResponseAdvisory } from '@/lib/types';
import { memo } from 'react';
import { SEVERITY_STYLES } from '@/lib/consts';

type AdvisoriesListProps = {
  advisoriesList: ResponseAdvisory[];
};
const AdvisoriesList = memo(({ advisoriesList }: AdvisoriesListProps) => {
  return (
    <Accordion type="single" collapsible>
      {advisoriesList?.map((advisory) => (
        <AccordionItem key={advisory.ghsa_id} value={advisory.ghsa_id}>
          <AccordionTrigger>
            <div className="space-y-2">
              <div className="font-bold md:text-xl">{advisory.summary}</div>

              <div className="text-xs text-gray-600">{advisory.cve_id}</div>
              <div
                className={`inline-block rounded border px-2 ${
                  SEVERITY_STYLES[advisory.severity] ?? ''
                }`}
              >
                {advisory.severity}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="prose">
              <Markdown>{advisory.description}</Markdown>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
});

export default AdvisoriesList;
