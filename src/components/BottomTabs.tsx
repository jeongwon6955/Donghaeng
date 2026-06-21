import type { GoToPage } from '../types';
import { Icon } from './Icon';

export function BottomTabs({ active, go }: { active: 'home' | 'survey' | 'roadmap'; go: GoToPage }) {
  const tabs = [
    { id: 'home', label: '홈', icon: 'home', page: 'dashboard' },
    { id: 'survey', label: '설문', icon: 'assignment', page: 'surveyResult' },
    { id: 'roadmap', label: '로드맵', icon: 'map', page: 'roadmap' }
  ] as const;

  return (
    <nav className="flex h-[52px] flex-shrink-0 items-center border-t-[1.5px] border-[#cde8d8] bg-ivory">
      {tabs.map((tab) => {
        const selected = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => go(tab.page)}
            className={`flex flex-1 flex-col items-center gap-0.5 text-[12px] ${selected ? 'font-medium text-greenMain' : 'text-[#aaa]'}`}
          >
            <Icon name={tab.icon} className="text-lg" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
