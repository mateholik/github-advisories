import { Link, Outlet } from 'react-router';

export default function Layout() {
  return (
    <div className='container mx-auto px-4'>
      <nav className='flex gap-x-4 justify-center py-8 bg-blue-100'>
        <Link to='/'>Homepage</Link>
        <Link to='/search'>Search</Link>
      </nav>
      <Outlet />
    </div>
  );
}
