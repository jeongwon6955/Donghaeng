import type { GoToPage } from '../types';
import { Icon, Phone } from '../components';

export function Intro({ go }: { go: GoToPage }) {
  const cards = [
    ['gps_fixed', '맞춤형 목표 설정', '나에게 맞는 목표를 설정해요'],
    ['assignment', '자가진단 기반 분석', '자가진단으로 현재 상황을 파악해요'],
    ['map', '로드맵 제공', '맞춤 로드맵으로 함께 나아가요']
  ];

  return (
    <Phone>
      <div className="flex flex-1 flex-col gap-5 px-5 py-8">
        <h1 className="text-2xl font-medium text-greenDeep">동행을 소개합니다</h1>
        <div className="flex flex-1 flex-col gap-3.5">
          {cards.map(([icon, title, body]) => (
            <div key={title} className="flex items-center gap-2.5 rounded-[10px] border-[1.5px] border-[#cde8d8] bg-[#eef7f2] p-3">
              <Icon name={icon} className="flex-shrink-0 text-2xl text-greenMain" />
              <div>
                <div className="text-[16px] font-medium text-greenDeep">{title}</div>
                <div className="mt-1 text-[14px] text-[#6a9a75]">{body}</div>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="primary-button h-[50px] rounded-[14px]" onClick={() => go('surveyStart')}>
          다음 <Icon name="arrow_forward" className="text-base" />
        </button>
      </div>
    </Phone>
  );
}
