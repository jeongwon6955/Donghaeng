import type { GoToPage } from '../types';
import { BottomTabs, Icon, Phone } from '../components';

const stageCopy = {
  supportCheck: {
    icon: 'fact_check',
    title: '지원사업 상세 확인',
    subtitle: '추천 지원사업의 상세 정보 확인',
    body: '사용자는 추천받은 지원사업의 상세 정보를 확인합니다.'
  },
  consultingGuide: {
    icon: 'event_note',
    title: '상담 준비 가이드',
    subtitle: '문의 전 질문과 설명 문장 준비',
    body: '사용자가 기관에 문의하기 전 무엇을 물어봐야 하고, 자신의 상황을 어떻게 설명해야 하는지 안내합니다.'
  },
  agencyConnect: {
    icon: 'account_balance',
    title: '공식 기관 연결',
    subtitle: '실제 지원기관 문의처 연결',
    body: '사용자는 동행이 제공하는 공식 문의처를 통해 실제 지원기관과 연결됩니다.'
  },
  inquiryGuide: {
    icon: 'support_agent',
    title: '추가 문의 안내',
    subtitle: '추가 질문과 후속 문의처 연결',
    body: '사용자는 추가로 확인할 내용이 있을 때 동행이 정리한 문의 경로를 통해 적절한 기관과 연결됩니다.'
  }
} as const;

const supportInfo = ['지원 내용', '기본 지원 대상', '신청 방법', '공식 문의처'] as const;
const supportGuide = ['연령 조건 확인', '거주 지역 조건 확인', '돌봄 관련 기준 확인', '신청 기간 확인', '필요 서류 확인'] as const;
const questionExamples = [
  '제가 확인해볼 수 있는 지원사업이 있을까요?',
  '학업과 돌봄을 병행하는 청소년을 위한 지원이 있나요?',
  '상담이나 쉼 프로그램도 이용할 수 있나요?'
] as const;
const inquiryTemplates = [
  '현재 부모를 돌보고 있는 학생입니다.',
  '가족 돌봄으로 인해 학업에 어려움을 겪고 있습니다.',
  '이용 가능한 지원사업이 있는지 문의드리고 싶습니다.'
] as const;
const agencyFeatures = ['홈페이지 바로가기', '전화 문의', '상담 예약 페이지 연결', '기관 위치 및 정보 확인'] as const;
const inquiryFeatures = ['추가 문의처 확인', '전화 문의', '온라인 상담 페이지 연결', '기관 위치 및 운영 정보 확인'] as const;

type StageKey = keyof typeof stageCopy;

