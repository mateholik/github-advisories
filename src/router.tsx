import { createBrowserRouter } from 'react-router';

import Homepage from './pages/Homepage';
import Search from './pages/Search';
import Error from './pages/Error';
import Layout from './components/Layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: '/search',
        element: <Search />,
      },
    ],
  },
]);

export default router;
