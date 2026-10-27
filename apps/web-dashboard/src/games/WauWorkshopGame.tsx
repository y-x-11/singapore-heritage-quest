import { useMemo, useRef, useState } from 'react';
import type { HeritageGameConfig } from '@heritage/shared';
import { useGameXpAward } from '../hooks/useGameXpAward';
import { publicAssetUrl } from '../lib/site';
import GameShell, { GameOverlay } from './GameShell';

interface Props {
  config: HeritageGameConfig;
  accentColor: string;
}

type Shape = 'wau-bulan' | 'wau-kucing' | 'diamond';
type Tail = 'short' | 'medium' | 'long';
type Frame = 'bamboo' | 'rattan' | 'plastic';
type Wind = 'light' | 'moderate' | 'strong';

type Phase = 'idle' | 'shape' | 'tail' | 'frame' | 'launch' | 'won' | 'retry';

const WAU_IMG = publicAssetUrl('games/kampong-glam/wau-kite-placeholder.svg');

function pickWind(): Wind {
  const r = Math.random();
  if (r < 0.33) return 'light';
  if (r < 0.66) return 'moderate';
  return 'strong';
}

function flyScore(shape: Shape, tail: Tail, frame: Frame, wind: Wind): number {
  let score = 50;
  if (shape === 'wau-bulan') score += 18;
  if (shape === 'wau-kucing') score += 12;
  if (shape === 'diamond') score += wind === 'light' ? 10 : -5;

  if (tail === 'long') score += wind === 'strong' ? 20 : 8;
  if (tail === 'medium') score += 12;
  if (tail === 'short') score += wind === 'strong' ? -22 : 4;

  if (frame === 'bamboo') score += 15;
  if (frame === 'rattan') score += 8;
  if (frame === 'plastic') score += wind === 'strong' ? -25 : -8;

  return score;
}

function craftsmanTip(shape: Shape, tail: Tail, frame: Frame, wind: Wind): string {
  if (shape === 'diamond') {
    return 'Pak Wau: That diamond shape is a common toy kite — Malay wau bulan uses a curved bamboo frame and moon-like bow so it hums and climbs in our monsoon gusts.';
  }
  if (frame === 'plastic') {
    return 'Pak Wau: Village craftsmen split bamboo — light, springy, and repairable. Plastic spars snap in strong wind and lose the wau’s signature balance.';
  }
  if (tail === 'short' && wind === 'strong') {
    return 'Pak Wau: A long tail steadies the wau when Bugis wind kicks up. Short tails look neat but the kite dives like a gasing that lost its spin.';
  }
  if (shape === 'wau-bulan' && tail === 'long' && frame === 'bamboo') {
    return 'Pak Wau: Bagus! Wau bulan with bamboo and a balanced tail — that is how kampong kids chased the sky before HDB blocks rose.';
  }
  return 'Pak Wau: Tune the tail and bamboo frame together — wau is craft and wind physics, not guesswork.';
}

const WIND_LABEL: Record<Wind, string> = {
  light: 'Light sea breeze',
  moderate: 'Steady monsoon gust',
  strong: 'Strong open-field wind',
};