export function RoadmapStagePage({
  go,
  stage,
  completed,
  onComplete
}: {
  go: GoToPage;
  stage: StageKey;
  completed: boolean;
  onComplete: () => void;
}) {
  const copy = stageCopy[stage];

  return (
    <Phone main bottom={<BottomTabs active="roadmap" go={go} />}>
      <div className="flex flex-1 flex-col gap-4 overflow-hidden px-4 py-5">
        <div>
          <div className="flex items-center gap-1 text-[22px] font-medium text-greenDeep">
            <Icon name={copy.icon} className="text-xl text-greenMain" />
            {copy.title}
          </div>
          <div className="mt-1 pl-[25px] text-[14px] text-[#7a9a82]">{copy.subtitle}</div>
        </div>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
          {stage === 'supportCheck' ? <SupportCheckDetail /> : null}
          {stage === 'consultingGuide' ? <ConsultingGuideDetail /> : null}
          {stage === 'agencyConnect' ? <AgencyConnectDetail /> : null}
          {stage === 'inquiryGuide' ? <InquiryGuideDetail /> : null}
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

function FeatureList({ title, icon, items }: { title: string; icon: string; items: readonly string[] }) {
  return (
    <section className="card px-4 py-4">
      <div className="mb-3 flex items-center gap-1 text-[16px] font-medium text-greenDeep">
        <Icon name={icon} className="text-[19px] text-greenMain" />
        {title}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <div key={item} className="rounded-lg bg-[#eef7f2] px-3 py-2 text-[14px] font-medium text-[#4f6f59]">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

function NoticeBox({ children }: { children: string }) {
  return <div className="rounded-lg border-[1.5px] border-dashed border-[#eab308] bg-[#fefce8] px-3 py-3 text-[13px] leading-[1.6] text-[#854d0e]">{children}</div>;
}

function SupportCheckDetail() {
  return (
    <>
      <section className="rounded-[10px] border-[1.5px] border-[#cde8d8] bg-[#eef7f2] px-4 py-4">
        <div className="mb-2 flex items-center gap-1 text-[16px] font-medium text-greenDeep">
          <Icon name="info" className="text-[19px] text-greenMain" />
          지원사업 상세 확인
        </div>
        <p className="text-[14px] leading-[1.75] text-[#4f6f59]">사용자는 추천받은 지원사업의 상세 정보를 확인합니다.</p>
      </section>

      <FeatureList title="제공 정보" icon="list_alt" items={supportInfo} />

      <section className="card px-4 py-4">
        <div className="mb-2 flex items-center gap-1 text-[16px] font-medium text-greenDeep">
          <Icon name="rule" className="text-[19px] text-greenMain" />
          지원 확인 가이드
        </div>
        <p className="text-[14px] leading-[1.75] text-[#4f6f59]">
          동행은 지원 여부를 판단하지 않고, 사용자가 공식 기관에서 확인해야 할 핵심 항목을 정리하여 제공합니다.
        </p>
      </section>

      <section className="card px-4 py-4">
        <div className="mb-3 flex items-center gap-1 text-[16px] font-medium text-greenDeep">
          <Icon name="checklist" className="text-[19px] text-greenMain" />
          확인 예시
        </div>
        <div className="flex flex-col gap-2">
          {supportGuide.map((item) => (
            <div key={item} className="flex items-center gap-2 text-[14px] text-[#4f6f59]">
              <Icon name="check_circle" className="text-[17px] text-greenMain" />
              {item}
            </div>
          ))}
        </div>
        <p className="mt-3 text-[14px] leading-[1.75] text-[#4f6f59]">이를 통해 사용자는 어떤 내용을 확인해야 하는지 쉽게 파악할 수 있습니다.</p>
      </section>
    </>
  );
}

function ConsultingGuideDetail() {
  return (
    <>
      <section className="rounded-[10px] border-[1.5px] border-[#cde8d8] bg-[#eef7f2] px-4 py-4">
        <div className="mb-2 flex items-center gap-1 text-[16px] font-medium text-greenDeep">
          <Icon name="support_agent" className="text-[19px] text-greenMain" />
          상담 준비 가이드
        </div>
        <p className="text-[14px] leading-[1.75] text-[#4f6f59]">
          사용자가 기관에 문의하기 전 무엇을 물어봐야 하고, 자신의 상황을 어떻게 설명해야 하는지 안내합니다.
        </p>
      </section>

      <section className="card px-4 py-4">
        <div className="mb-2 flex items-center gap-1 text-[16px] font-medium text-greenDeep">
          <Icon name="quiz" className="text-[19px] text-greenMain" />
          추천 질문 제공
        </div>
        <p className="mb-3 text-[14px] leading-[1.75] text-[#4f6f59]">
          기관 유형과 자가진단 결과를 바탕으로 문의 시 활용할 수 있는 질문 예시를 제공합니다.
        </p>
        <div className="flex flex-col gap-2">
          {questionExamples.map((item) => (
            <div key={item} className="rounded-lg bg-[#eef7f2] px-3 py-2 text-[14px] leading-[1.55] text-[#4f6f59]">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="card px-4 py-4">
        <div className="mb-2 flex items-center gap-1 text-[16px] font-medium text-greenDeep">
          <Icon name="edit_note" className="text-[19px] text-greenMain" />
          문의 템플릿 제공
        </div>
        <p className="mb-3 text-[14px] leading-[1.75] text-[#4f6f59]">전화 또는 온라인 문의 시 활용할 수 있는 문의 문장을 자동 생성합니다.</p>
        <div className="flex flex-col gap-2">
          {inquiryTemplates.map((item) => (
            <div key={item} className="rounded-lg border border-[#cde8d8] bg-ivory px-3 py-2 text-[14px] leading-[1.55] text-[#4f6f59]">
              {item}
            </div>
          ))}
        </div>
      </section>

      <NoticeBox>※ 동행은 상담을 직접 수행하지 않으며, 사용자가 보다 원활하게 도움을 요청할 수 있도록 준비를 지원합니다.</NoticeBox>
    </>
  );
}

function AgencyConnectDetail() {
  return (
    <>
      <section className="rounded-[10px] border-[1.5px] border-[#cde8d8] bg-[#eef7f2] px-4 py-4">
        <div className="mb-2 flex items-center gap-1 text-[16px] font-medium text-greenDeep">
          <Icon name="account_balance" className="text-[19px] text-greenMain" />
          공식 기관 연결
        </div>
        <p className="text-[14px] leading-[1.75] text-[#4f6f59]">사용자는 동행이 제공하는 공식 문의처를 통해 실제 지원기관과 연결됩니다.</p>
      </section>

      <FeatureList title="제공 기능" icon="open_in_new" items={agencyFeatures} />

      <section className="card px-4 py-4">
        <div className="mb-2 flex items-center gap-1 text-[16px] font-medium text-greenDeep">
          <Icon name="campaign" className="text-[19px] text-greenMain" />
          안내
        </div>
        <p className="text-[14px] leading-[1.75] text-[#4f6f59]">실제 지원 자격 판단, 상담 및 신청 절차는 해당 기관이 담당합니다.</p>
        <p className="mt-2 text-[14px] leading-[1.75] text-[#4f6f59]">동행은 사용자가 적절한 기관에 도달할 수 있도록 연결하는 역할에 집중합니다.</p>
      </section>
    </>
  );
}

function InquiryGuideDetail() {
  return (
    <>
      <section className="rounded-[10px] border-[1.5px] border-[#cde8d8] bg-[#eef7f2] px-4 py-4">
        <div className="mb-2 flex items-center gap-1 text-[16px] font-medium text-greenDeep">
          <Icon name="support_agent" className="text-[19px] text-greenMain" />
          추가 문의 안내
        </div>
        <p className="text-[14px] leading-[1.75] text-[#4f6f59]">사용자는 추가로 확인할 내용이 있을 때 동행이 정리한 문의 경로를 통해 적절한 기관과 연결됩니다.</p>
      </section>

      <FeatureList title="제공 기능" icon="contact_support" items={inquiryFeatures} />

      <section className="card px-4 py-4">
        <div className="mb-2 flex items-center gap-1 text-[16px] font-medium text-greenDeep">
          <Icon name="campaign" className="text-[19px] text-greenMain" />
          안내
        </div>
        <p className="text-[14px] leading-[1.75] text-[#4f6f59]">추가 문의에 대한 답변, 상담 가능 여부, 신청 절차 안내는 해당 기관이 담당합니다.</p>
        <p className="mt-2 text-[14px] leading-[1.75] text-[#4f6f59]">동행은 사용자가 후속 도움을 요청할 수 있도록 문의처와 확인 항목을 정리해 연결합니다.</p>
      </section>
    </>
  );
}
