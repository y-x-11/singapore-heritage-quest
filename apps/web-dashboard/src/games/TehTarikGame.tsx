import { useRef, useState, type PointerEvent } from 'react';
import type { HeritageGameConfig } from '@heritage/shared';
import { useGameXpAward } from '../hooks/useGameXpAward';
import GameShell, { GameOverlay } from './GameShell';

interface Props {
  config: HeritageGameConfig;
  accentColor: string;
}

type Phase = 'idle' | 'mix' | 'pull' | 'won';
type MixItem = 'teh' | 'susu';

const CUPS = [
  { min: 38, max: 80, dragPx: 150, lift: 92 },
  { min: 48, max: 74, dragPx: 125, lift: 112 },
  { min: 54, max: 70, dragPx: 108, lift: 128 },
] as const;

const STAGE = { width: 280, height: 300 };

export default function TehTarikGame({ config, accentColor }: Props) {
  const { awardOnWin, resetAward } = useGameXpAward(config.id);
  const [phase, setPhase] = useState<Phase>('idle');
  const [mixed, setMixed] = useState<Set<MixItem>>(new Set());
  const [goodPulls, setGoodPulls] = useState(0);
  const [height, setHeight] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [splash, setSplash] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [xpEarned, setXpEarned] = useState<number | undefined>();
  const mistakesRef = useRef(0);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const startYRef = useRef(0);
  const heightRef = useRef(0);
  const draggingRef = useRef(false);
  const goodRef = useRef(0);
  const mixTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pullTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cup = CUPS[Math.min(goodPulls, CUPS.length - 1)] ?? CUPS[0];

  const clearTimers = () => {
    if (mixTimerRef.current) clearTimeout(mixTimerRef.current);
    if (pullTimerRef.current) clearTimeout(pullTimerRef.current);
    mixTimerRef.current = null;
    pullTimerRef.current = null;
  };

  const start = () => {
    clearTimers();
    mistakesRef.current = 0;
    resetAward();
    setXpEarned(undefined);
    goodRef.current = 0;
    heightRef.current = 0;
    draggingRef.current = false;
    setMixed(new Set());
    setGoodPulls(0);
    setHeight(0);
    setDragging(false);
    setSplash(false);
    setMessage('Tap teh and condensed milk into the mug. Order does not matter.');
    setPhase('mix');
  };

  const addMix = (item: MixItem) => {
    if (phase !== 'mix' || mixed.has(item)) return;
    const next = new Set(mixed);
    next.add(item);
    setMixed(next);
    if (next.size < 2) {
      setMessage(item === 'teh' ? 'Strong tea in. Now add susu (condensed milk).' : 'Susu in. Now pour the teh.');
      return;
    }
    setMessage('Condensed milk sweetens and clouds the pull. Now stretch the tea between the mugs.');
    mixTimerRef.current = setTimeout(() => {
      setHeight(0);
      heightRef.current = 0;
      setMessage('Drag the top mug up. Release when the ribbon is in the gold froth zone.');
      setPhase('pull');
    }, 800);
  };

  const cupIndex = () => Math.min(goodRef.current, CUPS.length - 1);
  const currentCup = () => CUPS[cupIndex()] ?? CUPS[0];

  const beginDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (phase !== 'pull' || draggingRef.current) return;
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* pointer capture is optional — drag still works via move/up on the stage */
    }
    startYRef.current = e.clientY;
    heightRef.current = 0;
    draggingRef.current = true;
    setDragging(true);
    setHeight(0);
    setSplash(false);
    setMessage(null);
  };

  const moveDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    e.preventDefault();
    const { dragPx } = currentCup();
    const dy = startYRef.current - e.clientY;
    const next = Math.max(0, Math.min(100, (dy / dragPx) * 100));
    heightRef.current = next;
    setHeight(next);
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      /* ignore */
    }
    draggingRef.current = false;
    setDragging(false);

    const { min, max } = currentCup();
    const h = heightRef.current;
    const stage = stageRef.current?.getBoundingClientRect();
    const offMug = stage ? Math.abs(e.clientX - (stage.left + stage.width / 2)) > stage.width * 0.38 : false;

    if (h < min) {
      mistakesRef.current += 1;
      setMessage('Too weak. Drag higher so the ribbon cools and froths.');
      setHeight(0);
      heightRef.current = 0;
      return;
    }
    if (h > max || offMug) {
      mistakesRef.current += 1;
      setSplash(true);
      setMessage(offMug ? 'Off the mug. Keep the ribbon over the catch cup.' : 'Spill! Release sooner, while the ribbon is in the gold zone.');
      pullTimerRef.current = setTimeout(() => {
        setHeight(0);
        heightRef.current = 0;
        setSplash(false);
      }, 400);
      return;
    }

    setSplash(true);
    const next = goodRef.current + 1;
    goodRef.current = next;
    setGoodPulls(next);
    const foamNote =
      next === 1 ? 'First pull: a light foam starts to form.' : next === 2 ? 'Second pull: the tea cools and the foam thickens.' : 'Third pull: classic mamak froth!';
    setMessage(foamNote);

    pullTimerRef.current = setTimeout(() => {
      setHeight(0);
      heightRef.current = 0;
      setSplash(false);
      if (next >= 3) {
        setXpEarned(awardOnWin(mistakesRef.current));
        setPhase('won');
      }
    }, next >= 3 ? 800 : 500);
  };

  const inSweetZone = dragging && height >= cup.min && height <= cup.max;
  const tooHigh = dragging && height > cup.max;
  const showStream = dragging && height > 4;
  const topMugLift = Math.round((height / 100) * cup.lift);
  const streamLength = Math.max(0, Math.round(20 + (height / 100) * (cup.lift + 24)));
  const mixFill = mixed.has('teh') && mixed.has('susu') ? 62 : mixed.size === 1 ? 34 : 10;
  const pullFill = Math.min(82, 28 + goodPulls * 14 + (dragging ? height * 0.12 : 0));
  const foamH = goodPulls === 0 ? 0 : 6 + goodPulls * 5;
  const showFroth = foamH > 0 || inSweetZone || (splash && inSweetZone);

  const zoneTop = 42 + (100 - cup.max) * 0.55;
  const zoneHeight = Math.max(28, (cup.max - cup.min) * 1.15);

  return (
    <GameShell title={config.title} accentColor={accentColor}>
      {phase === 'idle' && (
        <GameOverlay title={config.title} body={config.instructions} buttonLabel="Open the stall" onAction={start} />
      )}

      {phase === 'won' && (
        <GameOverlay
          title="Master puller!"
          body={config.winMessage}
          buttonLabel="Pull again"
          onAction={start}
          tone="won"
          xpEarned={xpEarned}
        />
      )}

      {(phase === 'mix' || phase === 'pull') && (
        <div className="space-y-3">
          <p className="font-body text-xs text-navy/50 text-center">
            {phase === 'mix'
              ? `Mix ${mixed.size}/2. Tap teh and susu into the mug`
              : `Cup ${Math.min(goodPulls + 1, 3)}/3. Drag the top mug up, release in the gold zone`}
          </p>

          <div
            ref={stageRef}
            className="relative mx-auto overflow-visible rounded-3xl border-2 select-none touch-none"
            style={{
              width: STAGE.width,
              height: STAGE.height,
              borderColor: accentColor + '55',
              background: 'linear-gradient(180deg, #FFF8F0 0%, #F3E6D8 55%, #E8D5C4 100%)',
              cursor: phase === 'pull' ? 'grab' : 'default',
            }}
            onPointerDown={phase === 'pull' ? beginDrag : undefined}
            onPointerMove={phase === 'pull' ? moveDrag : undefined}
            onPointerUp={phase === 'pull' ? endDrag : undefined}
            onPointerCancel={phase === 'pull' ? endDrag : undefined}
          >
            {phase === 'pull' ? (
              <>
                <div
                  className="absolute left-0 right-0 pointer-events-none z-0"
                  style={{
                    top: zoneTop,
                    height: zoneHeight,
                    background: inSweetZone ? 'rgba(255, 209, 102, 0.45)' : 'rgba(255, 209, 102, 0.22)',
                    borderTop: '1px dashed #C9A227',
                    borderBottom: '1px dashed #C9A227',
                  }}
                />
                <p
                  className="absolute left-2 z-0 font-heading font-bold"
                  style={{ top: zoneTop + zoneHeight / 2 - 6, fontSize: 10, color: '#8A6A10' }}
                >
                  FROTH ZONE
                </p>
              </>
            ) : null}

            {phase === 'pull' ? (
              <div
                className="absolute left-1/2 z-20 flex flex-col items-center"
                style={{
                  top: 18,
                  transform: `translateX(-50%) translateY(-${topMugLift}px)`,
                  transition: dragging ? 'none' : 'transform 0.3s ease-out',
                }}
              >
                <div
                  className="relative flex items-end justify-center rounded-b-xl rounded-t-md shadow-md"
                  style={{
                    width: 56,
                    height: 48,
                    background: 'linear-gradient(180deg, #D8DEE6 0%, #9AA3AD 100%)',
                    border: '2px solid #6B7280',
                  }}
                >
                  <div
                    className="absolute bottom-1 left-1 right-1 rounded-b-lg"
                    style={{
                      height: dragging ? '72%' : '38%',
                      background: 'linear-gradient(180deg, #E8B86D 0%, #C4783A 100%)',
                    }}
                  />
                </div>
                <span className="mt-0.5 font-heading text-navy/60" style={{ fontSize: 10, fontWeight: 700 }}>
                  Drag up
                </span>
              </div>
            ) : null}

            {showStream ? (
              <div
                className="absolute left-1/2 z-10 pointer-events-none"
                style={{
                  top: 66 - topMugLift + 40,
                  transform: 'translateX(-50%)',
                  width: tooHigh ? 10 : inSweetZone ? 7 : 5,
                  height: streamLength,
                  borderRadius: 999,
                  background: tooHigh
                    ? 'linear-gradient(180deg, #8B4513 0%, #C4783A 40%, #E8B86D 100%)'
                    : 'linear-gradient(180deg, #C4783A 0%, #E8B86D 50%, #F5D7A1 100%)',
                  boxShadow: inSweetZone ? '0 0 10px rgba(255, 209, 102, 0.8)' : '0 0 4px rgba(196, 120, 58, 0.5)',
                }}
              >
                <div
                  className="absolute inset-0 rounded-full opacity-50"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(180deg, transparent 0 6px, rgba(255,255,255,0.35) 6px 10px)',
                  }}
                />
              </div>
            ) : null}

            <div
              className="absolute left-1/2 z-20 flex flex-col items-center"
              style={{
                bottom: 22,
                transform: splash ? 'translateX(-50%) translateY(4px) scale(1.04)' : 'translateX(-50%)',
                transition: 'transform 0.15s ease',
              }}
            >
              <div
                className="relative overflow-hidden rounded-b-xl rounded-t-md shadow-md"
                style={{
                  width: 68,
                  height: 60,
                  background: 'linear-gradient(180deg, #D8DEE6 0%, #9AA3AD 100%)',
                  border: '2px solid #6B7280',
                }}
              >
                <div
                  className="absolute bottom-0 inset-x-0"
                  style={{
                    height: (phase === 'mix' ? mixFill : pullFill) + '%',
                    background:
                      mixed.has('susu') || phase === 'pull'
                        ? 'linear-gradient(180deg, #E8B86D 0%, #B8652E 100%)'
                        : 'linear-gradient(180deg, #7A3E12 0%, #4A2408 100%)',
                    transition: 'height 0.3s ease',
                  }}
                />
                {phase === 'pull' && (showFroth || foamH > 0) ? (
                  <div
                    className="absolute inset-x-1 rounded-full"
                    style={{
                      bottom: pullFill + '%',
                      height: Math.max(foamH, inSweetZone ? 10 : foamH),
                      background: 'linear-gradient(180deg, #FFF8EF 0%, #F5E6C8 100%)',
                      boxShadow: '0 -2px 6px rgba(255,255,255,0.6)',
                    }}
                  />
                ) : null}
              </div>
              <span className="mt-0.5 font-heading text-navy/60" style={{ fontSize: 10, fontWeight: 700 }}>
                Catch
              </span>
            </div>
          </div>

          {phase === 'mix' ? (
            <div className="grid grid-cols-2 gap-3" style={{ maxWidth: STAGE.width, margin: '0 auto' }}>
              <button
                type="button"
                disabled={mixed.has('teh')}
                className="py-3 rounded-2xl font-heading font-bold text-white select-none touch-none disabled:opacity-50"
                style={{ backgroundColor: accentColor }}
                onClick={() => addMix('teh')}
              >
                Teh
              </button>
              <button
                type="button"
                disabled={mixed.has('susu')}
                className="py-3 rounded-2xl font-heading font-bold text-white select-none touch-none disabled:opacity-50"
                style={{ backgroundColor: '#C9A227' }}
                onClick={() => addMix('susu')}
              >
                Susu
              </button>
            </div>
          ) : (
            <p className="font-body text-xs text-navy/50 text-center">Drag the top mug (or anywhere on the stall), then release in the gold band</p>
          )}

          {message ? (
            <p className="font-body text-sm text-navy/80 bg-cream rounded-xl px-3 py-2 text-center">{message}</p>
          ) : null}
        </div>
      )}
    </GameShell>
  );
}
