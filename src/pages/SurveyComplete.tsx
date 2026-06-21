import type { GoToPage } from '../types';
import { surveyRows } from '../data/mockData';
import { Icon, Phone } from '../components';

export function SurveyComplete({ go }: { go: GoToPage }) {
  return (
    <Phone>
      <div className="flex flex-1 flex-col gap-5 px-5 py-8">
        <div className="text-center">
          <div className="mb-2 flex justify-center">
            <Icon name="check_circle" className="text-5xl text-greenMain" />
          </div>
          <h1 className="text-[26px] font-medium text-greenDeep">자가진단이 완료되었습니다!</h1>
          <div className="mt-1 text-[14px] text-[#7a9a82]">2026.06.21 완료</div>
        </div>
        <section className="flex flex-1 flex-col gap-[7px] rounded-xl border-[1.5px] border-[#cde8d8] bg-[#eef7f2] p-3">
          <div className="border-b border-dashed border-[#cde8d8] pb-2 text-[15px] font-medium text-greenDeep">상세 자가진단 결과</div>
          {[...surveyRows.slice(0, 3), ['추천 경로', '성장 집중형']].map(([label, value]) => (
            <div key={label} className="flex justify-between border-b border-[#d8ede3] pb-1.5 last:border-0">
              <span className="text-[15px] text-[#5a7a65]">{label}</span>
              <span className="text-[15px] font-medium text-greenMain">{value}</span>
            </div>
          ))}
        </section>
        <div className="flex gap-2">
          <button type="button" className="secondary-button" onClick={() => go('dashboard')}>
            홈으로
          </button>
          <button type="button" className="primary-button" onClick={() => go('roadmap')}>
            로드맵 확인 <Icon name="arrow_forward" className="text-[18px]" />
          </button>
        </div>
      </div>
    </Phone>
  );
}
