export function TextField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: boolean;
}) {
  return (
    <label className="block w-full">
      <div className={`field-label ${error ? '!text-[#c0392b]' : ''}`}>{label}</div>
      <input
        className={`field-input ${error ? '!border-2 !border-[#c0392b] !bg-[#fff5f5] !text-[#c0392b]' : ''}`}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}
