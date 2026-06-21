import { useState } from 'react';
import type { GoToPage } from '../types';
import { questions } from '../data/mockData';
import { Icon, Phone } from '../components';

export function SurveyForm({ go, completeSurvey }: { go: GoToPage; completeSurvey: () => void }) {
  const [index, setIndex] = useState(2);
  const [selected, setSelected] = useState(0);
  const current = questions[index % questions.length];
  const progress = ((index + 1) / 10) * 100;

  const next = () => {
    if (index >= 9) {
      completeSurvey();
      go('surveyComplete');
      return;
    }
    setIndex((value) => value + 1);
    setSelected(0);
  };

  return (
    <Phone>
      <div className="flex flex-1 flex-col gap-5 px-5 py-6">
        <div>
          <div className="mb-2 flex justify-between text-[14px]">
            <span className="text-[#7a9a82]">자가진단 진행</span>
            <span className="font-medium text-greenMain">{index + 1} / 10</span>
          </div>
          <div className="h-[7px] overflow-hidden rounded bg-[#ddf0e5]">
            <div className="survey-progress-fill h-full rounded bg-greenMain" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div>
          <div className="mb-1 text-[14px] text-[#9ab8a4]">Q{index + 1}.</div>
          <h1 className="text-[22px] font-medium leading-normal text-greenDeep">{current.title}</h1>
        </div>
        <div key={index} className="flex flex-1 flex-col gap-2">
          {current.options.map((option, optionIndex) => {
            const checked = selected === optionIndex;
            return (
              <button
                type="button"
                key={option}
                onClick={() => setSelected(optionIndex)}
                className={`survey-option flex h-[56px] items-center gap-3 rounded-xl px-4 text-left ${
                  checked ? 'border-2 border-greenMain bg-[#e8f5ee]' : 'border-[1.5px] border-[#cde8d8] bg-input'
                }`}
                style={{ animationDelay: `${120 + optionIndex * 95}ms` }}
              >
                <span className={`flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full ${checked ? 'bg-greenMain' : 'border-[1.5px] border-[#c5d8cc]'}`}>
                  {checked ? <span className="h-[7px] w-[7px] rounded-full bg-white" /> : null}
                </span>
                <span className={`text-[16px] ${checked ? 'font-medium text-greenDeep' : 'text-[#5a7a65]'}`}>{option}</span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <button type="button" className="flex h-[52px] flex-1 items-center justify-center gap-1 rounded-xl border-[1.5px] border-[#cde8d8] bg-input text-[16px] text-[#5a7a65]" onClick={() => setIndex((value) => Math.max(0, value - 1))}>
            <Icon name="arrow_back" className="text-base" />
            이전
          </button>
          <button type="button" className="primary-button flex-[2]" onClick={next}>
            다음 <Icon name="arrow_forward" className="text-base" />
          </button>
        </div>
      </div>
    </Phone>
  );
}
