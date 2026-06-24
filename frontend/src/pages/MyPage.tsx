import { useEffect, useState } from 'react';
import type { AuthUser } from '../api/auth';
import { ApiError, getMe, saveAuthUser, updatePassword } from '../api/auth';
import type { GoToPage } from '../types';
import { Icon, Phone, TextField, Toast } from '../components';

const trackTypeLabel = (trackType: number | null | undefined) => {
  if (Number(trackType) === 1) return '미성년자';
  if (Number(trackType) === 2) return '성인';
  return '미설정';
};

export function MyPage({
  go,
  user,
  onUserChange,
  onLogout
}: {
  go: GoToPage;
  user: AuthUser | null;
  onUserChange: (user: AuthUser) => void;
  onLogout: () => void;
}) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [profile, setProfile] = useState<AuthUser | null>(user);
  const [message, setMessage] = useState('');
  const [toastType, setToastType] = useState<'error' | 'success'>('error');
  const [loading, setLoading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState(false);

  const samePassword = current.length > 0 && next.length > 0 && current === next;

  const showToast = (nextMessage: string, type: 'error' | 'success' = 'error') => {
    setToastType(type);
    setMessage(nextMessage);
    window.setTimeout(() => {
      setMessage((currentMessage) => (currentMessage === nextMessage ? '' : currentMessage));
    }, 2600);
  };

  const handleChangePassword = async () => {
    setCurrentPasswordError(false);

    if (!current || !next) {
      showToast('현재 비밀번호와 새 비밀번호를 모두 입력해 주세요.');
      return;
    }

    if (samePassword) {
      showToast('같은 비밀번호 입니다.');
      return;
    }

    try {
      setChangingPassword(true);

      const result = await updatePassword({
        current_password: current,
        new_password: next
      });

      showToast(result.message || '비밀번호가 성공적으로 변경되었습니다.', 'success');
      setCurrent('');
      setNext('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '비밀번호 변경에 실패했습니다.';

      if ((error instanceof ApiError && error.status === 401) || errorMessage.includes('현재 비밀번호')) {
        setCurrentPasswordError(true);
      }

      showToast(errorMessage);
    } finally {
      setChangingPassword(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadProfile = async () => {
      try {
        setLoading(true);
        const result = await getMe();

        if (!result.user) {
          throw new Error('사용자 정보를 불러오지 못했습니다.');
        }

        if (!ignore) {
          setProfile(result.user);
          onUserChange(result.user);
          saveAuthUser(result.user);
        }
      } catch (error) {
        if (!ignore) {
          showToast(error instanceof Error ? error.message : '사용자 정보를 불러오지 못했습니다.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      ignore = true;
    };
  }, [onUserChange]);

  return (
    <Phone main>
      {message ? <Toast message={message} type={toastType} onClose={() => setMessage('')} /> : null}
      <div className="flex flex-1 flex-col gap-4 px-5 py-5">
        <div className="flex items-center gap-2">
          <button type="button" className="flex h-8 w-8 items-center justify-center rounded-lg bg-ivory text-greenDeep" onClick={() => go('dashboard')}>
            <Icon name="arrow_back" className="text-xl" />
          </button>
          <h1 className="text-[22px] font-medium text-greenDeep">마이 페이지</h1>
        </div>
        <section className="card p-3">
          {[
            ['닉네임', loading ? '불러오는 중...' : profile?.name ?? '-'],
            ['아이디', loading ? '불러오는 중...' : profile?.user_id ?? '-'],
            ['연령대', loading ? '불러오는 중...' : trackTypeLabel(profile?.track_type)]
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
            <TextField
              label="현재 비밀번호"
              type="password"
              value={current}
              onChange={(value) => {
                setCurrent(value);
                setCurrentPasswordError(false);
              }}
              placeholder="현재 비밀번호"
              error={currentPasswordError}
            />
            {currentPasswordError ? (
              <div className="flex w-full items-center gap-1.5 text-[14px] text-[#c0392b]">
                <Icon name="warning" className="text-[17px]" />
                <span>현재 비밀번호가 일치하지 않습니다</span>
              </div>
            ) : null}
            <TextField
              label="새 비밀번호"
              type="password"
              value={next}
              onChange={setNext}
              placeholder="새 비밀번호"
              error={samePassword}
            />
            {samePassword ? (
              <div className="flex w-full items-center gap-1.5 text-[14px] text-[#c0392b]">
                <Icon name="warning" className="text-[17px]" />
                <span>같은 비밀번호 입니다</span>
              </div>
            ) : null}
            <button
              type="button"
              className={`primary-button ${changingPassword ? 'opacity-60' : ''}`}
              disabled={changingPassword}
              onClick={handleChangePassword}
            >
              {changingPassword ? '변경 중...' : '변경하기'}
            </button>
          </div>
        </section>
        <button type="button" className="secondary-button mt-auto border-[#e0b4ad] text-[#b94735]" onClick={onLogout}>
          로그아웃
        </button>
      </div>
    </Phone>
  );
}
