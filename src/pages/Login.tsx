import { useState } from 'react';
import type { GoToPage } from '../types';
import { Phone, TextField } from '../components';

export function Login({ go, firstUser }: { go: GoToPage; firstUser: boolean }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Phone>
      <div className="flex flex-1 flex-col items-center gap-4 px-6 py-10">
        <img src="./icons/logo_no_title.png" alt="logo" title='logo' className='logo' />
        <h1 className="text-2xl font-bold text-greenDeep">로그인</h1>
        <p className="text-[15px] text-[#7a9a82]">동행이 당신을 환영합니다</p>
        <TextField label="이메일" value={id} onChange={setId} placeholder="이메일을 입력하세요" />
        <TextField label="비밀번호" type="password" value={password} onChange={setPassword} placeholder="비밀번호를 입력하세요" />
        <button type="button" className="primary-button mt-1.5" onClick={() => go(firstUser ? 'welcome' : 'dashboard')}>
          로그인
        </button>
        <button type="button" className="text-[15px] text-[#7a9a82] underline" onClick={() => go('signup')}>
          회원가입하기
        </button>
      </div>
    </Phone>
  );
}