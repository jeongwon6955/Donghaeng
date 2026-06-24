import type { AgeRange, GoToPage } from '../types';
import { Icon, Phone } from '../components';

export function GettingStarted({ go, ageRange }: { go: GoToPage; ageRange: AgeRange }) {
  const isMinor = ageRange === '16-18';

  return (
    <Phone>
      <div className="flex flex-1 flex-col items-center justify-between px-6 pb-8 pt-16">
        <div className="flex flex-col items-center gap-5">
          <div className="flex h-[108px] w-[108px] items-center justify-center rounded-full bg-[#eef7f2]">
            <Icon name={isMinor ? 'school' : 'workspace_premium'} className="text-[64px] text-greenMain" />
          </div>
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-center text-[28px] font-medium leading-snug text-greenDeep">
              {isMinor ? (
                <>
                  미성년자이시군요!
                  <br />
                  딱 맞는 정책을 찾아드릴게요
                </>
              ) : (
                <>
                  성인이시군요!
                  <br />
                  필요한 지원을 찾아드릴게요
                </>
              )}
            </h1>
            <p className="text-center text-[16px] leading-relaxed text-[#6a9a75]">
              {isMinor ? (
                <>
                  청소년에게 맞는 보호, 교육, 생활 지원 정보를
                  <br />
                  동행이 차근차근 안내해드릴게요.
                </>
              ) : (
                <>
                  생활, 일자리, 자립에 필요한 정책 정보를
                  <br />
                  동행이 보기 쉽게 정리해드릴게요.
                </>
              )}
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
