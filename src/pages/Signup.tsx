import { useState } from 'react';
import type { GoToPage } from '../types';
import { Icon, Phone, TextField } from '../components';

export function Signup({ go, markFirstUser }: { go: GoToPage; markFirstUser: () => void }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const mismatch = confirm.length > 0 && password !== confirm;

  return (
    <Phone>
      <div className="flex flex-1 flex-col items-center gap-3.5 px-6 py-9">
        <img src="./icons/logo_no_title.png" alt="logo" title='logo' className='logo' />
        <h1 className="text-2xl font-bold text-greenDeep">회원가입</h1>
        <TextField label="아이디" value={id} onChange={setId} placeholder="아이디를 입력하세요" />
        <TextField label="비밀번호" type="password" value={password} onChange={setPassword} placeholder="비밀번호를 입력하세요" />
        <TextField label="비밀번호 확인" type="password" value={confirm} onChange={setConfirm} placeholder="비밀번호를 다시 입력하세요" error={mismatch} />
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
