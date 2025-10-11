import { Link, Outlet } from 'react-router';

export default function Layout() {
  return (
    <>
      <nav>
        <Link to='/'>Homepage</Link>
        <Link to='/search'>Search</Link>
      </nav>
      <Outlet />
    </>
  );
}
