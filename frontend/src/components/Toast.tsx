import { Icon } from './Icon';

type ToastType = 'error' | 'success';

export function Toast({
  message,
  type = 'error',
  onClose
}: {
  message: string;
  type?: ToastType;
  onClose?: () => void;
}) {
  const isError = type === 'error';

  return (
    <div className="toast-wrap" role="status" aria-live="polite">
      <div className={`toast ${isError ? 'toast-error' : 'toast-success'}`}>
        <div className="flex min-w-0 flex-1 items-start gap-2.5">
          <Icon name={isError ? 'error' : 'check_circle'} className="mt-0.5 text-[20px]" />
          <p className="min-w-0 flex-1 break-keep text-[14px] leading-relaxed">{message}</p>
        </div>
        {onClose ? (
          <button type="button" className="toast-close" aria-label="알림 닫기" onClick={onClose}>
            <Icon name="close" className="text-[18px]" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
