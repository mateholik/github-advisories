import { useAdvisoriesList } from '../lib/hooks';

export default function Homepage() {
  const { advisoriesList } = useAdvisoriesList();
  return (
    <div>
      <ul>
        {advisoriesList?.map((advisory) => (
          <li className='block'>{advisory.name}</li>
        ))}
      </ul>
    </div>
  );
}
