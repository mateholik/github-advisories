import { Input } from '@/components/ui/input';
import ErrorMessage from '../components/ErrorMessage';
import Loader from '../components/Loader';
import { useFetchAdvisoriesList, useFilterAdvisoriesList } from '../lib/hooks';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import Markdown from 'react-markdown';

export default function Homepage() {
  const { advisoriesList, isLoading, error } = useFetchAdvisoriesList();
  const {
    searchText,
    setSearchText,
    setSelectedSeverity,
    severityOptions,
    filteredList,
  } = useFilterAdvisoriesList(advisoriesList);
  return (
    <div>
      {isLoading && <Loader />}

      {error && <ErrorMessage errorMessage={error} />}

      {filteredList && (
        <>
          <div className='grid grid-cols-2 gap-x-4 py-8'>
            <Input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder='Search'
            />
            <Select onValueChange={(value) => setSelectedSeverity(value)}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Severity' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                {severityOptions.map((option) => (
                  <SelectItem
                    className='capitalize'
                    key={option}
                    value={option}
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Accordion type='single' collapsible>
            {filteredList?.map((advisory) => (
              <AccordionItem key={advisory.name} value={advisory.name}>
                <AccordionTrigger>
                  <div className='space-y-2'>
                    <div className='text-xl font-bold'>{advisory.name}</div>

                    <div className='text-xs text-gray-600'>
                      {advisory.cveId}
                    </div>
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
        </>
      )}

      {filteredList && filteredList.length === 0 && (
        <ErrorMessage errorMessage='No items found' />
      )}
    </div>
  );
}
