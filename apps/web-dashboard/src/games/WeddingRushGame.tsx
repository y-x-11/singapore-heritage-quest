import { useEffect, useRef, useState } from 'react';
import type { HeritageGameConfig } from '@heritage/shared';
import { useGameXpAward } from '../hooks/useGameXpAward';
import GameShell from './GameShell';
import { WeddingRushEngine } from './weddingRush/weddingRushEngine';

interface Props {
  config: HeritageGameConfig;
  accentColor: string;
}

export default function WeddingRushGame({ config, accentColor }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<WeddingRushEngine | null>(null);
  const { awardOnWin, resetAward } = useGameXpAward(config.id);
  const awardOnWinRef = useRef(awardOnWin);
  const resetAwardRef = useRef(resetAward);
  const [xpEarned, setXpEarned] = useState<number | undefined>();

  awardOnWinRef.current = awardOnWin;
  resetAwardRef.current = resetAward;

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    resetAwardRef.current();
    setXpEarned(undefined);

    engineRef.current = new WeddingRushEngine(el, {
      onWin: (mistakes) => {
        const xp = awardOnWinRef.current(mistakes);
        if (xp > 0) setXpEarned(xp);
      },
    });

    return () => {
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, [config.id]);

  return (
    <GameShell title={config.title} accentColor={accentColor}>
      <p className="font-body text-xs text-navy/50 text-center mb-3 leading-relaxed">{config.instructions}</p>
      <div ref={mountRef} />
      {xpEarned != null && xpEarned > 0 && (
        <p className="font-heading font-bold text-teal text-center text-sm mt-2">+{xpEarned} XP earned</p>
      )}
    </GameShell>
  );
}
