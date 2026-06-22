import type { GoToPage } from '../types';
import { surveyRows, user } from '../data/mockData';
import { BottomTabs, Icon, Phone } from '../components';

export function Dashboard({ go }: { go: GoToPage }) {
  return (
    <Phone main bottom={<BottomTabs active="home" go={go} />}>
      <div className="flex flex-1 flex-col gap-3 overflow-hidden px-4 pt-4">
        <button type="button" className="card flex items-center justify-between px-4 py-3 text-left" onClick={() => go('mypage')}>
          <div>
            <div className="text-[20px] font-medium text-greenDeep">{user.name} 님</div>
            <div className="mt-1 text-[14px] text-[#7a9a82]">
              {user.role}
            </div>
          </div>
          <Icon name="chevron_right" className="text-[22px] text-greenMain" />
        </button>
        <section className="card p-3">
          <div className="mb-3 flex items-center gap-1 text-[18px] font-medium text-greenDeep">
            <Icon name="assignment" className="text-xl text-greenMain" />
            자가진단 결과 요약
          </div>
          <div className="grid grid-cols-2 gap-2">
            {surveyRows.map(([label, value]) => (
              <div key={label} className="rounded-lg bg-[#eef7f2] px-2 py-2">
                <div className="text-[14px] text-[#7a9a82]">{label}</div>
                <div className="mt-1 text-[15px] font-medium text-greenMain">{value}</div>
              </div>
            ))}
          </div>
        </section>
        <section className="card flex-1 p-3">
          <div className="mb-3 flex items-center gap-1 text-[18px] font-medium text-greenDeep">
            <Icon name="map" className="text-xl text-greenMain" />
            동행 발자국 현황
          </div>
          <div className="mb-2 flex justify-between text-[14px]">
            <span className="text-[#7a9a82]">전체 진행률</span>
            <span className="font-medium text-greenMain">45%</span>
          </div>
          <div className="h-2 overflow-hidden rounded bg-[#ddf0e5]">
            <div className="h-full w-[45%] rounded bg-greenMain" />
          </div>
          <div className="mt-4 rounded-lg border border-dashed border-[#cde8d8] bg-[#eef7f2] px-3 py-3 text-[15px] text-[#5a7a65]">
            현재 3단계 실행 계획을 진행 중입니다.
          </div>
        </section>
      </div>
    </Phone>
  );
}
