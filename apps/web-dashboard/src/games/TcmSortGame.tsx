import { useMemo, useState } from 'react';
import type { HeritageGameConfig } from '@heritage/shared';
import GameShell, { GameOverlay } from './GameShell';

interface Herb {
  id: string;
  emoji: string;
  name: string;
  bowl: BowlId;
  fact: string;
}

type BowlId = 'cooling' | 'vitality' | 'digestion';

const BOWLS: { id: BowlId; label: string; emoji: string }[] = [
  { id: 'cooling', label: 'Cooling', emoji: '❄️' },
  { id: 'vitality', label: 'Vitality', emoji: '⚡' },
  { id: 'digestion', label: 'Digestion', emoji: '🍵' },
];

const HERBS: Herb[] = [
  { id: 'chrysanthemum', emoji: '🌼', name: 'Chrysanthemum', bowl: 'cooling', fact: 'Chrysanthemum tea is used to clear heat and soothe the eyes.' },
  { id: 'goji', emoji: '🔴', name: 'Goji berries', bowl: 'vitality', fact: 'Goji berries are prized for nourishing the liver and supporting Qi.' },
  { id: 'ginseng', emoji: '🫚', name: 'Ginseng', bowl: 'vitality', fact: 'Ginseng is a classic tonic for energy and resilience.' },
  { id: 'hawthorn', emoji: '🍎', name: 'Hawthorn', bowl: 'digestion', fact: 'Hawthorn helps settle heavy meals and supports digestion.' },
  { id: 'mint', emoji: '🌿', name: 'Mint', bowl: 'cooling', fact: 'Mint cools the body and eases heat-related discomfort.' },
  { id: 'tangerine', emoji: '🍊', name: 'Dried tangerine peel', bowl: 'digestion', fact: 'Chen pi (dried peel) warms the middle and aids appetite.' },
];

interface Props {
  config: HeritageGameConfig;
  accentColor: string;
}

export default function TcmSortGame({ config, accentColor }: Props) {
  const [phase, setPhase] = useState<'idle' | 'playing' | 'won'>('idle');
  const [selected, setSelected] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Record<string, BowlId>>({});
  const [fact, setFact] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const remaining = useMemo(
    () => HERBS.filter((h) => !placed[h.id]),
    [placed]
  );

  const start = () => {
    setPlaced({});
    setSelected(null);
    setFact(null);
    setError(null);
    setPhase('playing');
  };

  const assign = (bowl: BowlId) => {
    if (!selected) return;
    const herb = HERBS.find((h) => h.id === selected);
    if (!herb) return;

    if (herb.bowl !== bowl) {
      setError(`${herb.name} doesn't belong in ${BOWLS.find((b) => b.id === bowl)?.label}. Try again!`);
      setFact(null);
      return;
    }

    const next = { ...placed, [herb.id]: bowl };
    setPlaced(next);
    setSelected(null);
    setError(null);
    setFact(herb.fact);

    if (Object.keys(next).length === HERBS.length) {
      setTimeout(() => setPhase('won'), 900);
    }
  };

  return (
    <GameShell title={config.title} accentColor={accentColor}>
      {phase === 'idle' && (
        <GameOverlay title={config.title} body={config.instructions} buttonLabel="Start sorting" onAction={start} />
      )}

      {phase === 'won' && (
        <GameOverlay title="Apothecary complete!" body={config.winMessage} buttonLabel="Play again" onAction={start} tone="won" />
      )}

      {phase === 'playing' && (
        <div className="space-y-4">
          <p className="font-body text-xs text-navy/50">
            Tap a herb, then tap a bowl. Sorted {Object.keys(placed).length}/{HERBS.length}
          </p>

          <div className="flex flex-wrap gap-2">
            {remaining.map((herb) => (
              <button
                key={herb.id}
                type="button"
                onClick={() => {
                  setSelected(herb.id);
                  setError(null);
                }}
                className={`rounded-xl px-3 py-2 border-2 font-body text-sm transition-all ${
                  selected === herb.id
                    ? 'border-navy bg-sunshine/40 scale-105'
                    : 'border-gray-200 bg-cream hover:border-navy/30'
                }`}
              >
                <span className="mr-1">{herb.emoji}</span>
                {herb.name}
              </button>
            ))}
            {remaining.length === 0 && (
              <p className="font-body text-sm text-teal">All herbs sorted…</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {BOWLS.map((bowl) => {
              const inBowl = HERBS.filter((h) => placed[h.id] === bowl.id);
              return (
                <button
                  key={bowl.id}
                  type="button"
                  onClick={() => assign(bowl.id)}
                  className="rounded-2xl p-3 min-h-[110px] border-2 border-dashed text-left transition-colors hover:bg-cream"
                  style={{ borderColor: accentColor }}
                >
                  <p className="font-heading font-bold text-navy text-xs mb-2">
                    {bowl.emoji} {bowl.label}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {inBowl.map((h) => (
                      <span key={h.id} className="text-lg" title={h.name}>
                        {h.emoji}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {error && (
            <p className="font-body text-sm text-merlion bg-merlion/10 rounded-xl px-3 py-2">{error}</p>
          )}
          {fact && !error && (
            <p className="font-body text-sm text-navy/80 bg-teal/10 rounded-xl px-3 py-2">💡 {fact}</p>
          )}
        </div>
      )}
    </GameShell>
  );
}
