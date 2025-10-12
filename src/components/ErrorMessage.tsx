type ErrorMessageProps = {
  errorMessage: string;
};
export default function ErrorMessage({ errorMessage }: ErrorMessageProps) {
  return (
    <p className='text-red-600 flex items-center text-xs font-medium'>
      <img
        className='mr-2 block size-4'
        src='/error-icon.svg'
        alt='eror-icon'
        width='16'
        height='16'
      />
      {errorMessage}
    </p>
  );
}
