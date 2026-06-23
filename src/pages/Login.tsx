import { useState } from 'react';
import type { GoToPage } from '../types';
import { Phone, TextField, Icon } from '../components';

export function Login({ go, firstUser, onLogin }: { go: GoToPage; firstUser: boolean; onLogin: () => void }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Phone>
      <div className="flex flex-1 flex-col items-center gap-4 px-6 py-10">
        <img src="./icons/logo_no_title.png" alt="logo" title="logo" className="logo" />
        <h1 className="text-2xl font-bold text-greenDeep">로그인</h1>
        <p className="text-[15px] text-[#7a9a82]">동행이 당신을 환영합니다</p>
        <TextField label="아이디" value={id} onChange={setId} placeholder="아이디를 입력하세요" />
        <TextField
          label="비밀번호"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={setPassword}
          placeholder="비밀번호를 입력하세요"
          rightElement={
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center text-[#7a9a82]"
              aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보이기'}
              onClick={() => setShowPassword((value) => !value)}
            >
              <Icon name={showPassword ? 'visibility_off' : 'visibility'} className="text-[20px]" />
            </button>
          }
        />
        <button
          type="button"
          className="primary-button mt-1.5"
          onClick={() => {
            onLogin();
            go(firstUser ? 'welcome' : 'dashboard');
          }}
        >
          로그인
        </button>
        <button type="button" className="text-[15px] text-[#7a9a82] underline" onClick={() => go('signup')}>
          회원가입하기
        </button>
      </div>
    </Phone>
  );
}
