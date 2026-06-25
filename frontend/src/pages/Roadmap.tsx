import type { GoToPage, RoadmapStatus } from '../types';
import { roadmapSteps } from '../data/mockData';
import { BottomTabs, Icon, Phone } from '../components';

type RoadmapStepView = (typeof roadmapSteps)[number] & {
  label: string;
  status: RoadmapStatus;
};

export function Roadmap({ go, completedStep }: { go: GoToPage; completedStep: number }) {
  const steps: RoadmapStepView[] = roadmapSteps.map((step, index) => {
    const stepNumber = index + 1;
    const status: RoadmapStatus = stepNumber <= completedStep ? 'done' : stepNumber === completedStep + 1 ? 'inProgress' : 'unfinshed';
    const label = status === 'done' ? '완료' : status === 'inProgress' ? '진행중' : '미완료';

    return { ...step, label, status };
  });

  return (
    <Phone main bottom={<BottomTabs active="roadmap" go={go} />}>
      <div className="flex flex-1 flex-col gap-4 overflow-hidden px-4 py-5">
        <div>
          <div className="flex items-center gap-1 text-[22px] font-medium text-greenDeep">
            <Icon name="map" className="text-xl text-greenMain" />
            나의 동행 발자국
          </div>
          <div className="mt-1 pl-[25px] text-[14px] text-[#7a9a82]">자가진단 기반 맞춤형 동행 발자국</div>
        </div>
        <div className="flex flex-1 flex-col gap-1.5 overflow-hidden">
          {steps.map((step, index) => (
            <RoadmapStep key={step.title} index={index + 1} go={go} {...step} />
          ))}
        </div>
      </div>
    </Phone>
  );
}

function RoadmapStep({ index, title, label, status, page, go }: RoadmapStepView & { index: number; go: GoToPage }) {
  const unfinished = status === 'unfinshed';
  const done = status === 'done';
  const inProgress = status === 'inProgress';
  const canMove = done || inProgress;

  return (
    <div
      className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 select-none ${
        done
          ? 'border-[1.5px] border-greenMain bg-ivory'
          : inProgress
            ? 'border-[1.5px] border-[#facc15] bg-[#fffbea] shadow-[0_0_0_3px_rgba(250,204,21,0.16)]'
            : 'border-[1.5px] border-[#dde8e2] bg-ivory'
      } ${unfinished ? 'opacity-60' : ''} ${canMove ? 'cursor-pointer' : 'cursor-default'}`}
      onClick={() => {
        if (canMove) {
          go(page);
        }
      }}
    >
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[14px] ${
          done ? 'bg-greenMain text-white' : inProgress ? 'bg-[#facc15] text-[#854d0e]' : ''
        }`}
      >
        {done ? <Icon name="check" className="text-base" /> : inProgress ? <Icon name="play_arrow" className="text-[20px]" /> : index}
      </div>
      <div>
        <div className={`text-[16px] ${unfinished ? 'text-[#8aaa98]' : 'font-medium text-greenDeep'}`}>{title}</div>
        <div className={`flex items-center gap-1 text-[14px] ${done ? 'text-greenMain' : inProgress ? 'font-medium text-[#b45309]' : 'text-[#aaa]'}`}>
          {inProgress ? <Icon name="bolt" className="text-[15px]" /> : null}
          {label}
        </div>
      </div>
    </div>
  );
}
