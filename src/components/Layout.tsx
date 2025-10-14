import { Link, Outlet } from 'react-router';

export default function Layout() {
  return (
    <div className="min-h-screen bg-orange-50">
      <nav className="bg-blue-100 py-4">
        <div className="container mx-auto flex items-center justify-between px-4">
          <Link to="/">
            <img
              className="h-8 w-8"
              width="32"
              height="32"
              src="/github-logo.svg"
              alt="github-logo"
            />
          </Link>
          <ul className="flex">
            <li>
              <Link className="rounded p-4 duration-200 hover:bg-blue-200" to="/">
                Homepage
              </Link>
            </li>
            <li>
              <Link className="rounded p-4 duration-200 hover:bg-blue-200" to="/search">
                Search
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <main className="container mx-auto px-4">
        <Outlet />
      </main>
    </div>
  );
}
