import { useId } from 'react';

export type CountryCode = '+82' | '+1';

const countries: { code: CountryCode; label: string }[] = [
  { code: '+82', label: '대한민국' },
  { code: '+1', label: '미국' }
];

export function PhoneNumberField({
  label,
  countryCode,
  onCountryCodeChange,
  value,
  onChange,
  placeholder
}: {
  label: string;
  countryCode: CountryCode;
  onCountryCodeChange: (countryCode: CountryCode) => void;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const inputId = useId();

  return (
    <div className="block w-full">
      <label htmlFor={inputId} className="field-label">
        {label}
      </label>
      <div className="flex h-12 w-full overflow-hidden rounded-[10px] border-[1.5px] border-[#c5d8cc] bg-input focus-within:border-greenMain">
        <select
          className="w-[126px] border-r-[1.5px] border-[#c5d8cc] bg-input px-2 text-[14px] font-medium text-greenDeep outline-none"
          value={countryCode}
          aria-label="국가번호"
          onChange={(event) => onCountryCodeChange(event.target.value as CountryCode)}
        >
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.label} {country.code}
            </option>
          ))}
        </select>
        <input
          id={inputId}
          className="min-w-0 flex-1 bg-input px-3 text-[15px] text-greenDeep outline-none placeholder:text-[#b7b7b7]"
          type="tel"
          inputMode="tel"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
