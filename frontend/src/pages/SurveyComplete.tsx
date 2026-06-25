import type { GoToPage } from '../types';
import { Icon, Phone } from '../components';

const profileRows = [
  ['학업·진로', 35],
  ['경제', 25],
  ['정서', 15],
  ['정보연결', 15],
  ['휴식·회복', 10]
] as const;

export function SurveyComplete({ go }: { go: GoToPage }) {
  return (
    <Phone>
      <div className="flex flex-1 flex-col gap-4 px-5 py-6">
        <div className="flex-shrink-0 text-center">
          <div className="mb-2 flex justify-center">
            <Icon name="check_circle" className="text-[46px] text-greenMain" />
          </div>
          <h1 className="text-[22px] font-medium text-greenDeep">자가진단이 완료되었습니다</h1>
          <div className="mt-1 text-[13px] text-[#7a9a82]">2026.06.21 완료</div>
        </div>

        <div className="flex flex-col gap-5 py-1 pl-0.5">
          <section className="survey-option rounded-xl border-[1.5px] border-[#cde8d8] bg-[#eef7f2] px-5 py-5" style={{ animationDelay: '120ms' }}>
            <div className="mb-3 flex items-center gap-1 text-[14px] font-medium text-greenMain">
              <Icon name="stars" className="text-[17px]" />
              한 줄 결과
            </div>
            <p className="text-[14px] font-medium leading-[1.8] text-[#385945]">
              “가족 돌봄으로 인해 <strong className="font-bold text-greenDeep">학업·진로 부담</strong>과{' '}
              <strong className="font-bold text-greenDeep">경제적 부담</strong>이 가장 크게 나타나고 있으며, 정서적 지원도 함께 필요한 상황으로 보입니다.”
            </p>
          </section>

          <section className="survey-option card px-5 py-5" style={{ animationDelay: '240ms' }}>
            <div className="mb-3 flex items-center gap-1 text-[16px] font-medium text-greenDeep">
              <Icon name="psychology" className="text-[18px] text-greenMain" />
              AI 상황 요약
            </div>
            <div className="space-y-3 text-[13px] leading-[1.75] text-[#4f6f59]">
              <p>
                현재 부모를 돌보는 역할을 하고 있으며, 가족 돌봄으로 인해 공부 시간 확보와 진로 준비에 어려움을 겪고 있는 것으로 나타났습니다.
              </p>
              <p>또한 병원비와 생활비에 대한 부담을 느끼고 있어 경제적 어려움도 함께 경험하고 있습니다.</p>
              <p>
                필요한 도움으로 장학금 정보, 진로·취업 지원, 생활비 지원을 선택했으며, 의지할 수 있는 사람이 많지 않다고 응답했습니다.
              </p>
              <p>학업·진로 지원과 경제 지원을 우선적으로 살펴보고, 정서적 부담을 줄일 수 있는 지원도 함께 확인해보는 것이 도움이 될 수 있습니다.</p>
            </div>
          </section>

          <section className="survey-option card px-5 py-5" style={{ animationDelay: '360ms' }}>
            <div className="mb-4 flex items-center gap-1 text-[16px] font-medium text-greenDeep">
              <Icon name="bar_chart" className="text-[18px] text-greenMain" />
              현재 도움 필요 프로필
            </div>
            <div className="flex flex-col gap-3.5">
              {profileRows.map(([label, percent]) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="w-[64px] flex-shrink-0 text-[10px] font-medium text-greenDeep">{label}</span>
                  <div className="flex-1 overflow-hidden rounded bg-[#cfe6d9]" style={{ height: 10, minHeight: 10 }}>
                    <div className="rounded bg-greenMain" style={{ width: `${percent}%`, minWidth: percent > 0 ? 5 : 0, height: '100%' }} />
                  </div>
                  <span className="w-[32px] flex-shrink-0 text-right text-[11px] font-medium text-greenMain">{percent}%</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-shrink-0 gap-2.5 pt-1">
          <button
            type="button"
            className="flex h-[52px] min-w-0 flex-1 items-center justify-center rounded-xl border-[1.5px] border-greenMain bg-ivory px-3 text-[15px] font-medium text-greenMain"
            onClick={() => go('dashboard')}
          >
            홈으로
          </button>
          <button
            type="button"
            className="flex h-[52px] min-w-0 flex-[1.6] items-center justify-center gap-1 rounded-xl bg-greenMain px-3 text-[14px] font-medium text-white"
            onClick={() => go('roadmapCurrent')}
          >
            <span className="whitespace-nowrap">동행 발자국 확인</span>
            <Icon name="arrow_forward" className="text-[17px]" />
          </button>
        </div>
      </div>
    </Phone>
  );
}
