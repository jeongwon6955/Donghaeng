import { useState } from 'react';
import type { AgeRange, GoToPage } from '../types';
import { Icon, Phone, Toast } from '../components';
import { updateTrackType } from '../api/auth';

export function PersonalInfo({
  go,
  onAgeRangeSelect,
  isGuest
}: {
  go: GoToPage;
  onAgeRangeSelect: (ageRange: AgeRange) => void;
  isGuest: boolean;
}) {
  const [ageRange, setAgeRange] = useState<AgeRange | ''>('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const canContinue = ageRange.length > 0 && !submitting;

  const showToast = (nextMessage: string) => {
    setMessage(nextMessage);
    window.setTimeout(() => {
      setMessage((current) => (current === nextMessage ? '' : current));
    }, 2600);
  };

  const next = async () => {
    if (!ageRange) return;

    try {
      setSubmitting(true);
      setMessage('');

      if (!isGuest) {
        await updateTrackType(ageRange === '16-18' ? 1 : 2);
      }

      onAgeRangeSelect(ageRange);
      go('gettingStarted');
    } catch (error) {
      showToast(error instanceof Error ? error.message : '나이 트랙 저장에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Phone>
      {message ? <Toast message={message} onClose={() => setMessage('')} /> : null}
      <div className="flex flex-1 flex-col gap-6 px-6 py-8">
        <div className="flex flex-col gap-2">
          <Icon name="person_search" className="text-[52px] text-greenMain" />
          <h1 className="text-[26px] font-medium leading-snug text-greenDeep">나이를 선택해주세요</h1>
          <p className="text-[15px] leading-relaxed text-[#6a9a75]">
            선택한 나이에 맞춰 필요한 정책과 지원 정보를 찾아드릴게요.
          </p>
        </div>

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

        <div className="mt-auto">
          <button
            type="button"
            className={`primary-button h-[52px] rounded-[14px] ${canContinue ? '' : 'opacity-50'}`}
            disabled={!canContinue}
            onClick={next}
          >
            {submitting ? '저장 중...' : '다음'} <Icon name="arrow_forward" className="text-base" />
          </button>
        </div>
      </div>
    </Phone>
  );
}
