import type { ReactNode } from 'react';

export function Phone({ children, main = false, bottom }: { children: ReactNode; main?: boolean; bottom?: ReactNode }) {
  return (
    <main className={`phone ${main ? 'bg-container' : 'bg-ivory'}`}>
      <section className="phone-screen">{children}</section>
      {bottom}
    </main>
  );
}
