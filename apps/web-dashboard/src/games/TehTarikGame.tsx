import { useEffect, useRef, useState, type PointerEvent } from 'react';
import type { HeritageGameConfig } from '@heritage/shared';
import GameShell, { GameOverlay } from './GameShell';

interface Props {
  config: HeritageGameConfig;
  accentColor: string;
}

const SWEET_MIN = 45;
const SWEET_MAX = 72;
const MAX_HEIGHT = 100;
const POUR_SPEED = 1.35;

export default function TehTarikGame({ config, accentColor }: Props) {
  const [phase, setPhase] = useState<'idle' | 'playing' | 'won'>('idle');
  const [pouring, setPouring] = useState(false);
  const [height, setHeight] = useState(0);
  const [goodPulls, setGoodPulls] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [splash, setSplash] = useState(false);
  const heightRef = useRef(0);
  const pouringRef = useRef(false);
  const rafRef = useRef(0);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    heightRef.current = height;
  }, [height]);

  useEffect(() => {
    pouringRef.current = pouring;
  }, [pouring]);

  useEffect(() => {
    if (!pouring) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    let last = performance.now();
    const tick = (now: number) => {
      if (!pouringRef.current) return;
      const dt = Math.min(32, now - last);
      last = now;
      const next = Math.min(MAX_HEIGHT, heightRef.current + POUR_SPEED * (dt / 16));
      heightRef.current = next;
      setHeight(next);

      if (next >= MAX_HEIGHT) {
        pouringRef.current = false;
        setPouring(false);
        setSplash(true);
        setMessage('Spill! The stream went too high - release sooner for frothy teh tarik.');
        setTimeout(() => {
          setHeight(0);
          setSplash(false);
        }, 450);
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pouring]);

  const start = () => {
    setGoodPulls(0);
    setHeight(0);
    setMessage(null);
    setPouring(false);
    pouringRef.current = false;
    setSplash(false);
    setPhase('playing');
  };

  const beginPour = (e: PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    buttonRef.current?.setPointerCapture(e.pointerId);
    setMessage(null);
    setSplash(false);
    heightRef.current = 0;
    setHeight(0);
    pouringRef.current = true;
    setPouring(true);
  };

  const release = (e?: PointerEvent<HTMLButtonElement>) => {
    if (!pouringRef.current) return;
    if (e && buttonRef.current?.hasPointerCapture(e.pointerId)) {
      buttonRef.current.releasePointerCapture(e.pointerId);
    }

    pouringRef.current = false;
    setPouring(false);
    const h = heightRef.current;

    if (h < SWEET_MIN) {
      setMessage('Too weak - hold longer so the stream rises and the tea cools and froths.');
      setHeight(0);
      return;
    }
    if (h > SWEET_MAX) {
      setMessage('Almost spilled! Release earlier, in the gold froth zone.');
      setSplash(true);
      setTimeout(() => {
        setHeight(0);
        setSplash(false);
      }, 400);
      return;
    }

    setSplash(true);
    const next = goodPulls + 1;
    setGoodPulls(next);
    setMessage('Perfect pull! Cooling + aeration = classic teh tarik foam.');
    setTimeout(() => {
      setHeight(0);
      setSplash(false);
    }, 500);

    if (next >= 3) {
      setTimeout(() => setPhase('won'), 800);
    }
  };

  const topMugLift = Math.round((height / 100) * 110);
  const streamLength = Math.max(0, Math.round(24 + (height / 100) * 130));
  const inSweetZone = pouring && height >= SWEET_MIN && height <= SWEET_MAX;
  const tooHigh = pouring && height > SWEET_MAX;
  const showStream = pouring && height > 4;
  const showFroth = inSweetZone || (splash && height >= SWEET_MIN && height <= SWEET_MAX);
  const fillPercent = Math.min(85, 18 + height * 0.55);

  const stageStyle = {
    width: 280,
    height: 280,
    borderColor: accentColor + '55',
    background: 'linear-gradient(180deg, #FFF8F0 0%, #F3E6D8 55%, #E8D5C4 100%)',
  };

  const zoneStyle = {
    top: 48,
    height: 56,
    background: inSweetZone ? 'rgba(255, 209, 102, 0.45)' : 'rgba(255, 209, 102, 0.22)',
    borderTop: '1px dashed #C9A227',
    borderBottom: '1px dashed #C9A227',
  };

  const topMugStyle = {
    top: 16,
    transform: 'translateX(-50%) translateY(-' + topMugLift + 'px)',
    transition: pouring ? 'none' : 'transform 0.35s ease-out',
  };

  const streamStyle = {
    top: 64 - topMugLift + 48,
    transform: 'translateX(-50%)',
    width: tooHigh ? 10 : inSweetZone ? 7 : 5,
    height: streamLength,
    borderRadius: 999,
    background: tooHigh
      ? 'linear-gradient(180deg, #8B4513 0%, #C4783A 40%, #E8B86D 100%)'
      : 'linear-gradient(180deg, #C4783A 0%, #E8B86D 50%, #F5D7A1 100%)',
    boxShadow: inSweetZone
      ? '0 0 10px rgba(255, 209, 102, 0.8)'
      : '0 0 4px rgba(196, 120, 58, 0.5)',
    opacity: 0.95,
  };

  const streamDashStyle = {
    backgroundImage:
      'repeating-linear-gradient(180deg, transparent 0 6px, rgba(255,255,255,0.35) 6px 10px)',
    backgroundSize: '100% 20px',
  };

  const bottomMugWrapStyle = {
    bottom: 28,
    transform: splash
      ? 'translateX(-50%) translateY(4px) scale(1.04)'
      : 'translateX(-50%)',
    transition: 'transform 0.15s ease',
  };

  const fillStyle = {
    height: fillPercent + '%',
    background: 'linear-gradient(180deg, #E8B86D 0%, #B8652E 100%)',
    transition: pouring ? 'none' : 'height 0.3s ease',
  };

  const frothStyle = {
    bottom: fillPercent + '%',
    height: 10,
    background: 'linear-gradient(180deg, #FFF8EF 0%, #F5E6C8 100%)',
    boxShadow: '0 -2px 6px rgba(255,255,255,0.6)',
  };

  const meterFillStyle = {
    height: height + '%',
    backgroundColor: tooHigh ? '#E63946' : inSweetZone ? '#FFD166' : accentColor,
  };

  return (
    <GameShell title={config.title} accentColor={accentColor}>
      {phase === 'idle' && (
        <GameOverlay
          title={config.title}
          body={config.instructions}
          buttonLabel="Start pouring"
          onAction={start}
        />
      )}

      {phase === 'won' && (
        <GameOverlay
          title="Master puller!"
          body={config.winMessage}
          buttonLabel="Pull again"
          onAction={start}
          tone="won"
        />
      )}

      {phase === 'playing' && (
        <div className="space-y-4">
          <p className="font-body text-xs text-navy/50 text-center">
            Good pulls {goodPulls}/3 · Hold to pour, release when the stream is in the gold zone
          </p>

          <div className="relative mx-auto overflow-hidden rounded-3xl border-2" style={stageStyle}>
            <div className="absolute left-0 right-0 pointer-events-none z-0" style={zoneStyle} />
            <p
              className="absolute left-2 z-0 font-heading font-bold text-navy/60"
              style={{ top: 58, fontSize: 10, color: '#8A6A10' }}
            >
              FROTH ZONE
            </p>

            <div
              className="absolute left-1/2 z-20 flex flex-col items-center"
              style={topMugStyle}
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
                    height: pouring ? '70%' : '40%',
                    background: 'linear-gradient(180deg, #E8B86D 0%, #C4783A 100%)',
                  }}
                />
              </div>
              <span className="mt-0.5 font-heading text-navy/60" style={{ fontSize: 10, fontWeight: 700 }}>
                Pour
              </span>
            </div>

            {showStream ? (
              <div className="absolute left-1/2 z-10 pointer-events-none" style={streamStyle}>
                <div className="absolute inset-0 rounded-full opacity-50" style={streamDashStyle} />
              </div>
            ) : null}

            <div
              className="absolute left-1/2 z-20 flex flex-col items-center"
              style={bottomMugWrapStyle}
            >
              <div
                className="relative overflow-hidden rounded-b-xl rounded-t-md shadow-md"
                style={{
                  width: 64,
                  height: 56,
                  background: 'linear-gradient(180deg, #D8DEE6 0%, #9AA3AD 100%)',
                  border: '2px solid #6B7280',
                }}
              >
                <div className="absolute bottom-0 inset-x-0" style={fillStyle} />
                {showFroth ? (
                  <div className="absolute inset-x-1 rounded-full" style={frothStyle} />
                ) : null}
              </div>
              <span className="mt-0.5 font-heading text-navy/60" style={{ fontSize: 10, fontWeight: 700 }}>
                Catch
              </span>
            </div>

            <div className="absolute right-3 top-4 bottom-4 w-2 rounded-full bg-navy/10 overflow-hidden">
              <div className="absolute bottom-0 inset-x-0 rounded-full" style={meterFillStyle} />
            </div>
          </div>

          <button
            ref={buttonRef}
            type="button"
            className="w-full py-4 rounded-2xl font-heading font-bold text-white select-none touch-none"
            style={{ backgroundColor: pouring ? '#1D3557' : accentColor }}
            onPointerDown={beginPour}
            onPointerUp={release}
            onPointerCancel={release}
          >
            {pouring ? 'Release for froth!' : 'Hold to pour'}
          </button>

          {message ? (
            <p className="font-body text-sm text-navy/80 bg-cream rounded-xl px-3 py-2 text-center">
              {message}
            </p>
          ) : null}
        </div>
      )}
    </GameShell>
  );
}
