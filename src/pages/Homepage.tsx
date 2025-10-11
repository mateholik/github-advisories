import ErrorMessage from '../components/ErrorMessage';
import Loader from '../components/Loader';
import { useAdvisoriesList } from '../lib/hooks';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import Markdown from 'react-markdown';

export default function Homepage() {
  const { advisoriesList, isLoading, error } = useAdvisoriesList();

  return (
    <div>
      {isLoading && <Loader />}
      {error && <ErrorMessage errorMessage={error} />}
      {advisoriesList && (
        <Accordion type='single' collapsible>
          {advisoriesList?.map((advisory) => (
            <AccordionItem key={advisory.name} value={advisory.name}>
              <AccordionTrigger>
                <div className='space-y-2'>
                  <div className='font-bold'>{advisory.name}</div>

                  <div className='text-xs text-gray-600'>{advisory.cveId}</div>
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
      )}
    </div>
  );
}
