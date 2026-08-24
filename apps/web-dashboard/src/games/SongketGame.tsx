import { useEffect, useState } from 'react';
import type { HeritageGameConfig } from '@heritage/shared';
import GameShell, { GameOverlay } from './GameShell';

interface Props {
  config: HeritageGameConfig;
  accentColor: string;
}

const PATTERNS: boolean[][] = [
  [true, false, true, false, true, false, true, false, true],
  [false, true, true, true, false, true, true, true, false],
  [true, true, false, true, true, true, false, true, true],
];

export default function SongketGame({ config, accentColor }: Props) {
  const [phase, setPhase] = useState<'idle' | 'memorize' | 'weave' | 'won'>('idle');
  const [round, setRound] = useState(0);
  const [player, setPlayer] = useState<boolean[]>(Array(9).fill(false));
  const [message, setMessage] = useState<string | null>(null);

  const pattern = PATTERNS[round] ?? PATTERNS[0];

  useEffect(() => {
    if (phase !== 'memorize') return;
    const t = setTimeout(() => setPhase('weave'), 1800);
    return () => clearTimeout(t);
  }, [phase, round]);

  const start = () => {
    setRound(0);
    setPlayer(Array(9).fill(false));
    setMessage(null);
    setPhase('memorize');
  };

  const toggle = (i: number) => {
    if (phase !== 'weave') return;
    setPlayer((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  const check = () => {
    const ok = pattern.every((v, i) => v === player[i]);
    if (!ok) {
      setMessage('Not quite — gold threads must match the remembered Songket motif.');
      return;
    }
    if (round >= PATTERNS.length - 1) {
      setMessage('Third pattern woven!');
      setTimeout(() => setPhase('won'), 600);
      return;
    }
    setMessage('Beautiful weave! Next pattern…');
    setTimeout(() => {
      setRound((r) => r + 1);
      setPlayer(Array(9).fill(false));
      setMessage(null);
      setPhase('memorize');
    }, 700);
  };

  return (
    <GameShell title={config.title} accentColor={accentColor}>
      {phase === 'idle' && (
        <GameOverlay title={config.title} body={config.instructions} buttonLabel="Start weaving" onAction={start} />
      )}

      {phase === 'won' && (
        <GameOverlay title="Songket master!" body={config.winMessage} buttonLabel="Weave again" onAction={start} tone="won" />
      )}

      {(phase === 'memorize' || phase === 'weave') && (
        <div className="space-y-4">
          <p className="font-body text-xs text-navy/50 text-center">
            Pattern {round + 1}/{PATTERNS.length} · {phase === 'memorize' ? 'Memorise the gold threads…' : 'Recreate the pattern'}
          </p>

          <div className="grid grid-cols-3 gap-2 mx-auto max-w-[220px]">
            {(phase === 'memorize' ? pattern : player).map((on, i) => (
              <button
                key={i}
                type="button"
                disabled={phase === 'memorize'}
                onClick={() => toggle(i)}
                className="aspect-square rounded-lg border-2 transition-colors"
                style={{
                  borderColor: accentColor,
                  backgroundColor: on ? '#FFD166' : '#F8F4EF',
                  boxShadow: on ? 'inset 0 0 0 2px #C9A227' : undefined,
                }}
                aria-label={`Loom cell ${i + 1}`}
              />
            ))}
          </div>

          {phase === 'weave' && (
            <button
              type="button"
              onClick={check}
              className="w-full py-3 rounded-xl font-heading font-bold text-white"
              style={{ backgroundColor: accentColor }}
            >
              Check weave
            </button>
          )}

          {message && (
            <p className="font-body text-sm text-navy/80 bg-cream rounded-xl px-3 py-2 text-center">{message}</p>
          )}
        </div>
      )}
    </GameShell>
  );
}
