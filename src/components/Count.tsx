type CountProps = {
  amount: number;
};

export default function Count({ amount }: CountProps) {
  return (
    <div className='text-xs text-gray-700 '>
      Count: <span className='font-semibold'>{amount}</span>
    </div>
  );
}
