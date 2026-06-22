import { useId, type ReactNode } from 'react';

export function TextField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  rightElement
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: boolean;
  rightElement?: ReactNode;
}) {
  const inputId = useId();

  return (
    <div className="block w-full">
      <label htmlFor={inputId} className={`field-label ${error ? '!text-[#c0392b]' : ''}`}>
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          className={`field-input ${rightElement ? 'pr-11' : ''} ${error ? '!border-2 !border-[#c0392b] !bg-[#fff5f5] !text-[#c0392b]' : ''}`}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
        {rightElement ? <div className="absolute inset-y-0 right-3 flex items-center">{rightElement}</div> : null}
      </div>
    </div>
  );
}
