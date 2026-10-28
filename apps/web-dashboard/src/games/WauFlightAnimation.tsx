import { useEffect, useMemo, useState } from 'react';

type FlightStage = 'ready' | 'glide' | 'finale';

/** Positions are relative to the scene box; goal line is at 50% width. */
type KitePose = { left: string; top: string; scale: number; rotate: number };

function kitePose(stage: FlightStage, passed: boolean): KitePose {
  if (stage === 'ready') {
    return { left: '8%', top: '28%', scale: 0.48, rotate: -8 };
  }
  if (stage === 'glide') {
    return { left: '34%', top: '16%', scale: 0.44, rotate: 4 };
  }
  if (passed) {
    return { left: '56%', top: '52%', scale: 0.4, rotate: 8 };
  }
  return { left: '14%', top: '54%', scale: 0.38, rotate: -18 };
}

interface Props {
  kiteSrc: string;
  kiteAlt: string;
  passed: boolean;
  windLabel: string;
  accentColor: string;
  meterTarget: number;
  onComplete: () => void;
}

function StickFigure({ throwing }: { throwing: boolean }) {
  return (
    <svg
      viewBox="0 0 80 120"
      className="absolute left-[4%] bottom-[14%] w-[18%] max-w-[72px] h-auto text-navy pointer-events-none"
      aria-hidden
    >
      <circle cx="40" cy="14" r="10" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="44" cy="12" r="1.5" fill="currentColor" />
      <path
        d="M34 18 Q38 22 42 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line x1="40" y1="24" x2="40" y2="68" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <line x1="40" y1="36" x2="22" y2="52" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <line
        x1="40"
        y1="36"
        x2={throwing ? 58 : 52}
        y2={throwing ? 28 : 38}
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="transition-all duration-500 ease-out"
      />
      <line x1="40" y1="68" x2="26" y2="98" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <line x1="40" y1="68" x2="54" y2="98" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function WauFlightAnimation({
  kiteSrc,
  kiteAlt,
  passed,
  windLabel,
  accentColor,
  meterTarget,
  onComplete,
}: Props) {
  const [stage, setStage] = useState<FlightStage>('ready');
  const [meter, setMeter] = useState(0);

  useEffect(() => {
    setStage('ready');
    setMeter(0);
    const tGlide = window.setTimeout(() => setStage('glide'), 550);
    const tFinale = window.setTimeout(() => setStage('finale'), 2100);
    const tDone = window.setTimeout(() => onComplete(), 3800);
    return () => {
      window.clearTimeout(tGlide);
      window.clearTimeout(tFinale);
      window.clearTimeout(tDone);
    };
  }, [kiteSrc, passed, onComplete]);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const duration = 2200;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 2;
      setMeter(meterTarget * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [meterTarget, kiteSrc, passed]);

  const pose = useMemo(() => kitePose(stage, passed), [stage, passed]);
  const kiteTransition =
    stage === 'finale' && !passed
      ? '1100ms cubic-bezier(0.55, 0.06, 0.68, 0.19)'
      : '1200ms cubic-bezier(0.22, 1, 0.36, 1)';

  const statusText =
    stage === 'finale'
      ? passed
        ? 'Passed the line — kite down on the far grass!'
        : 'Fell short of the line — try a longer tail or bamboo frame.'
      : stage === 'glide'
        ? `${windLabel} — gliding…`
        : 'Ready to launch…';

  return (
    <div className="space-y-3">
      <div
        className="relative w-full aspect-[5/3] min-h-[200px] max-h-[280px] rounded-2xl border-2 border-navy/25 bg-gradient-to-b from-sky-50 to-white overflow-hidden"
        role="img"
        aria-label={passed ? 'Kite flight succeeded' : 'Kite flight animation'}
      >
        <div className="absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-t from-emerald-500/90 via-emerald-400/70 to-transparent pointer-events-none" />
        <div
          className="absolute inset-x-0 bottom-[18%] h-3 opacity-80 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(115deg, transparent, transparent 6px, rgba(22,101,52,0.35) 6px, rgba(22,101,52,0.35) 12px)',
          }}
        />

        <div className="absolute left-1/2 bottom-[12%] top-[8%] w-0 border-l-2 border-dashed border-amber-500 pointer-events-none -translate-x-1/2" />
        <p className="absolute left-1/2 top-[6%] -translate-x-1/2 font-heading text-[11px] sm:text-xs font-bold text-amber-600 whitespace-nowrap pointer-events-none">
          Pass this line
        </p>

        <StickFigure throwing={stage !== 'ready'} />

        <img
          src={kiteSrc}
          alt={kiteAlt}
          className="absolute w-[38%] max-w-[160px] object-contain drop-shadow-md pointer-events-none will-change-[left,top,transform]"
          style={{
            left: pose.left,
            top: pose.top,
            transform: `scale(${pose.scale}) rotate(${pose.rotate}deg)`,
            transformOrigin: 'center center',
            transition: `left ${kiteTransition}, top ${kiteTransition}, transform ${kiteTransition}`,
          }}
          draggable={false}
        />

        {stage === 'finale' && passed && (
          <div
            className="absolute right-[10%] bottom-[20%] text-2xl motion-safe:animate-bounce pointer-events-none"
            aria-hidden
          >
            ✨
          </div>
        )}
      </div>

      <div>
        <p className="font-heading font-bold text-sm text-navy text-center mb-2">Wind meter</p>
        <div className="h-8 rounded-full bg-navy/10 overflow-hidden border border-navy/15">
          <div
            className="h-full rounded-full transition-[width] duration-300 ease-out"
            style={{ width: `${meter}%`, backgroundColor: accentColor }}
          />
        </div>
        <p className="font-body text-sm text-navy/70 text-center mt-2 min-h-[2.5rem]">{statusText}</p>
      </div>
    </div>
  );
}
