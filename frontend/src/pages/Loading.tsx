import { Phone } from '../components';

export function Loading({ message = '데이터를 불러오는중' }: { message?: string }) {
  return (
    <Phone main>
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-greenSoft">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#cde8d8] border-t-greenMain" />
        </div>
        <div className="text-[20px] font-medium text-greenDeep" role="status" aria-live="polite">
          <span>{message}</span>
          <span className="loading-dots" aria-hidden="true">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </div>
      </div>
    </Phone>
  );
}
