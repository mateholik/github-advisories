import { isRouteErrorResponse, useRouteError } from 'react-router';

export default function ErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <div className='flex flex-col items-center justify-center h-screen text-center'>
          <h1 className='text-3xl font-bold'>404 - Page Not Found</h1>
          <p className='text-gray-600 mt-2'>
            The page you’re looking for doesn’t exist.
          </p>
        </div>
      );
    }

    return (
      <div className='flex flex-col items-center justify-center h-screen text-center'>
        <h1 className='text-2xl font-bold'>
          {error.status} - {error.statusText}
        </h1>
        <p className='text-gray-600 mt-2'>
          {error.data || 'Something went wrong.'}
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen text-center'>
      <h1 className='text-2xl font-bold'>Unexpected Error</h1>
      <p className='text-gray-600 mt-2'>
        {(error as Error)?.message || 'Unknown error'}
      </p>
    </div>
  );
}
