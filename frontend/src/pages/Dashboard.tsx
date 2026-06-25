import type { AuthUser } from '../api/auth';
import type { GoToPage } from '../types';
import { roadmapSteps, surveyRows } from '../data/mockData';
import { BottomTabs, Icon, Phone } from '../components';

const trackTypeLabel = (trackType: number | null | undefined) => {
  if (Number(trackType) === 1) return '미성년자';
  if (Number(trackType) === 2) return '성인';
  return '나이 트랙 미선택';
};

export function Dashboard({
  go,
  isGuest,
  user,
  completedRoadmapStep
}: {
  go: GoToPage;
  isGuest: boolean;
  user: AuthUser | null;
  completedRoadmapStep: number;
}) {
  const totalRoadmapSteps = roadmapSteps.length;
  const safeCompletedStep = Math.min(completedRoadmapStep, totalRoadmapSteps);
  const roadmapProgress = Math.round((safeCompletedStep / totalRoadmapSteps) * 100);
  const currentStep = Math.min(safeCompletedStep + 1, totalRoadmapSteps);

  return (
    <Phone main bottom={<BottomTabs active="home" go={go} />}>
      <div className="flex flex-1 flex-col gap-3 overflow-hidden px-4 pt-4">
        <button type="button" className="card flex items-center justify-between px-4 py-3 text-left" onClick={() => go('mypage')}>
          <div>
            {isGuest ? (
              <>
                <div className="text-[20px] font-medium text-greenDeep">로그인이 필요한 서비스입니다</div>
                <div className="mt-1 text-[14px] text-[#7a9a82]">로그인 후 내 정보를 확인할 수 있어요</div>
              </>
            ) : (
              <>
                <div className="text-[20px] font-medium text-greenDeep">{user?.name ?? '사용자'} 님</div>
                <div className="mt-1 text-[14px] text-[#7a9a82]">{trackTypeLabel(user?.track_type)}</div>
              </>
            )}
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

        <section
          className={`card flex-1 p-3 ${isGuest ? '' : 'cursor-pointer'}`}
          onClick={() => {
            if (!isGuest) {
              go('roadmapCurrent');
            }
          }}
        >
          <div className="mb-3 flex items-center gap-1 text-[18px] font-medium text-greenDeep">
            <Icon name="map" className="text-xl text-greenMain" />
            동행 발자국 진행 현황
          </div>
          {isGuest ? (
            <button
              type="button"
              className="flex min-h-[120px] w-full flex-col items-center justify-center rounded-lg border border-dashed border-[#cde8d8] bg-[#eef7f2] px-3 py-4 text-center"
              onClick={() => go('roadmapCurrent')}
            >
              <Icon name="lock" className="mb-2 text-[28px] text-greenMain" />
              <span className="text-[17px] font-medium text-greenDeep">로그인이 필요한 서비스입니다</span>
              <span className="mt-1 text-[14px] text-[#7a9a82]">로그인 후 로드맵을 만들 수 있어요</span>
            </button>
          ) : (
            <>
              <div className="mb-2 flex justify-between text-[14px]">
                <span className="text-[#7a9a82]">전체 진행률</span>
                <span className="font-medium text-greenMain">{roadmapProgress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded bg-[#ddf0e5]">
                <div className="h-full rounded bg-greenMain" style={{ width: `${roadmapProgress}%` }} />
              </div>
              <div className="mt-4 rounded-lg border border-dashed border-[#cde8d8] bg-[#eef7f2] px-3 py-3 text-[15px] text-[#5a7a65]">
                현재 {currentStep}단계 진행 중입니다. 완료한 단계는 {safeCompletedStep}/{totalRoadmapSteps}단계입니다.
              </div>
            </>
          )}
        </section>
      </div>
    </Phone>
  );
}
