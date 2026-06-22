import { useState } from 'react';
import type { GoToPage } from '../types';
import { Icon, Phone, TextField } from '../components';

export function Signup({ go, markFirstUser }: { go: GoToPage; markFirstUser: () => void }) {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const mismatch = confirm.length > 0 && password !== confirm;

  return (
    <Phone>
      <div className="flex flex-1 flex-col items-center gap-3.5 px-6 py-9">
        <img src="./icons/logo_no_title.png" alt="logo" title='logo' className='logo' />
        <h1 className="text-2xl font-bold text-greenDeep">회원가입</h1>
        <TextField label="닉네임" value={name} onChange={setName} placeholder="닉네임을 입력하세요" />
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
        <TextField
          label="비밀번호 확인"
          type={showConfirm ? 'text' : 'password'}
          value={confirm}
          onChange={setConfirm}
          placeholder="비밀번호를 다시 입력하세요"
          error={mismatch}
          rightElement={
            <button
              type="button"
              className={`flex h-7 w-7 items-center justify-center ${mismatch ? 'text-[#c0392b]' : 'text-[#7a9a82]'}`}
              aria-label={showConfirm ? '비밀번호 확인 숨기기' : '비밀번호 확인 보이기'}
              onClick={() => setShowConfirm((value) => !value)}
            >
              <Icon name={showConfirm ? 'visibility_off' : 'visibility'} className="text-[20px]" />
            </button>
          }
        />
        {mismatch ? (
          <div className="flex w-full items-center gap-1.5 text-[14px] text-[#c0392b]">
            <Icon name="warning" className="text-[17px]" />
            <span>비밀번호가 일치하지 않습니다</span>
          </div>
        ) : null}
        <button
          type="button"
          className="primary-button mt-1.5"
          onClick={() => {
            markFirstUser();
            go('login');
          }}
        >
          회원가입
        </button>
      </div>
    </Phone>
  );
}
