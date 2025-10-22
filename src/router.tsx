import { createBrowserRouter } from 'react-router';

import Homepage from './pages/Homepage';
import Search from './pages/Search';
import Error from './pages/Error';
import Layout from './components/Layout';
import { fetchAdvisories } from './lib/api';
import Loader from './components/Loader';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <Error />,
    HydrateFallback: () => (
      <div className="mt-8">
        <Loader />
      </div>
    ),
    children: [
      {
        index: true,
        element: <Homepage />,
        loader: async () => {
          const data = await fetchAdvisories();
          return {
            advisories: data,
          };
        },
      },
      {
        path: '/search',
        element: <Search />,
      },
    ],
  },
]);

export default router;
