import { Icon } from './Icon';

export function AuthRequiredModal({ onClose, onLogin }: { onClose: () => void; onLogin: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-5">
      <div className="w-full max-w-[340px] rounded-2xl border-[1.5px] border-[#cde8d8] bg-ivory p-5 shadow-xl">
        <div className="mb-3 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef7f2] text-greenMain">
            <Icon name="lock" className="text-[28px]" />
          </div>
        </div>
        <h2 className="text-center text-[20px] font-medium text-greenDeep">로그인이 필요한 서비스입니다</h2>
        <p className="mt-2 text-center text-[14px] leading-relaxed text-[#7a9a82]">
          로그인 후 내 정보와 동행 발자국을 확인할 수 있어요.
        </p>
        <div className="mt-5 flex gap-2">
          <button type="button" className="secondary-button h-[46px] rounded-[10px]" onClick={onClose}>
            돌아가기
          </button>
          <button type="button" className="primary-button h-[46px] rounded-[10px]" onClick={onLogin}>
            로그인페이지로 이동
          </button>
        </div>
      </div>
    </div>
  );
}
