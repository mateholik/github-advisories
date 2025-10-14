import { Outlet } from 'react-router';
import Nav from './Nav';

export default function Layout() {
  return (
    <div className="min-h-screen bg-orange-50">
      <Nav />
      <main className="container mx-auto px-4">
        <Outlet />
      </main>
    </div>
  );
}
