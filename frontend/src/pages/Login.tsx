import { useState } from 'react';
import type { AuthUser } from '../api/auth';
import type { GoToPage } from '../types';
import { Phone, TextField, Icon, Toast } from '../components';
import { saveAuthSession, signin } from '../api/auth';

export function Login({ go, onLogin }: { go: GoToPage; onLogin: (user: AuthUser) => void }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = id.trim().length > 0 && password.length > 0 && !submitting;

  const showToast = (nextMessage: string) => {
    setMessage(nextMessage);
    window.setTimeout(() => {
      setMessage((current) => (current === nextMessage ? '' : current));
    }, 2600);
  };

  const handleLogin = async () => {
    if (!canSubmit) {
      showToast('아이디와 비밀번호를 입력해 주세요.');
      return;
    }

    try {
      setSubmitting(true);
      setMessage('');

      const result = await signin({
        user_id: id.trim(),
        password
      });

      if (!result.token || !result.user) {
        throw new Error('로그인 응답에 토큰 정보가 없습니다.');
      }

      saveAuthSession(result.token, result.user);
      onLogin(result.user);
      go(result.user.track_type === null ? 'welcome' : 'dashboard');
    } catch (error) {
      showToast(error instanceof Error ? error.message : '로그인에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Phone>
      {message ? <Toast message={message} onClose={() => setMessage('')} /> : null}
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
          className={`primary-button mt-1.5 ${canSubmit ? '' : 'opacity-60'}`}
          disabled={!canSubmit}
          onClick={handleLogin}
        >
          {submitting ? '로그인 중...' : '로그인'}
        </button>
        <button type="button" className="text-[15px] text-[#7a9a82] underline" onClick={() => go('signup')}>
          회원가입하기
        </button>
      </div>
    </Phone>
  );
}
