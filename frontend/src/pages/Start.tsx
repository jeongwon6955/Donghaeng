import type { GoToPage } from '../types';
import { Icon, Phone } from '../components';

export function Start({ go }: { go: GoToPage }) {
  return (
    <Phone>
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-10">
        <div className="flex h-32 w-32 items-center justify-center rounded-full border-[1.5px] border-[#cde8d8] bg-[#eef7f2] text-greenMain">
          <Icon name="person" size={112} />
        </div>
        <div className="text-center">
          <h1 className="text-[24px] font-bold text-greenDeep">혹시 이미 회원이신가요?</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-[#7a9a82]">
            계정이 있다면 로그인하고,
            <br />
            처음이라면 회원가입을 진행해 주세요.
          </p>
        </div>
        <div className="mt-2 flex w-full flex-col gap-2.5">
          <button type="button" className="primary-button" onClick={() => go('login')}>
            로그인
          </button>
          <button type="button" className="secondary-button" onClick={() => go('signup')}>
            회원가입
          </button>
        </div>
        <button type="button" className="mt-1 flex items-center gap-1 text-[15px] text-[#7a9a82] underline" onClick={() => go('home')}>
          <Icon name="arrow_back" className="text-[17px]" />
          돌아가기
        </button>
      </div>
    </Phone>
  );
}
