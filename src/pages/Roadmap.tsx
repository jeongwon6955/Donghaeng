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
            나의 로드맵
          </div>
          <div className="mt-1 pl-[25px] text-[14px] text-[#7a9a82]">자가진단 기반 맞춤형 로드맵</div>
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
  const waiting = status === 'waiting';
  const active = status === 'active';
  const done = status === 'done';

  return (
    <div
      className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 ${
        done ? 'border-[1.5px] border-greenMain bg-ivory' : active ? 'border-[1.5px] border-dashed border-[#eab308] bg-[#fffbeb]' : 'border-[1.5px] border-[#dde8e2] bg-ivory'
      } ${index === 4 ? 'opacity-60' : index === 5 ? 'opacity-55' : ''}`}
    >
      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[14px] ${done ? 'bg-greenMain text-white' : active ? 'bg-[#eab308] text-white' : 'bg-[#ddf0e5] text-[#999]'}`}>
        {done ? <Icon name="check" className="text-base" /> : active ? <Icon name="sync" className="text-base" /> : index}
      </div>
      <div>
        <div className={`text-[16px] ${waiting ? 'text-[#8aaa98]' : 'font-medium text-greenDeep'}`}>{title}</div>
        <div className={`text-[14px] ${done ? 'text-greenMain' : active ? 'text-[#b45309]' : 'text-[#aaa]'}`}>{label}</div>
      </div>
    </div>
  );
}
