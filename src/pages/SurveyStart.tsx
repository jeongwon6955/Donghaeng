import type { GoToPage } from '../types';
import { Icon, Phone } from '../components';

export function SurveyStart({ go }: { go: GoToPage }) {
  return (
    <Phone>
      <div className="flex flex-1 flex-col items-center justify-between px-6 pb-8 pt-16">
        <div className="flex flex-col items-center gap-6">
          <Icon name="edit_note" className="text-[100px] text-greenMain" />
          <h1 className="text-center text-[30px] font-medium leading-snug text-greenDeep">
            이제 자가진단을
            <br />
            시작하세요
          </h1>
          <p className="text-center text-[17px] leading-relaxed text-[#6a9a75]">
            본격적인 동행을 시작하기 전에
            <br />
            당신의 상황을 파악해 드릴게요
          </p>
        </div>
        <button type="button" className="primary-button h-[52px] rounded-[14px]" onClick={() => go('surveyForm')}>
          자가진단 시작하기 <Icon name="arrow_forward" className="text-base" />
        </button>
      </div>
    </Phone>
  );
}
