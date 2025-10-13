import Markdown from 'react-markdown';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { ResponseAdvisory } from '@/lib/types';

type AdvisoriesListProps = {
  advisoriesList: ResponseAdvisory[];
};
export default function AdvisoriesList({
  advisoriesList,
}: AdvisoriesListProps) {
  return (
    <Accordion type='single' collapsible>
      {advisoriesList?.map((advisory) => (
        <AccordionItem key={advisory.ghsa_id} value={advisory.summary}>
          <AccordionTrigger>
            <div className='space-y-2'>
              <div className='md:text-xl font-bold'>{advisory.summary}</div>

              <div className='text-xs text-gray-600'>{advisory.cve_id}</div>
              <div
                className={`border px-2 inline-block rounded
                          ${
                            advisory.severity === 'critical'
                              ? 'text-red-700 border-red-700'
                              : advisory.severity === 'high'
                              ? 'text-red-500 border-red-500 '
                              : advisory.severity === 'medium'
                              ? 'text-yellow-500 border-yellow-500'
                              : ''
                          }`}
              >
                {advisory.severity}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className='prose'>
              <Markdown>{advisory.description}</Markdown>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
