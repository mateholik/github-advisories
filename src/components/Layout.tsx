import { Outlet, useNavigation } from 'react-router';
import Nav from './Nav';
import Loader from './Loader';

export default function Layout() {
  const navigation = useNavigation();

  const isLoading = navigation.state === 'loading';
  return (
    <div className="min-h-screen bg-orange-50">
      <Nav />
      {isLoading ? (
        <div className="mt-8">
          <Loader />
        </div>
      ) : (
        <main className="container mx-auto px-4">
          <Outlet />
        </main>
      )}
    </div>
  );
}
