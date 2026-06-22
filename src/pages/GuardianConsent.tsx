import { useState } from 'react';
import type { GoToPage } from '../types';
import { Icon, Phone, PhoneNumberField, TextField } from '../components';
import type { CountryCode } from '../components/PhoneNumberField';

export function GuardianConsent({ go }: { go: GoToPage }) {
  const [guardianCountryCode, setGuardianCountryCode] = useState<CountryCode>('+82');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const canRequestCode = guardianPhone.trim().length > 0;
  const canContinue = verificationSent ? verificationCode.trim().length > 0 : canRequestCode;

  const next = () => {
    if (!canContinue) return;
    if (!verificationSent) {
      setVerificationSent(true);
      return;
    }
    go('surveyStart');
  };

  const changeGuardianPhone = (value: string) => {
    setGuardianPhone(value);
    setVerificationSent(false);
    setVerificationCode('');
  };

  const changeGuardianCountryCode = (value: CountryCode) => {
    setGuardianCountryCode(value);
    setVerificationSent(false);
    setVerificationCode('');
  };

  return (
    <Phone>
      <div className="flex flex-1 flex-col gap-5 px-6 py-8">
        <div className="flex flex-col gap-2">
          <Icon name="family_restroom" className="text-[52px] text-greenMain" />
          <h1 className="text-[26px] font-medium leading-snug text-greenDeep">미성년자는 보호자의 동의가 필요해요</h1>
          <p className="text-[15px] leading-relaxed text-[#6a9a75]">
            법정 대리인에게 동의 요청을 보낼 수 있도록 전화번호를 입력해주세요.
          </p>
        </div>

        <PhoneNumberField
          label="법정 대리인 전화번호"
          countryCode={guardianCountryCode}
          onCountryCodeChange={changeGuardianCountryCode}
          value={guardianPhone}
          onChange={changeGuardianPhone}
          placeholder="전화번호를 입력하세요"
        />

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

        <div className="mt-auto flex flex-col gap-2.5">
          <button
            type="button"
            className={`primary-button h-[52px] rounded-[14px] ${canContinue ? '' : 'opacity-50'}`}
            disabled={!canContinue}
            onClick={next}
          >
            {verificationSent ? '다음' : '동의 요청하기'} <Icon name="arrow_forward" className="text-base" />
          </button>
          <button
            type="button"
            className="secondary-button h-[52px] rounded-[14px]"
            onClick={() => go('noGuardian')}
          >
            법정 대리인 번호가 없어요
          </button>
        </div>
      </div>
    </Phone>
  );
}
