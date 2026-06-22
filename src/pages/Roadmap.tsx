import type { GoToPage, RoadmapStatus } from '../types';
import { roadmapSteps } from '../data/mockData';
import { BottomTabs, Icon, Phone } from '../components';

export function Roadmap({ go }: { go: GoToPage }) {
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
          {roadmapSteps.map((step, index) => (
            <RoadmapStep key={step.title} index={index + 1} {...step} />
          ))}
        </div>
      </div>
    </Phone>
  );
}

function RoadmapStep({ index, title, label, status }: { index: number; title: string; label: string; status: RoadmapStatus }) {
  const unfinshed = status === 'unfinshed';
  const done = status === 'done';

  return (
    <div
      className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 select-none cursor-pointer ${
        done ? 'border-[1.5px] border-greenMain bg-ivory' : 'border-[1.5px] border-[#dde8e2] bg-ivory'
      } ${unfinshed ? 'opacity-60' : ""}`}
    >
      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[14px] ${done ? 'bg-greenMain text-white' : ''}`}>
        {done ? <Icon name="check" className="text-base" /> : index}
      </div>
      <div>
        <div className={`text-[16px] ${unfinshed ? 'text-[#8aaa98]' : 'font-medium text-greenDeep'}`}>{title}</div>
        <div className={`text-[14px] ${done ? 'text-greenMain' : 'text-[#aaa]'}`}>{label}</div>
      </div>
    </div>
  );
}
