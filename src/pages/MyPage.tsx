import { useState } from 'react';
import type { GoToPage } from '../types';
import { user } from '../data/mockData';
import { Icon, Phone, TextField } from '../components';

export function MyPage({ go }: { go: GoToPage }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');

  return (
    <Phone main>
      <div className="flex flex-1 flex-col gap-4 px-5 py-5">
        <div className="flex items-center gap-2">
          <button type="button" className="flex h-8 w-8 items-center justify-center rounded-lg bg-ivory text-greenDeep" onClick={() => go('dashboard')}>
            <Icon name="arrow_back" className="text-xl" />
          </button>
          <h1 className="text-[22px] font-medium text-greenDeep">마이 페이지</h1>
        </div>
        <section className="card p-3">
          {[
            ['이름', user.name],
            ['아이디', user.email],
            ['전화번호', user.phone],
            ['유형', `${user.role} · ${user.age}세`]
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between border-b border-[#e8f0ec] py-2 last:border-0">
              <span className="text-[15px] text-[#5a7a65]">{label}</span>
              <span className="text-[15px] font-medium text-greenDeep">{value}</span>
            </div>
          ))}
        </section>
        <section className="card p-3">
          <h2 className="mb-3 text-[17px] font-medium text-greenDeep">비밀번호 변경</h2>
          <div className="space-y-2.5">
            <TextField label="현재 비밀번호" type="password" value={current} onChange={setCurrent} placeholder="현재 비밀번호" />
            <TextField label="새 비밀번호" type="password" value={next} onChange={setNext} placeholder="새 비밀번호" />
            <button type="button" className="primary-button">
              변경하기
            </button>
          </div>
        </section>
      </div>
    </Phone>
  );
}
