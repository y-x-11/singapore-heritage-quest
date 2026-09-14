import { useRef, useState } from 'react';
import type { HeritageGameConfig } from '@heritage/shared';
import { useGameXpAward } from '../hooks/useGameXpAward';
import GameShell, { GameOverlay } from './GameShell';

interface Props {
  config: HeritageGameConfig;
  accentColor: string;
}

type Garment = 'kebaya' | 'baju';
type Fabric = 'batik' | 'songket' | 'cotton';

const FABRICS: { id: Fabric; label: string; emoji: string; okFor: Garment[] }[] = [
  { id: 'batik', label: 'Batik silk', emoji: '🧣', okFor: ['kebaya', 'baju'] },
  { id: 'songket', label: 'Songket gold', emoji: '✨', okFor: ['baju', 'kebaya'] },
  { id: 'cotton', label: 'Everyday cotton', emoji: '🧵', okFor: ['baju'] },
];

const CUT_STEPS = ['Mark pattern', 'Cut bodice', 'Cut sleeves'] as const;
const STITCH_ORDER = ['Shoulders', 'Sides', 'Sleeves', 'Finishing'] as const;

export default function TailorGame({ config, accentColor }: Props) {
  const { awardOnWin, resetAward } = useGameXpAward(config.id);
  const mistakesRef = useRef(0);
  const [phase, setPhase] = useState<'idle' | 'garment' | 'fabric' | 'cut' | 'stitch' | 'won'>('idle');
  const [garment, setGarment] = useState<Garment | null>(null);
  const [fabric, setFabric] = useState<Fabric | null>(null);
  const [cutDone, setCutDone] = useState<string[]>([]);
  const [stitchDone, setStitchDone] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [xpEarned, setXpEarned] = useState<number | undefined>();

  const start = () => {
    mistakesRef.current = 0;
    resetAward();
    setXpEarned(undefined);
    setGarment(null);
    setFabric(null);
    setCutDone([]);
    setStitchDone([]);
    setMessage(null);
    setPhase('garment');
  };

  const pickGarment = (g: Garment) => {
    setGarment(g);
    setPhase('fabric');
    setMessage(
      g === 'kebaya'
        ? 'Kebaya is a fitted blouse often paired with a sarong, elegant Malay and Peranakan attire.'
        : "Baju Melayu is the classic Malay men's outfit, worn for festivals and formal occasions."
    );
  };

  const pickFabric = (f: Fabric) => {
    if (!garment) return;
    const option = FABRICS.find((x) => x.id === f)!;
    if (!option.okFor.includes(garment)) {
      mistakesRef.current += 1;
      setMessage('That fabric pairing is uncommon for this garment. Try another.');
      return;
    }
    setFabric(f);
    setCutDone([]);
    setPhase('cut');
    setMessage('Cut in order: mark the pattern, then bodice, then sleeves.');
  };

  const doCut = (step: string) => {
    const expected = CUT_STEPS[cutDone.length];
    if (step !== expected) {
      mistakesRef.current += 1;
      setMessage(`Next cut should be: ${expected}.`);
      return;
    }
    const next = [...cutDone, step];
    setCutDone(next);
    if (next.length === CUT_STEPS.length) {
      setStitchDone([]);
      setPhase('stitch');
      setMessage('Stitch in order: shoulders, then sides, then sleeves, then finishing.');
    }
  };

  const doStitch = (step: string) => {
    const expected = STITCH_ORDER[stitchDone.length];
    if (step !== expected) {
      mistakesRef.current += 1;
      setMessage(`Next stitch: ${expected}.`);
      return;
    }
    const next = [...stitchDone, step];
    setStitchDone(next);
    if (next.length === STITCH_ORDER.length) {
      setTimeout(() => {
        setXpEarned(awardOnWin(mistakesRef.current));
        setPhase('won');
      }, 500);
    }
  };

  const collectible =
    garment === 'kebaya'
      ? 'Collectible unlocked: Orchid Kebaya'
      : 'Collectible unlocked: Golden Baju Melayu';

  return (
    <GameShell title={config.title} accentColor={accentColor}>
      {phase === 'idle' && (
        <GameOverlay title={config.title} body={config.instructions} buttonLabel="Open the tailor shop" onAction={start} />
      )}

      {phase === 'won' && (
        <GameOverlay
          title={collectible}
          body={config.winMessage}
          buttonLabel="Sew another"
          onAction={start}
          tone="won"
          xpEarned={xpEarned}
        />
      )}

      {phase === 'garment' && (
        <div className="space-y-3">
          <p className="font-body text-sm text-navy/70">Choose a garment to tailor:</p>
          <button
            type="button"
            onClick={() => pickGarment('kebaya')}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-left font-heading font-bold text-navy hover:bg-cream"
          >
            👗 Kebaya
          </button>
          <button
            type="button"
            onClick={() => pickGarment('baju')}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-left font-heading font-bold text-navy hover:bg-cream"
          >
            🤵‍♂️ Baju Melayu
          </button>
        </div>
      )}

      {phase === 'fabric' && (
        <div className="space-y-3">
          <p className="font-body text-sm text-navy/70">Choose fabric for your {garment === 'kebaya' ? 'Kebaya' : 'Baju Melayu'}:</p>
          {FABRICS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => pickFabric(f.id)}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-left font-body text-sm hover:bg-cream"
            >
              {f.emoji} {f.label}
            </button>
          ))}
          {message && <p className="font-body text-xs text-navy/60 bg-cream rounded-xl px-3 py-2">{message}</p>}
        </div>
      )}

      {phase === 'cut' && (
        <div className="space-y-3">
          <p className="font-body text-sm text-navy/70">
            Cutting {fabric}. Step {cutDone.length}/{CUT_STEPS.length}
          </p>
          <div className="grid gap-2">
            {CUT_STEPS.map((step) => (
              <button
                key={step}
                type="button"
                disabled={cutDone.includes(step)}
                onClick={() => doCut(step)}
                className="rounded-xl border-2 border-gray-200 px-4 py-2 font-heading font-bold text-sm disabled:opacity-40"
                style={{ borderColor: cutDone.includes(step) ? accentColor : undefined }}
              >
                ✂️ {step}
              </button>
            ))}
          </div>
          {message && <p className="font-body text-xs text-navy/60 bg-cream rounded-xl px-3 py-2">{message}</p>}
        </div>
      )}

      {phase === 'stitch' && (
        <div className="space-y-3">
          <p className="font-body text-sm text-navy/70">
            Stitching. Step {stitchDone.length}/{STITCH_ORDER.length}
          </p>
          <div className="grid gap-2">
            {STITCH_ORDER.map((step) => (
              <button
                key={step}
                type="button"
                disabled={stitchDone.includes(step)}
                onClick={() => doStitch(step)}
                className="rounded-xl border-2 border-gray-200 px-4 py-2 font-heading font-bold text-sm disabled:opacity-40"
                style={{ borderColor: stitchDone.includes(step) ? accentColor : undefined }}
              >
                🪡 {step}
              </button>
            ))}
          </div>
          {message && <p className="font-body text-xs text-navy/60 bg-cream rounded-xl px-3 py-2">{message}</p>}
        </div>
      )}
    </GameShell>
  );
}
