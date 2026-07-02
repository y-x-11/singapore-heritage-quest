import { useCallback, useEffect, useRef, useState } from 'react';
import type { LocationGameConfig } from '@heritage/shared';

interface FallingItem {
  id: number;
  emoji: string;
  x: number;
  y: number;
  speed: number;
}

interface CatchHeritageGameProps {
  config: LocationGameConfig;
  accentColor: string;
}

const GAME_W = 340;
const GAME_H = 400;
const CATCHER_W = 72;
const CATCHER_H = 88;
const ITEM_SIZE = 36;
const MAX_MISSES = 5;

export default function CatchHeritageGame({ config, accentColor }: CatchHeritageGameProps) {
  const [phase, setPhase] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [catcherX, setCatcherX] = useState(GAME_W / 2 - CATCHER_W / 2);
  const [mouthOpen, setMouthOpen] = useState(true);
  const [items, setItems] = useState<FallingItem[]>([]);

  const catcherXRef = useRef(catcherX);
  const itemsRef = useRef<FallingItem[]>([]);
  const frameRef = useRef<number>(0);
  const spawnRef = useRef<number>(0);
  const idRef = useRef(0);
  const phaseRef = useRef(phase);
  const scoreRef = useRef(0);
  const missesRef = useRef(0);
  const areaRef = useRef<HTMLDivElement>(null);

  useEffect(() => { catcherXRef.current = catcherX; }, [catcherX]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { missesRef.current = misses; }, [misses]);

  const spawnItem = useCallback(() => {
    const emoji = config.items[Math.floor(Math.random() * config.items.length)];
    const item: FallingItem = {
      id: idRef.current++,
      emoji,
      x: 20 + Math.random() * (GAME_W - ITEM_SIZE - 40),
      y: -ITEM_SIZE,
      speed: 1.8 + Math.random() * 1.4,
    };
    itemsRef.current = [...itemsRef.current, item];
    setItems([...itemsRef.current]);
  }, [config.items]);

  const tick = useCallback(() => {
    if (phaseRef.current !== 'playing') return;

    spawnRef.current += 1;
    if (spawnRef.current % 45 === 0) spawnItem();

    const cx = catcherXRef.current;
    const catchY = GAME_H - CATCHER_H - 8;
    const next: FallingItem[] = [];
    let caught = false;

    for (const item of itemsRef.current) {
      const newY = item.y + item.speed;
      const overlapX = item.x + ITEM_SIZE / 2 > cx && item.x + ITEM_SIZE / 2 < cx + CATCHER_W;
      const atMouth = newY + ITEM_SIZE >= catchY && newY <= catchY + 24;

      if (atMouth && overlapX) {
        caught = true;
        const newScore = scoreRef.current + 1;
        scoreRef.current = newScore;
        setScore(newScore);
        setMouthOpen(true);
        setTimeout(() => setMouthOpen(false), 120);
        setTimeout(() => setMouthOpen(true), 200);
        if (newScore >= config.winScore) {
          phaseRef.current = 'won';
          setPhase('won');
          return;
        }
        continue;
      }

      if (newY > GAME_H) {
        const newMisses = missesRef.current + 1;
        missesRef.current = newMisses;
        setMisses(newMisses);
        if (newMisses >= MAX_MISSES) {
          phaseRef.current = 'lost';
          setPhase('lost');
          return;
        }
        continue;
      }

      next.push({ ...item, y: newY });
    }

    if (caught) {
      // brief pause feel handled by mouth animation
    }

    itemsRef.current = next;
    setItems([...next]);
    frameRef.current = requestAnimationFrame(tick);
  }, [config.winScore, spawnItem]);

  useEffect(() => {
    if (phase === 'playing') {
      frameRef.current = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(frameRef.current);
  }, [phase, tick]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phaseRef.current !== 'playing') return;
      const step = 14;
      if (e.key === 'ArrowLeft') {
        setCatcherX((x) => Math.max(0, x - step));
      } else if (e.key === 'ArrowRight') {
        setCatcherX((x) => Math.min(GAME_W - CATCHER_W, x + step));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const onPointerMove = (clientX: number) => {
    if (phaseRef.current !== 'playing' || !areaRef.current) return;
    const rect = areaRef.current.getBoundingClientRect();
    const relX = clientX - rect.left;
    setCatcherX(Math.max(0, Math.min(GAME_W - CATCHER_W, relX - CATCHER_W / 2)));
  };

  const start = () => {
    itemsRef.current = [];
    setItems([]);
    setScore(0);
    setMisses(0);
    scoreRef.current = 0;
    missesRef.current = 0;
    spawnRef.current = 0;
    setCatcherX(GAME_W / 2 - CATCHER_W / 2);
    setMouthOpen(true);
    setPhase('playing');
  };

  return (
    <div className="flex flex-col items-center">
      <div
        ref={areaRef}
        className="relative rounded-3xl overflow-hidden shadow-inner select-none touch-none"
        style={{
          width: GAME_W,
          height: GAME_H,
          background: `linear-gradient(180deg, ${accentColor}22 0%, ${accentColor}44 100%)`,
          border: `3px solid ${accentColor}`,
        }}
        onMouseMove={(e) => onPointerMove(e.clientX)}
        onTouchMove={(e) => {
          e.preventDefault();
          onPointerMove(e.touches[0].clientX);
        }}
      >
        {/* Score bar */}
        {phase === 'playing' && (
          <div className="absolute top-0 inset-x-0 flex justify-between px-3 py-2 bg-navy/80 text-white text-xs font-body z-10">
            <span>⭐ {score} / {config.winScore}</span>
            <span>💔 {MAX_MISSES - misses} lives</span>
          </div>
        )}

        {/* Falling items */}
        {items.map((item) => (
          <div
            key={item.id}
            className="absolute text-3xl pointer-events-none transition-none"
            style={{ left: item.x, top: item.y, width: ITEM_SIZE, height: ITEM_SIZE, lineHeight: `${ITEM_SIZE}px`, textAlign: 'center' }}
          >
            {item.emoji}
          </div>
        ))}

        {/* Catcher character with open mouth */}
        <div
          className="absolute flex flex-col items-center"
          style={{ left: catcherX, bottom: 4, width: CATCHER_W }}
        >
          <div className="text-2xl mb-0.5">{config.catcherEmoji}</div>
          <div
            className="relative flex items-center justify-center transition-all duration-100"
            style={{ width: CATCHER_W, height: 48 }}
          >
            {/* Face */}
            <div
              className="rounded-full flex flex-col items-center justify-end pb-1"
              style={{ width: 56, height: 56, backgroundColor: '#FFE0BD', border: '3px solid #1D3557' }}
            >
              <div className="flex gap-3 mb-1">
                <div className="w-2 h-2 rounded-full bg-navy" />
                <div className="w-2 h-2 rounded-full bg-navy" />
              </div>
              {/* Open mouth */}
              <div
                className="rounded-b-full transition-all duration-100"
                style={{
                  width: mouthOpen ? 32 : 20,
                  height: mouthOpen ? 18 : 8,
                  backgroundColor: '#1D3557',
                  borderRadius: mouthOpen ? '0 0 16px 16px' : '50%',
                }}
              />
            </div>
          </div>
          <p className="text-[10px] font-heading font-bold text-navy mt-0.5">{config.catcherName}</p>
        </div>

        {/* Overlays */}
        {phase === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy/60 backdrop-blur-sm z-20 p-4 text-center">
            <p className="text-4xl mb-2">🎮</p>
            <h3 className="font-heading font-extrabold text-white text-xl mb-2">{config.title}</h3>
            <p className="font-body text-white/80 text-xs mb-4 leading-relaxed">{config.instructions}</p>
            <button
              type="button"
              onClick={start}
              className="bg-sunshine text-navy font-heading font-bold px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-transform"
            >
              Play!
            </button>
          </div>
        )}

        {phase === 'won' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-teal/90 backdrop-blur-sm z-20 p-4 text-center">
            <p className="text-5xl mb-2">🏆</p>
            <h3 className="font-heading font-extrabold text-white text-xl mb-2">You Win!</h3>
            <p className="font-body text-white/90 text-sm mb-4">{config.winMessage}</p>
            <button type="button" onClick={start} className="bg-white text-teal font-heading font-bold px-6 py-2 rounded-xl">
              Play Again
            </button>
          </div>
        )}

        {phase === 'lost' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-merlion/90 backdrop-blur-sm z-20 p-4 text-center">
            <p className="text-5xl mb-2">😅</p>
            <h3 className="font-heading font-extrabold text-white text-xl mb-2">Try Again!</h3>
            <p className="font-body text-white/90 text-sm mb-4">Too many missed — heritage heroes never give up!</p>
            <button type="button" onClick={start} className="bg-white text-merlion font-heading font-bold px-6 py-2 rounded-xl">
              Retry
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-navy/40 font-body mt-2 text-center max-w-xs">
        ← → keys · drag · touch to move
      </p>
    </div>
  );
}
