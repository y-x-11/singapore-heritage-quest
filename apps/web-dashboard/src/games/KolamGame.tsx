import { useMemo, useRef, useState } from 'react';
import type { HeritageGameConfig } from '@heritage/shared';
import { useGameXpAward } from '../hooks/useGameXpAward';
import GameShell, { GameOverlay } from './GameShell';

interface Props {
  config: HeritageGameConfig;
  accentColor: string;
}

/** Target edges as "r,c-r,c" on a 3x3 dot grid (0..2) */
const TARGET_EDGES = new Set([
  '0,1-1,0',
  '0,1-1,1',
  '0,1-1,2',
  '1,0-1,1',
  '1,1-1,2',
  '1,0-2,1',
  '1,1-2,1',
  '1,2-2,1',
]);

function edgeKey(a: string, b: string) {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

function adjacent(a: string, b: string) {
  const [r1, c1] = a.split(',').map(Number);
  const [r2, c2] = b.split(',').map(Number);
  return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1 || (Math.abs(r1 - r2) === 1 && Math.abs(c1 - c2) === 1);
}

export default function KolamGame({ config, accentColor }: Props) {
  const { awardOnWin, resetAward } = useGameXpAward(config.id);
  const mistakesRef = useRef(0);
  const [phase, setPhase] = useState<'idle' | 'playing' | 'won'>('idle');
  const [active, setActive] = useState<string | null>(null);
  const [edges, setEdges] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<string | null>(null);
  const [xpEarned, setXpEarned] = useState<number | undefined>();

  const dots = useMemo(() => {
    const list: string[] = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) list.push(`${r},${c}`);
    }
    return list;
  }, []);

  const start = () => {
    mistakesRef.current = 0;
    resetAward();
    setXpEarned(undefined);
    setEdges(new Set());
    setActive(null);
    setMessage(null);
    setPhase('playing');
  };

  const win = (extraMistakes = 0) => {
    setXpEarned(awardOnWin(mistakesRef.current + extraMistakes));
    setPhase('won');
  };

  const symmetryScore = () => {
    let mirrored = 0;
    let total = 0;
    edges.forEach((e) => {
      total += 1;
      const [a, b] = e.split('-');
      const [r1, c1] = a.split(',').map(Number);
      const [r2, c2] = b.split(',').map(Number);
      const ma = `${r1},${2 - c1}`;
      const mb = `${r2},${2 - c2}`;
      if (edges.has(edgeKey(ma, mb))) mirrored += 1;
    });
    return total === 0 ? 0 : Math.round((mirrored / total) * 100);
  };

  const onDot = (id: string) => {
    if (!active) {
      setActive(id);
      return;
    }
    if (active === id) {
      setActive(null);
      return;
    }
    if (!adjacent(active, id)) {
      mistakesRef.current += 1;
      setMessage('Connect neighbouring dots only.');
      setActive(id);
      return;
    }

    const key = edgeKey(active, id);
    const next = new Set(edges);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setEdges(next);
    setActive(id);
    setMessage(null);

    const matched = [...TARGET_EDGES].every((t) => next.has(t)) && next.size === TARGET_EDGES.size;
    if (matched) {
      setMessage(`Pattern complete! Symmetry ${symmetryScore()}% — kolam designs often balance both sides.`);
      setTimeout(() => win(), 900);
    }
  };

  const showHint = () => {
    setEdges(new Set(TARGET_EDGES));
    setMessage('Hint shown — this is a classic diamond kolam. Trace it yourself next time!');
    setTimeout(() => win(8), 1200);
  };

  return (
    <GameShell title={config.title} accentColor={accentColor}>
      {phase === 'idle' && (
        <GameOverlay title={config.title} body={config.instructions} buttonLabel="Begin kolam" onAction={start} />
      )}

      {phase === 'won' && (
        <GameOverlay
          title="Festival ready!"
          body={config.winMessage}
          buttonLabel="Draw again"
          onAction={start}
          tone="won"
          xpEarned={xpEarned}
        />
      )}

      {phase === 'playing' && (
        <div className="space-y-4">
          <p className="font-body text-xs text-navy/50 text-center">
            Tap two neighbouring dots to draw a line. Match the diamond kolam.
          </p>

          <div className="relative mx-auto" style={{ width: 220, height: 220 }}>
            <svg width="220" height="220" className="absolute inset-0 pointer-events-none">
              {[...TARGET_EDGES].map((e) => {
                const [a, b] = e.split('-');
                const [r1, c1] = a.split(',').map(Number);
                const [r2, c2] = b.split(',').map(Number);
                return (
                  <line
                    key={`hint-${e}`}
                    x1={40 + c1 * 70}
                    y1={40 + r1 * 70}
                    x2={40 + c2 * 70}
                    y2={40 + r2 * 70}
                    stroke={`${accentColor}33`}
                    strokeWidth="4"
                    strokeDasharray="4 6"
                  />
                );
              })}
              {[...edges].map((e) => {
                const [a, b] = e.split('-');
                const [r1, c1] = a.split(',').map(Number);
                const [r2, c2] = b.split(',').map(Number);
                return (
                  <line
                    key={e}
                    x1={40 + c1 * 70}
                    y1={40 + r1 * 70}
                    x2={40 + c2 * 70}
                    y2={40 + r2 * 70}
                    stroke={accentColor}
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
            {dots.map((id) => {
              const [r, c] = id.split(',').map(Number);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onDot(id)}
                  className={`absolute w-7 h-7 -ml-3.5 -mt-3.5 rounded-full border-2 transition-transform ${
                    active === id ? 'scale-125 bg-sunshine border-navy' : 'bg-white border-navy'
                  }`}
                  style={{ left: 40 + c * 70, top: 40 + r * 70 }}
                  aria-label={`Dot ${id}`}
                />
              );
            })}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setEdges(new Set());
                setActive(null);
                setMessage(null);
              }}
              className="flex-1 rounded-xl border-2 border-gray-200 py-2 font-heading font-bold text-sm text-navy"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={showHint}
              className="flex-1 rounded-xl py-2 font-heading font-bold text-sm text-white"
              style={{ backgroundColor: accentColor }}
            >
              Show pattern
            </button>
          </div>

          {message && (
            <p className="font-body text-sm text-navy/80 bg-cream rounded-xl px-3 py-2 text-center">{message}</p>
          )}
        </div>
      )}
    </GameShell>
  );
}
