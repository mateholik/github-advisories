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
                <div>
                  <div className='font-medium'>{advisory.name}</div>

                  <div className='text-xs'>{advisory.cveId}</div>
                  <div>{advisory.severity}</div>
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
