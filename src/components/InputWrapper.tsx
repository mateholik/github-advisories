import ErrorMessage from './ErrorMessage';
import { Input } from './ui/input';
import { Label } from './ui/label';

type InputProps = {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  id: string;
  name: string;
  type: string;
  placeholder: string;
};

export default function InputWrapper({
  label,
  value,
  onChange,
  error,
  id,
  name,
  type,
  placeholder,
}: InputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        value={value}
        onChange={onChange}
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        className={error ? 'border-red-600' : 'border-grey-lighter'}
      />
      {error && <ErrorMessage errorMessage={error} />}
    </div>
  );
}
