import type { GoToPage } from '../types';
import { surveyRows } from '../data/mockData';
import { BottomTabs, Icon, Phone } from '../components';

export function SurveyResult({ go, showReminder }: { go: GoToPage; showReminder: boolean }) {
  return (
    <Phone main bottom={<BottomTabs active="survey" go={go} />}>
      <div className="flex flex-1 flex-col gap-3 overflow-hidden px-4 py-5">
        <div className="flex items-center gap-1 text-[22px] font-medium text-greenDeep">
          <Icon name="assignment" className="text-xl text-greenMain" />
          자가진단 결과
        </div>
        <div className="text-[14px] text-[#7a9a82]">마지막 자가진단: 2026.05.10</div>
        <section className="card flex flex-1 flex-col gap-[7px] overflow-hidden p-3">
          <div className="border-b border-dashed border-[#cde8d8] pb-2 text-[15px] font-medium text-greenDeep">결과 상세</div>
          {surveyRows.map(([label, value]) => (
            <div key={label} className="flex justify-between border-b border-[#e8f0ec] pb-1.5 last:border-0">
              <span className="text-[15px] text-[#5a7a65]">{label}</span>
              <span className="text-[15px] font-medium text-greenMain">{value}</span>
            </div>
          ))}
        </section>
        {showReminder ? (
          <div className="flex items-center gap-1 rounded-lg border-[1.5px] border-dashed border-[#eab308] bg-[#fefce8] px-2.5 py-1.5">
            <Icon name="info" className="text-[16px] text-[#b45309]" />
            <span className="text-[14px] text-[#854d0e]">마지막 자가진단일로부터 1개월 경과 시 노출</span>
          </div>
        ) : null}
        <button type="button" className="primary-button rounded-[10px]" onClick={() => go('surveyForm')}>
          다시 자가진단하기
        </button>
      </div>
    </Phone>
  );
}
