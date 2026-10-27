import { useRef, useState } from 'react';
import type { HeritageGameConfig } from '@heritage/shared';
import { useGameXpAward } from '../hooks/useGameXpAward';
import GameShell, { GameOverlay } from './GameShell';
import { MURAL_ROUNDS, MURAL_ZONES, type MuralZoneId } from './muralMap/muralRounds';

interface Props {
  config: HeritageGameConfig;
  accentColor: string;
}

type Phase = 'idle' | 'guess' | 'reveal' | 'won';

export default function MuralMapGame({ config, accentColor }: Props) {
  const { awardOnWin, resetAward } = useGameXpAward(config.id);
  const mistakesRef = useRef(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [roundIndex, setRoundIndex] = useState(0);
  const [showHintCrop, setShowHintCrop] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [lastPick, setLastPick] = useState<MuralZoneId | null>(null);
  const [xpEarned, setXpEarned] = useState<number | undefined>();

  const round = MURAL_ROUNDS[roundIndex];
  const roundsTotal = MURAL_ROUNDS.length;

  const start = () => {
    mistakesRef.current = 0;
    resetAward();
    setXpEarned(undefined);
    setRoundIndex(0);
    setShowHintCrop(false);
    setFeedback(null);
    setLastPick(null);
    setPhase('guess');
  };

  const advanceOrWin = () => {
    if (roundIndex >= roundsTotal - 1) {
      setXpEarned(awardOnWin(mistakesRef.current));
      setPhase('won');
      return;
    }
    setRoundIndex((i) => i + 1);
    setShowHintCrop(false);
    setFeedback(null);
    setLastPick(null);
    setPhase('guess');
  };

  const pickZone = (zoneId: MuralZoneId) => {
    if (phase !== 'guess' || !round) return;
    setLastPick(zoneId);
    if (zoneId === round.correctZone) {
      setFeedback(null);
      setPhase('reveal');
      return;
    }
    mistakesRef.current += 1;
    const hint = round.wrongHints[zoneId] ?? 'Pak Cik Aziz: Not quite — study the colours and motifs, then try another corner of the map.';
    setFeedback(hint);
    setShowHintCrop(true);
  };

  const cropSrc = showHintCrop && round ? round.hintSrc : round?.cropSrc;

  return (
    <GameShell title={config.title} accentColor={accentColor}>
      {phase === 'idle' && (
        <GameOverlay title={config.title} body={config.instructions} buttonLabel="Start mural hunt" onAction={start} />
      )}

      {phase === 'won' && (
        <GameOverlay
          title="Curator unlocked!"
          body={config.winMessage}
          buttonLabel="Play again"
          tone="won"
          xpEarned={xpEarned}
          onAction={start}
        />
      )}

      {(phase === 'guess' || phase === 'reveal') && round && (
        <div className="space-y-4">
          <p className="font-body text-sm text-navy/70 text-center">
            Round {roundIndex + 1} of {roundsTotal} — Where is this mural?
          </p>

          <div className="rounded-2xl overflow-hidden border-2 border-dashed border-navy/20 bg-navy/5">
            {cropSrc ? (
              <img
                src={cropSrc}
                alt={showHintCrop ? 'Wider mural hint' : 'Tight mural crop — location guess'}
                className={`w-full object-cover ${showHintCrop ? 'max-h-52' : 'max-h-44 scale-110 object-center'}`}
              />
            ) : (
              <div className="h-44 flex items-center justify-center text-navy/40 font-body text-sm">Mural image</div>
            )}
            <p className="font-body text-xs text-navy/50 text-center py-2 px-3">
              {showHintCrop ? 'Wider hint — real photos replace these placeholders.' : 'Detail crop — no street name shown.'}
            </p>
          </div>

          {feedback && (
            <div className="rounded-xl bg-merlion/15 border border-merlion/30 p-3">
              <p className="font-body text-sm text-navy/85 leading-relaxed">{feedback}</p>
            </div>
          )}

          {phase === 'guess' && (
            <div>
              <p className="font-heading font-bold text-sm text-navy mb-2 text-center">Tap a zone</p>
              <div className="grid grid-cols-2 gap-2">
                {MURAL_ZONES.map((z) => (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => pickZone(z.id)}
                    className="font-body text-sm py-2.5 px-2 rounded-xl border-2 transition-colors hover:scale-[1.02]"
                    style={{
                      borderColor: lastPick === z.id ? accentColor : `${accentColor}44`,
                      backgroundColor: lastPick === z.id ? `${accentColor}18` : 'white',
                    }}
                  >
                    {z.mapLabel}
                  </button>
                ))}
              </div>
            </div>
          )}

          {phase === 'reveal' && (
            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden border border-teal/40">
                <img src={round.fullSrc} alt={round.muralTitle} className="w-full max-h-56 object-cover" />
              </div>
              <div className="rounded-xl bg-teal/10 p-3">
                <p className="font-heading font-bold text-navy text-sm">{round.muralTitle}</p>
                <p className="font-body text-sm text-navy/80 mt-1 leading-relaxed">{round.fact}</p>
              </div>
              <button
                type="button"
                onClick={advanceOrWin}
                className="w-full bg-teal text-white font-heading font-bold py-2.5 rounded-xl hover:opacity-90"
              >
                {roundIndex >= roundsTotal - 1 ? 'Finish tour' : 'Next mural'}
              </button>
            </div>
          )}
        </div>
      )}
    </GameShell>
  );
}
