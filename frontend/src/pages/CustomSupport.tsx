import type { GoToPage } from '../types';
import { BottomTabs, Icon, Phone } from '../components';

const supportRankings = [
  {
    rank: 1,
    title: '청년 미래 설계 지원금',
    category: '진로 준비',
    description: '진로 탐색과 자격증 준비 비용 부담이 큰 사용자에게 가장 적합한 지원사업입니다.'
  },
  {
    rank: 2,
    title: '생활 안정 동행 바우처',
    category: '생활비 지원',
    description: '최근 생활비 부담 응답이 높아 식비, 교통비 등 기본 생활 영역을 먼저 보완할 수 있습니다.'
  },
  {
    rank: 3,
    title: '청년 마음 건강 상담 패키지',
    category: '정서 지원',
    description: '진로 불안과 스트레스 점수가 함께 높아 심리 상담과 정서 회복 프로그램을 추천합니다.'
  },
  {
    rank: 4,
    title: '취업 역량 강화 클래스',
    category: '취업 준비',
    description: '이력서 작성, 면접 연습, 직무 탐색을 한 번에 진행할 수 있는 단기 집중형 사업입니다.'
  },
  {
    rank: 5,
    title: '지역 멘토링 연결 프로그램',
    category: '관계 형성',
    description: '비슷한 상황의 또래와 현직자 멘토를 연결해 지속적인 조언을 받을 수 있습니다.'
  }
] as const;

const aiComment =
  '자가진단 결과를 기준으로 보면 지금은 진로 준비와 생활 안정 지원을 가장 먼저 확인하는 것이 좋습니다. 1순위와 2순위 사업을 우선 신청하고, 정서적 부담이 계속된다면 마음 건강 상담 패키지를 함께 이용해 지원 효과를 높일 수 있습니다.';

export function CustomSupport({
  go,
  completed,
  onComplete
}: {
  go: GoToPage;
  completed: boolean;
  onComplete: () => void;
}) {
  return (
    <Phone main bottom={<BottomTabs active="roadmap" go={go} />}>
      <div className="flex flex-1 flex-col gap-4 overflow-hidden px-4 py-5">
        <div>
          <div className="flex items-center gap-1 text-[22px] font-medium text-greenDeep">
            <Icon name="recommend" className="text-xl text-greenMain" />
            맞춤 지원사업 추천
          </div>
          <div className="mt-1 pl-[25px] text-[14px] text-[#7a9a82]">자가진단 기반 맞춤 지원사업</div>
        </div>

        <div className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
          {supportRankings.map((support) => (
            <SupportRankingItem key={support.rank} {...support} />
          ))}

          <section className="mt-2 rounded-[10px] border-[1.5px] border-[#cde8d8] bg-[#eef7f2] px-4 py-4">
            <div className="mb-2 flex items-center gap-1 text-[16px] font-medium text-greenDeep">
              <Icon name="psychology" className="text-[19px] text-greenMain" />
              AI 정리 코멘트
            </div>
            <p className="text-[14px] leading-[1.75] text-[#4f6f59]">{aiComment}</p>
          </section>
        </div>

        <div className="flex gap-2">
          <button type="button" className="secondary-button flex-1 rounded-[10px]" onClick={() => go('roadmap')}>
            동행 발자국 보기
          </button>
          <button
            type="button"
            className={`primary-button flex-1 rounded-[10px] ${completed ? 'opacity-50' : ''}`}
            disabled={completed}
            onClick={onComplete}
          >
            완료
          </button>
        </div>
      </div>
    </Phone>
  );
}

function SupportRankingItem({ rank, title, category, description }: (typeof supportRankings)[number]) {
  return (
    <article className="rounded-[10px] border-[1.5px] border-[#dde8e2] bg-ivory px-3 py-3">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-greenMain text-[14px] font-medium text-white">
          {rank}
        </div>
        <div className="min-w-0 flex-1">
          <div>
            <div className="text-[16px] font-medium text-greenDeep">{title}</div>
            <div className="mt-0.5 text-[13px] text-[#7a9a82]">{category}</div>
          </div>
          <p className="mt-2 text-[13px] leading-[1.6] text-[#5a7a65]">{description}</p>
        </div>
      </div>
    </article>
  );
}
