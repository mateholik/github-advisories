import { Link, Outlet } from 'react-router';

export default function Layout() {
  return (
    <div className='min-h-screen bg-orange-50'>
      <nav className='py-4 bg-blue-100'>
        <div className='container mx-auto px-4 flex justify-between items-center'>
          <Link to='/'>
            <img
              className='w-8 h-8'
              width='32'
              height='32'
              src='/github-logo.svg'
              alt='github-logo'
            />
          </Link>
          <ul className='flex'>
            <li>
              <Link
                className='p-4 hover:bg-blue-200 rounded duration-200'
                to='/'
              >
                Homepage
              </Link>
            </li>
            <li>
              <Link
                className='p-4 hover:bg-blue-200 rounded duration-200'
                to='/search'
              >
                Search
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <main className='container mx-auto px-4'>
        <Outlet />
      </main>
    </div>
  );
}