export default function WauWorkshopGame({ config, accentColor }: Props) {
  const { awardOnWin, resetAward } = useGameXpAward(config.id);
  const mistakesRef = useRef(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [shape, setShape] = useState<Shape | null>(null);
  const [tail, setTail] = useState<Tail | null>(null);
  const [frame, setFrame] = useState<Frame | null>(null);
  const [wind, setWind] = useState<Wind>(() => pickWind());
  const [meter, setMeter] = useState(0);
  const [tip, setTip] = useState<string | null>(null);
  const [xpEarned, setXpEarned] = useState<number | undefined>();

  const score = useMemo(() => {
    if (!shape || !tail || !frame) return 0;
    return flyScore(shape, tail, frame, wind);
  }, [shape, tail, frame, wind]);

  const start = () => {
    mistakesRef.current = 0;
    resetAward();
    setXpEarned(undefined);
    setShape(null);
    setTail(null);
    setFrame(null);
    setWind(pickWind());
    setMeter(0);
    setTip(null);
    setPhase('shape');
  };

  const launch = () => {
    if (!shape || !tail || !frame) return;
    setPhase('launch');
    setMeter(0);
    const target = Math.min(100, Math.max(0, score));
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setMeter((prev) => {
        const next = prev + (target - prev) * 0.35;
        if (step >= 12) {
          clearInterval(interval);
          return target;
        }
        return next;
      });
    }, 80);
    setTimeout(() => {
      clearInterval(interval);
      setMeter(target);
      if (target >= 72) {
        setXpEarned(awardOnWin(mistakesRef.current));
        setPhase('won');
      } else {
        mistakesRef.current += 1;
        setTip(craftsmanTip(shape, tail, frame, wind));
        setPhase('retry');
      }
    }, 1100);
  };

  const choiceBtn = (active: boolean, onClick: () => void, label: string, sub?: string) => (
    <button
      type="button"
      onClick={onClick}
      className={`text-left w-full rounded-xl border-2 p-3 transition-transform hover:scale-[1.01] ${
        active ? 'border-teal bg-teal/10' : 'border-navy/15 bg-white'
      }`}
    >
      <span className="font-heading font-bold text-sm text-navy block">{label}</span>
      {sub && <span className="font-body text-xs text-navy/60 mt-0.5 block">{sub}</span>}
    </button>
  );

  return (
    <GameShell title={config.title} accentColor={accentColor}>
      {phase === 'idle' && (
        <GameOverlay title={config.title} body={config.instructions} buttonLabel="Open workshop" onAction={start} />
      )}

      {phase === 'won' && (
        <GameOverlay
          title="The wau climbs!"
          body={config.winMessage}
          buttonLabel="Build another"
          tone="won"
          xpEarned={xpEarned}
          onAction={start}
        />
      )}

      {phase === 'retry' && tip && (
        <GameOverlay
          title="Needs more tail or bamboo"
          body={tip}
          buttonLabel="Redesign kite"
          tone="lost"
          onAction={() => {
            setTip(null);
            setShape(null);
            setTail(null);
            setFrame(null);
            setWind(pickWind());
            setPhase('shape');
          }}
        />
      )}

      {['shape', 'tail', 'frame'].includes(phase) && (
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden border border-dashed border-navy/20">
            <img src={WAU_IMG} alt="Your wau design placeholder" className="w-full h-36 object-contain bg-sky-100" />
            <p className="text-center font-body text-xs text-navy/45 py-1">Kite art placeholder — swap for illustration or photo</p>
          </div>

          {phase === 'shape' && (
            <>
              <p className="font-body text-sm text-navy/75">Step 1 — Choose a shape</p>
              <div className="space-y-2">
                {choiceBtn(shape === 'wau-bulan', () => setShape('wau-bulan'), 'Wau bulan (moon bow)', 'Classic Malay crescent frame')}
                {choiceBtn(shape === 'wau-kucing', () => setShape('wau-kucing'), 'Wau kucing (cat)', 'Stable for learners')}
                {choiceBtn(shape === 'diamond', () => setShape('diamond'), 'Diamond toy kite', 'Common, but not traditional wau')}
              </div>
              <button
                type="button"
                disabled={!shape}
                onClick={() => setPhase('tail')}
                className="w-full disabled:opacity-40 bg-navy text-white font-heading font-bold py-2.5 rounded-xl"
              >
                Next: tail
              </button>
            </>
          )}

          {phase === 'tail' && (
            <>
              <p className="font-body text-sm text-navy/75">Step 2 — Tail length</p>
              <div className="space-y-2">
                {choiceBtn(tail === 'short', () => setTail('short'), 'Short tail', 'Neat, but shaky in strong wind')}
                {choiceBtn(tail === 'medium', () => setTail('medium'), 'Medium tail', 'Balanced for practice')}
                {choiceBtn(tail === 'long', () => setTail('long'), 'Long tail', 'Steadies the wau in gusts')}
              </div>
              <button
                type="button"
                disabled={!tail}
                onClick={() => setPhase('frame')}
                className="w-full disabled:opacity-40 bg-navy text-white font-heading font-bold py-2.5 rounded-xl"
              >
                Next: frame
              </button>
            </>
          )}

          {phase === 'frame' && (
            <>
              <p className="font-body text-sm text-navy/75">Step 3 — Frame material</p>
              <div className="space-y-2">
                {choiceBtn(frame === 'bamboo', () => setFrame('bamboo'), 'Split bamboo', 'Traditional kampong choice')}
                {choiceBtn(frame === 'rattan', () => setFrame('rattan'), 'Rattan', 'Flexible backup')}
                {choiceBtn(frame === 'plastic', () => setFrame('plastic'), 'Plastic spars', 'Light but brittle')}
              </div>
              <p className="font-body text-xs text-navy/60 text-center">Today&apos;s wind: {WIND_LABEL[wind]}</p>
              <button
                type="button"
                disabled={!frame}
                onClick={launch}
                className="w-full disabled:opacity-40 font-heading font-bold py-2.5 rounded-xl text-white"
                style={{ backgroundColor: accentColor }}
              >
                Launch &amp; read wind meter
              </button>
            </>
          )}
        </div>
      )}

      {phase === 'launch' && (
        <div className="space-y-4 text-center">
          <p className="font-heading font-bold text-navy">Wind meter</p>
          <div className="h-8 rounded-full bg-navy/10 overflow-hidden border border-navy/15">
            <div
              className="h-full transition-all duration-300 rounded-full"
              style={{ width: `${meter}%`, backgroundColor: accentColor }}
            />
          </div>
          <p className="font-body text-sm text-navy/70">{WIND_LABEL[wind]} — climbing…</p>
        </div>
      )}
    </GameShell>
  );
}
