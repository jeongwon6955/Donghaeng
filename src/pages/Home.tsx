import type { GoToPage } from '../types';
import { Phone } from '../components';

export function Home({ go }: { go: GoToPage }) {
  return (
    <Phone>
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-10">
        <img src="./icons/logo.png" alt="logo" title='logo' className='logo' />
        <p className="text-center text-[17px] leading-relaxed text-[#5a8a65]">
          함께 걷는 길
          <br />
          동행이 함께합니다
        </p>
        <div className="h-5" />
        <div className="flex w-full gap-2.5">
          <button type="button" className="secondary-button" onClick={() => go('login')}>
            로그인
          </button>
          <button type="button" className="primary-button" onClick={() => go('signup')}>
            회원가입
          </button>
        </div>
      </div>
    </Phone>
  );
}
