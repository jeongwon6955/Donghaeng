import type { GoToPage } from '../types';
import { Icon, Phone } from '../components';

export function NoGuardian({ go }: { go: GoToPage }) {
  return (
    <Phone>
      <div className="flex flex-1 flex-col items-center justify-between px-6 pb-8 pt-16">
        <div className="flex flex-col items-center gap-5">
          <div className="flex h-[108px] w-[108px] items-center justify-center rounded-full bg-[#eef7f2]">
            <Icon name="volunteer_activism" className="text-[64px] text-greenMain" />
          </div>
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-center text-[28px] font-medium leading-snug text-greenDeep">
              법정 대리인이 없어도
              <br />
              괜찮아요
            </h1>
            <p className="text-center text-[16px] leading-relaxed text-[#6a9a75]">
              보호자 정보를 바로 입력하기 어려운 경우에도
              <br />
              동행이 필요한 과정을 계속 진행할 수 있어요.
            </p>
          </div>
        </div>

        <button type="button" className="primary-button h-[52px] rounded-[14px]" onClick={() => go('surveyStart')}>
          계속하기 <Icon name="arrow_forward" className="text-base" />
        </button>
      </div>
    </Phone>
  );
}
