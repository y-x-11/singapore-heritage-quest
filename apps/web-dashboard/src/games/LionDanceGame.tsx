import { useEffect, useRef, useState, type PointerEvent } from 'react';
import type { HeritageGameConfig } from '@heritage/shared';
import { useGameXpAward } from '../hooks/useGameXpAward';
import GameShell, { GameOverlay } from './GameShell';

interface Props {
  config: HeritageGameConfig;
  accentColor: string;
}

type Lane = 'drum' | 'leap';

interface Note {
  id: number;
  lane: Lane;
  y: number;
}

const SEQUENCE: Lane[] = [
  'drum',
  'leap',
  'drum',
  'drum',
  'leap',
  'leap',
  'drum',
  'leap',
  'drum',
  'leap',
  'leap',
  'drum',
];

const NEEDED = 8;
const FALL_PER_MS = 0.055;
const SPAWN_EVERY_MS = 780;
const HIT_Y = 78;
const HIT_WINDOW = 7;
const STAGE_H = 340;

export default function LionDanceGame({ config, accentColor }: Props) {
  const { awardOnWin, resetAward } = useGameXpAward(config.id);
  const [phase, setPhase] = useState<'idle' | 'playing' | 'won'>('idle');
  const [lionLane, setLionLane] = useState<Lane>('drum');
  const [notes, setNotes] = useState<Note[]>([]);
  const [collected, setCollected] = useState(0);
  const [pose, setPose] = useState<'idle' | 'catch' | 'miss'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [xpEarned, setXpEarned] = useState<number | undefined>();
  const mistakesRef = useRef(0);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const phaseRef = useRef(phase);
  const lionRef = useRef<Lane>('drum');
  const notesRef = useRef<Note[]>([]);
  const collectedRef = useRef(0);
  const spawnIndexRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const lastTickRef = useRef(0);
  const nextIdRef = useRef(1);
  const rafRef = useRef(0);
  const poseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  phaseRef.current = phase;
  lionRef.current = lionLane;
  notesRef.current = notes;
  collectedRef.current = collected;

  const stopLoop = () => {
    cancelAnimationFrame(rafRef.current);
    if (poseTimerRef.current) clearTimeout(poseTimerRef.current);
  };

  useEffect(() => () => stopLoop(), []);

  const flashPose = (next: 'catch' | 'miss') => {
    setPose(next);
    if (poseTimerRef.current) clearTimeout(poseTimerRef.current);
    poseTimerRef.current = setTimeout(() => setPose('idle'), 220);
  };

  const moveLion = (lane: Lane) => {
    lionRef.current = lane;
    setLionLane(lane);
  };

  const start = () => {
    stopLoop();
    mistakesRef.current = 0;
    resetAward();
    setXpEarned(undefined);
    spawnIndexRef.current = 0;
    lastSpawnRef.current = 0;
    lastTickRef.current = 0;
    nextIdRef.current = 1;
    collectedRef.current = 0;
    notesRef.current = [];
    lionRef.current = 'drum';
    setLionLane('drum');
    setNotes([]);
    setCollected(0);
    setPose('idle');
    setMessage('Move the lion under the beat as it hits the dotted line.');
    setPhase('playing');
    requestAnimationFrame(() => stageRef.current?.focus());
  };

  useEffect(() => {
    if (phase !== 'playing') {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    const tick = (now: number) => {
      if (phaseRef.current !== 'playing') return;
      const dt = lastTickRef.current ? Math.min(32, now - lastTickRef.current) : 16;
      lastTickRef.current = now;

      if (!lastSpawnRef.current || now - lastSpawnRef.current >= SPAWN_EVERY_MS) {
        const lane = SEQUENCE[spawnIndexRef.current % SEQUENCE.length];
        spawnIndexRef.current += 1;
        lastSpawnRef.current = now;
        notesRef.current = [
          ...notesRef.current,
          { id: nextIdRef.current, lane, y: -8 },
        ];
        nextIdRef.current += 1;
      }

      let gained = 0;
      let missed = false;
      const kept: Note[] = [];

      for (const note of notesRef.current) {
        const y = note.y + FALL_PER_MS * dt;
        const inWindow = y >= HIT_Y - HIT_WINDOW && y <= HIT_Y + HIT_WINDOW;

        if (inWindow && note.lane === lionRef.current) {
          gained += 1;
          continue;
        }
        if (y > HIT_Y + HIT_WINDOW) {
          missed = true;
          continue;
        }
        kept.push({ ...note, y });
      }

      notesRef.current = kept;
      setNotes(kept);

      if (gained > 0) {
        const next = Math.min(NEEDED, collectedRef.current + gained);
        collectedRef.current = next;
        setCollected(next);
        flashPose('catch');
        setMessage(gained > 1 ? 'Nice catch!' : next >= NEEDED ? 'The greens reach the plate!' : 'Caught! The greens shuffle closer.');
        if (next >= NEEDED) {
          setXpEarned(awardOnWin(mistakesRef.current));
          setPhase('won');
          return;
        }
      } else if (missed) {
        mistakesRef.current += 1;
        flashPose('miss');
        setMessage('Missed the line. Slide under the next beat.');
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'playing') return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        moveLion('drum');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        moveLion('leap');
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase]);

  const onStagePointer = (e: PointerEvent<HTMLDivElement>) => {
    if (phase !== 'playing') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    moveLion(x < rect.width / 2 ? 'drum' : 'leap');
  };

  const vegPct = 8 + (collected / NEEDED) * 76;

  return (
    <GameShell title={config.title} accentColor={accentColor}>
      {phase === 'idle' && (
        <GameOverlay
          title={config.title}
          body={config.instructions}
          buttonLabel="Start the drums"
          onAction={start}
        />
      )}

      {phase === 'won' && (
        <GameOverlay
          title="Yay! You helped the lion collect the vegetable!"
          body={config.winMessage}
          buttonLabel="Dance again"
          onAction={start}
          tone="won"
          xpEarned={xpEarned}
        />
      )}

      {phase === 'playing' && (
        <div className="space-y-3">
          <p className="font-body text-xs text-navy/50 text-center">
            Arrow keys or tap a lane. Catch {collected}/{NEEDED} beats on the dotted line
          </p>

          <div
            className="relative mx-auto h-10 rounded-2xl border-2 bg-cream overflow-visible"
            style={{ maxWidth: 360, borderColor: accentColor + '55' }}
            aria-label={`Greens progress ${collected} of ${NEEDED}`}
          >
            <div
              className="absolute inset-y-1 left-10 right-10 rounded-full"
              style={{ background: `${accentColor}22` }}
            />
            <span className="absolute right-1 top-1/2 -translate-y-1/2 text-xl leading-none z-10">🍽️</span>
            <span
              className="absolute top-1/2 z-20 text-xl leading-none transition-all duration-200"
              style={{ left: `${vegPct}%`, transform: 'translate(-50%, -50%)' }}
            >
              🥬
            </span>
          </div>

          <div
            ref={stageRef}
            tabIndex={0}
            role="application"
            aria-label="Lion dance lanes. Left drum, right leap."
            className="relative mx-auto overflow-hidden rounded-3xl border-2 select-none touch-none outline-none"
            style={{
              width: '100%',
              maxWidth: 360,
              height: STAGE_H,
              borderColor: accentColor + '55',
              background: 'linear-gradient(180deg, #3D1A1A 0%, #7A1F1F 42%, #C45C26 100%)',
            }}
            onPointerDown={onStagePointer}
          >
            <div className="absolute inset-y-0 left-1/2 w-px bg-white/35 z-10" />

            <p className="absolute top-2 left-[25%] -translate-x-1/2 font-heading font-bold z-10" style={{ fontSize: 10, color: '#FFD166' }}>
              DRUM
            </p>
            <p className="absolute top-2 left-[75%] -translate-x-1/2 font-heading font-bold z-10" style={{ fontSize: 10, color: '#FFD166' }}>
              LEAP
            </p>

            <div
              className="absolute left-2 right-2 z-20 border-t-2 border-dashed"
              style={{ top: `${HIT_Y}%`, borderColor: '#FFD166' }}
            />

            {notes.map((note) => (
              <div
                key={note.id}
                className="absolute z-30 flex h-11 w-11 items-center justify-center rounded-full text-xl shadow-lg pointer-events-none"
                style={{
                  left: note.lane === 'drum' ? '25%' : '75%',
                  top: `${note.y}%`,
                  transform: 'translate(-50%, -50%)',
                  background: note.lane === 'drum' ? '#1D3557' : accentColor,
                  border: '2px solid #FFD166',
                }}
              >
                {note.lane === 'drum' ? '🥁' : '⬆️'}
              </div>
            ))}

            <div
              className="absolute z-40 text-5xl leading-none"
              style={{
                left: lionLane === 'drum' ? '25%' : '75%',
                top: `${HIT_Y + 10}%`,
                transform:
                  pose === 'catch'
                    ? 'translate(-50%, -58%) scale(1.08)'
                    : pose === 'miss'
                      ? 'translate(-50%, -40%) rotate(-8deg)'
                      : 'translate(-50%, -40%)',
                transition: 'left 0.12s ease, transform 0.12s ease',
              }}
            >
              🦁
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="py-3 rounded-2xl font-heading font-bold text-white select-none touch-none"
              style={{ backgroundColor: '#1D3557', opacity: lionLane === 'drum' ? 1 : 0.65 }}
              onPointerDown={(e) => {
                e.preventDefault();
                moveLion('drum');
              }}
            >
              Drum
            </button>
            <button
              type="button"
              className="py-3 rounded-2xl font-heading font-bold text-white select-none touch-none"
              style={{ backgroundColor: accentColor, opacity: lionLane === 'leap' ? 1 : 0.65 }}
              onPointerDown={(e) => {
                e.preventDefault();
                moveLion('leap');
              }}
            >
              Leap
            </button>
          </div>

          {message ? (
            <p className="font-body text-sm text-navy/80 bg-cream rounded-xl px-3 py-2 text-center">{message}</p>
          ) : null}
        </div>
      )}
    </GameShell>
  );
}
