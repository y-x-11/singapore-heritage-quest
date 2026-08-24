import type { ReactNode } from 'react';

interface GameShellProps {
  title: string;
  accentColor: string;
  children: ReactNode;
}

export default function GameShell({ title, accentColor, children }: GameShellProps) {
  return (
    <div
      className="bg-white rounded-3xl p-5 shadow-sm border-2"
      style={{ borderColor: `${accentColor}55` }}
    >
      <h3 className="font-heading font-extrabold text-lg text-navy mb-3">{title}</h3>
      {children}
    </div>
  );
}

interface OverlayProps {
  title: string;
  body: string;
  buttonLabel: string;
  onAction: () => void;
  tone?: 'idle' | 'won' | 'lost' | 'info';
}

export function GameOverlay({ title, body, buttonLabel, onAction, tone = 'idle' }: OverlayProps) {
  const bg =
    tone === 'won'
      ? 'bg-teal/90'
      : tone === 'lost'
        ? 'bg-merlion/90'
        : tone === 'info'
          ? 'bg-navy/80'
          : 'bg-navy/70';

  return (
    <div className={`rounded-2xl ${bg} p-5 text-center text-white`}>
      <h4 className="font-heading font-extrabold text-xl mb-2">{title}</h4>
      <p className="font-body text-white/90 text-sm mb-4 leading-relaxed">{body}</p>
      <button
        type="button"
        onClick={onAction}
        className="bg-sunshine text-navy font-heading font-bold px-6 py-2.5 rounded-xl hover:scale-105 transition-transform"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
