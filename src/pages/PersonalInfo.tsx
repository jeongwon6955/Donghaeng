import { useState } from 'react';
import type { GoToPage } from '../types';
import { Icon, Phone, PhoneNumberField, TextField } from '../components';
import type { CountryCode } from '../components/PhoneNumberField';

type AgeRange = '16-18' | '19-25';

export function PersonalInfo({ go }: { go: GoToPage }) {
  const [countryCode, setCountryCode] = useState<CountryCode>('+82');
  const [phone, setPhone] = useState('');
  const [ageRange, setAgeRange] = useState<AgeRange | ''>('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const canRequestCode = phone.trim().length > 0 && ageRange.length > 0;
  const canContinue = verificationSent ? verificationCode.trim().length > 0 : canRequestCode;

  const next = () => {
    if (!canContinue) return;
    if (!verificationSent) {
      setVerificationSent(true);
      return;
    }
    go(ageRange === '16-18' ? 'guardianConsent' : 'surveyStart');
  };

  const changePhone = (value: string) => {
    setPhone(value);
    setVerificationSent(false);
    setVerificationCode('');
  };

  const changeCountryCode = (value: CountryCode) => {
    setCountryCode(value);
    setVerificationSent(false);
    setVerificationCode('');
  };

  return (
    <Phone>
      <div className="flex flex-1 flex-col gap-5 px-6 py-8">
        <div className="flex flex-col gap-2">
          <Icon name="shield_person" className="text-[48px] text-greenMain" />
          <h1 className="text-[26px] font-medium leading-snug text-greenDeep">개인정보를 입력해주세요</h1>
          <p className="text-[15px] leading-relaxed text-[#6a9a75]">
            동행 서비스 이용을 위해 본인 확인에 필요한 정보만 받을게요.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <PhoneNumberField
            label="전화번호"
            countryCode={countryCode}
            onCountryCodeChange={changeCountryCode}
            value={phone}
            onChange={changePhone}
            placeholder="전화번호를 입력하세요"
          />

          <div>
            <div className="field-label">나이</div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                ['16-18', '16-18세'],
                ['19-25', '19-25세']
              ].map(([value, label]) => {
                const selected = ageRange === value;

                return (
                  <button
                    key={value}
                    type="button"
                    className={`flex h-12 items-center justify-center rounded-[10px] border-[1.5px] text-[15px] font-medium ${
                      selected ? 'border-greenMain bg-[#eef7f2] text-greenDeep' : 'border-[#c5d8cc] bg-input text-[#6a9a75]'
                    }`}
                    onClick={() => setAgeRange(value as AgeRange)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {verificationSent ? (
            <TextField
              label="인증번호"
              type="tel"
              value={verificationCode}
              onChange={setVerificationCode}
              placeholder="인증번호를 입력하세요"
              rightElement={<span className="text-[14px] font-medium text-greenMain">2:00</span>}
            />
          ) : null}
        </div>

        <div className="mt-auto">
          <button
            type="button"
            className={`primary-button h-[52px] rounded-[14px] ${canContinue ? '' : 'opacity-50'}`}
            disabled={!canContinue}
            onClick={next}
          >
            다음 <Icon name="arrow_forward" className="text-base" />
          </button>
        </div>
      </div>
    </Phone>
  );
}
