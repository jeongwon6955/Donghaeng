import type { GoToPage } from '../types';
import { Icon, Phone } from '../components';

export function Welcome({ go }: { go: GoToPage }) {
  return (
    <Phone>
      <div className="flex flex-1 flex-col items-center justify-between px-6 pb-8 pt-16">
        <div className="flex flex-col items-center gap-6">
          <Icon name="waving_hand" className="text-[100px] text-greenMain" />
          <h1 className="text-center text-[34px] font-medium text-greenDeep">환영합니다!</h1>
          <p className="text-center text-[18px] leading-relaxed text-greenMain">
            동행이 당신을
            <br />
            환영합니다
          </p>
        </div>
        <button type="button" className="primary-button h-[50px] rounded-[14px]" onClick={() => go('intro')}>
          다음 <Icon name="arrow_forward" className="text-base" />
        </button>
      </div>
    </Phone>
  );
}
