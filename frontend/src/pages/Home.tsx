import type { GoToPage } from '../types';
import { Phone } from '../components';

export function Home({ go, enterGuest }: { go: GoToPage; enterGuest: () => void }) {
  return (
    <Phone>
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-10">
        <img src="./icons/logo.png" alt="logo" title="logo" className="logo" />
        <p className="text-center text-[17px] leading-relaxed text-[#5a8a65]">
          함께 걷는 길
          <br />
          동행이 함께합니다
        </p>
        <div className="h-5" />
        <button type="button" className="primary-button" onClick={() => go('start')}>
          시작하기
        </button>
        <button type="button" className="secondary-button" onClick={enterGuest}>
          비회원으로 시작하기
        </button>
      </div>
    </Phone>
  );
}
