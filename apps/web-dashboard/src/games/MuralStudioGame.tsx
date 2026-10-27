import { useCallback, useEffect, useRef, useState } from 'react';
import type { HeritageGameConfig } from '@heritage/shared';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGameXpAward } from '../hooks/useGameXpAward';
import GameShell, { GameOverlay } from './GameShell';

interface Props {
  config: HeritageGameConfig;
  accentColor: string;
}

type ShapeKind = 'triangle' | 'square' | 'circle' | 'rectangle' | 'line';
type Tool = 'select' | 'brush' | 'eraser';

const CANVAS = 360;
const BRUSH = 6;
const ERASER = 22;

const COLORS = [
  { id: 'red', hex: '#E63946' },
  { id: 'orange', hex: '#F4A261' },
  { id: 'yellow', hex: '#FFD166' },
  { id: 'green', hex: '#2A9D8F' },
  { id: 'blue', hex: '#457B9D' },
  { id: 'purple', hex: '#9B5DE5' },
  { id: 'black', hex: '#1D3557' },
] as const;

interface PlacedShape {
  id: string;
  kind: ShapeKind;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}

function drawShape(ctx: CanvasRenderingContext2D, s: PlacedShape) {
  ctx.save();
  ctx.fillStyle = s.color;
  ctx.strokeStyle = s.color;
  ctx.lineWidth = Math.max(3, Math.min(s.w, s.h) * 0.08);
  const cx = s.x + s.w / 2;
  const cy = s.y + s.h / 2;

  switch (s.kind) {
    case 'rectangle':
      ctx.fillRect(s.x, s.y, s.w, s.h);
      break;
    case 'square':
      ctx.fillRect(s.x, s.y, s.w, s.h);
      break;
    case 'circle':
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(s.w, s.h) / 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'triangle':
      ctx.beginPath();
      ctx.moveTo(cx, s.y);
      ctx.lineTo(s.x + s.w, s.y + s.h);
      ctx.lineTo(s.x, s.y + s.h);
      ctx.closePath();
      ctx.fill();
      break;
    case 'line':
      ctx.beginPath();
      ctx.moveTo(s.x, s.y + s.h / 2);
      ctx.lineTo(s.x + s.w, s.y + s.h / 2);
      ctx.stroke();
      break;
    default:
      break;
  }
  ctx.restore();
}

const HANDLE = 16;

function hitTest(s: PlacedShape, px: number, py: number): boolean {
  return px >= s.x && px <= s.x + s.w && py >= s.y && py <= s.y + s.h;
}

function nearResizeHandle(s: PlacedShape, px: number, py: number): boolean {
  const cx = s.x + s.w;
  const cy = s.y + s.h;
  return Math.abs(px - cx) <= HANDLE && Math.abs(py - cy) <= HANDLE;
}

function exportMural(
  shapes: PlacedShape[],
  paintCanvas: HTMLCanvasElement,
  bgColor: string
): string {
  const out = document.createElement('canvas');
  out.width = CANVAS;
  out.height = CANVAS;
  const ctx = out.getContext('2d');
  if (!ctx) return '';

  ctx.save();
  ctx.beginPath();
  ctx.arc(CANVAS / 2, CANVAS / 2, CANVAS / 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, CANVAS, CANVAS);
  for (const s of shapes) drawShape(ctx, s);
  ctx.drawImage(paintCanvas, 0, 0);
  ctx.restore();

  return out.toDataURL('image/jpeg', 0.88);
}

export default function MuralStudioGame({ config, accentColor }: Props) {
  const { user, saveMural } = useAuth();
  const { awardOnWin, resetAward } = useGameXpAward(config.id);
  const paintRef = useRef<HTMLCanvasElement>(null);
  const compositeRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<'idle' | 'edit' | 'name' | 'saved'>('idle');
  const [tool, setTool] = useState<Tool>('select');
  const [color, setColor] = useState(COLORS[0].hex);
  const [shapes, setShapes] = useState<PlacedShape[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drag, setDrag] = useState<{ id: string; ox: number; oy: number } | null>(null);
  const [resize, setResize] = useState<{ id: string; startW: number; startH: number; sx: number; sy: number } | null>(
    null
  );
  const [drawing, setDrawing] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [titleDraft, setTitleDraft] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [xpEarned, setXpEarned] = useState<number | undefined>();

  const redrawComposite = useCallback(() => {
    const comp = compositeRef.current;
    const paint = paintRef.current;
    if (!comp || !paint) return;
    const ctx = comp.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS, CANVAS);
    ctx.save();
    ctx.beginPath();
    ctx.arc(CANVAS / 2, CANVAS / 2, CANVAS / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = '#f8f6f0';
    ctx.fillRect(0, 0, CANVAS, CANVAS);
    for (const s of shapes) drawShape(ctx, s);
    ctx.drawImage(paint, 0, 0);
    if (selectedId && tool === 'select') {
      const s = shapes.find((sh) => sh.id === selectedId);
      if (s) {
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(s.x, s.y, s.w, s.h);
        ctx.setLineDash([]);
        ctx.fillStyle = accentColor;
        ctx.fillRect(s.x + s.w - 6, s.y + s.h - 6, 12, 12);
      }
    }
    ctx.restore();
  }, [shapes, selectedId, tool, accentColor]);

  useEffect(() => {
    redrawComposite();
  }, [redrawComposite]);

  const canvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scale = CANVAS / rect.width;
    return {
      x: (e.clientX - rect.left) * scale,
      y: (e.clientY - rect.top) * scale,
    };
  };

  const start = () => {
    resetAward();
    setXpEarned(undefined);
    setShapes([]);
    setSelectedId(null);
    setTool('select');
    setPhase('edit');
    setTitleDraft('');
    setSaveError(null);
    const paint = paintRef.current;
    if (paint) {
      const ctx = paint.getContext('2d');
      ctx?.clearRect(0, 0, CANVAS, CANVAS);
    }
    requestAnimationFrame(redrawComposite);
  };

  const addShape = (kind: ShapeKind, x: number, y: number) => {
    const base = kind === 'line' ? { w: 80, h: 12 } : kind === 'circle' ? { w: 56, h: 56 } : { w: 64, h: 64 };
    const id = `shape_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const placed: PlacedShape = {
      id,
      kind,
      x: x - base.w / 2,
      y: y - base.h / 2,
      w: base.w,
      h: base.h,
      color,
    };
    setShapes((prev) => [...prev, placed]);
    setSelectedId(id);
    setTool('select');
  };

  const onPaletteDragStart = (kind: ShapeKind, e: React.DragEvent) => {
    e.dataTransfer.setData('shape', kind);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const onCanvasDrop = (e: React.DragEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const kind = e.dataTransfer.getData('shape') as ShapeKind;
    if (!kind) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scale = CANVAS / rect.width;
    const x = (e.clientX - rect.left) * scale;
    const y = (e.clientY - rect.top) * scale;
    if (Math.hypot(x - CANVAS / 2, y - CANVAS / 2) > CANVAS / 2 - 8) return;
    addShape(kind, x, y);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = canvasPoint(e);
    if (Math.hypot(x - CANVAS / 2, y - CANVAS / 2) > CANVAS / 2) return;

    if (tool === 'select') {
      const selectedShape = selectedId ? shapes.find((s) => s.id === selectedId) : undefined;
      if (selectedShape && nearResizeHandle(selectedShape, x, y)) {
        setResize({
          id: selectedShape.id,
          startW: selectedShape.w,
          startH: selectedShape.h,
          sx: x,
          sy: y,
        });
        e.currentTarget.setPointerCapture(e.pointerId);
        return;
      }
      const hit = [...shapes].reverse().find((s) => hitTest(s, x, y));
      if (hit) {
        setSelectedId(hit.id);
        if (nearResizeHandle(hit, x, y)) {
          setResize({ id: hit.id, startW: hit.w, startH: hit.h, sx: x, sy: y });
        } else {
          setDrag({ id: hit.id, ox: x - hit.x, oy: y - hit.y });
        }
        e.currentTarget.setPointerCapture(e.pointerId);
      } else {
        setSelectedId(null);
      }
      return;
    }

    const paint = paintRef.current;
    if (!paint) return;
    const ctx = paint.getContext('2d');
    if (!ctx) return;
    setDrawing(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.lineWidth = ERASER;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = BRUSH;
    }
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = canvasPoint(e);

    if (drag) {
      setShapes((prev) =>
        prev.map((s) =>
          s.id === drag.id
            ? { ...s, x: x - drag.ox, y: y - drag.oy }
            : s
        )
      );
      return;
    }

    if (resize) {
      setShapes((prev) =>
        prev.map((s) => {
          if (s.id !== resize.id) return s;
          const nw = Math.max(16, resize.startW + (x - resize.sx));
          const nh = Math.max(8, resize.startH + (y - resize.sy));
          return { ...s, w: nw, h: nh };
        })
      );
      return;
    }

    if (!drawing) return;
    const paint = paintRef.current;
    if (!paint) return;
    const ctx = paint.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(x, y);
    ctx.stroke();
    redrawComposite();
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setDrawing(false);
    setDrag(null);
    setResize(null);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    redrawComposite();
  };

  const beginDone = () => {
    if (!user || user.role !== 'student') {
      setSaveError('Sign in as a student to save your mural to your profile.');
      return;
    }
    const paint = paintRef.current;
    if (!paint) return;
    const url = exportMural(shapes, paint, '#f8f6f0');
    setExportUrl(url);
    setTitleDraft('');
    setSaveError(null);
    setPhase('name');
  };

  const confirmSave = async () => {
    const title = titleDraft.trim();
    if (!title) {
      setSaveError('Give your mural a name.');
      return;
    }
    if (title.length > 25) {
      setSaveError('Name must be 25 characters or fewer.');
      return;
    }
    if (!exportUrl) return;
    setSaving(true);
    setSaveError(null);
    try {
      await saveMural(title, exportUrl);
      setXpEarned(awardOnWin(0));
      setPhase('saved');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Could not save mural.');
    } finally {
      setSaving(false);
    }
  };

  const selected = shapes.find((s) => s.id === selectedId);

  return (
    <GameShell title={config.title} accentColor={accentColor}>
      {phase === 'idle' && (
        <GameOverlay title={config.title} body={config.instructions} buttonLabel="Start creating" onAction={start} />
      )}

      {phase === 'saved' && (
        <GameOverlay
          title="Mural saved!"
          body={`"${titleDraft.trim()}" was added to your profile. Tap it there to show it on the leaderboard.`}
          buttonLabel="Create another"
          tone="won"
          xpEarned={xpEarned}
          onAction={start}
        />
      )}

      {phase === 'name' && exportUrl && (
        <div className="space-y-4">
          <p className="font-body text-sm text-navy/70 text-center">Name your mural (max 25 characters)</p>
          <div className="flex justify-center">
            <img src={exportUrl} alt="Mural preview" className="w-40 h-40 rounded-full object-cover border-4 border-teal/30" />
          </div>
          <input
            type="text"
            maxLength={25}
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            placeholder="My Kampong Glam mural"
            className="w-full text-center font-heading font-bold border-2 border-teal/30 rounded-xl px-3 py-2 focus:outline-none focus:border-teal"
          />
          {saveError && <p className="font-body text-xs text-merlion text-center">{saveError}</p>}
          <button
            type="button"
            disabled={saving}
            onClick={confirmSave}
            className="w-full bg-teal text-white font-heading font-bold py-2.5 rounded-xl disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save to profile'}
          </button>
          <button type="button" onClick={() => setPhase('edit')} className="w-full font-body text-sm text-navy/50">
            Back to canvas
          </button>
        </div>
      )}

      {phase === 'edit' && (
        <div className="flex flex-col sm:flex-row gap-3">
          <aside className="flex sm:flex-col gap-2 sm:w-14 shrink-0 order-2 sm:order-1">
            <p className="hidden sm:block font-heading text-xs text-navy/50 text-center mb-1">Shapes</p>
            {(['triangle', 'square', 'circle', 'rectangle', 'line'] as ShapeKind[]).map((kind) => (
              <div
                key={kind}
                draggable
                onDragStart={(e) => onPaletteDragStart(kind, e)}
                className="flex-1 sm:flex-none h-11 sm:w-11 rounded-xl border-2 border-navy/15 bg-white flex items-center justify-center cursor-grab active:cursor-grabbing hover:border-teal/50"
                title={`Drag ${kind} onto the canvas`}
              >
                <ShapeIcon kind={kind} color={color} />
              </div>
            ))}
            <div className="hidden sm:block h-px bg-navy/10 my-1" />
            <button
              type="button"
              onClick={() => setTool('select')}
              className={`h-11 sm:w-11 rounded-xl border-2 text-lg ${tool === 'select' ? 'border-teal bg-teal/10' : 'border-navy/15'}`}
              title="Select and move shapes"
            >
              ↖️
            </button>
            <button
              type="button"
              onClick={() => setTool('brush')}
              className={`h-11 sm:w-11 rounded-xl border-2 text-lg ${tool === 'brush' ? 'border-teal bg-teal/10' : 'border-navy/15'}`}
              title="Paint brush"
            >
              🖌️
            </button>
            <button
              type="button"
              onClick={() => setTool('eraser')}
              className={`h-11 sm:w-11 rounded-xl border-2 text-lg ${tool === 'eraser' ? 'border-teal bg-teal/10' : 'border-navy/15'}`}
              title="Eraser"
            >
              🧽
            </button>
          </aside>

          <div className="flex-1 order-1 sm:order-2">
            <div className="relative mx-auto w-full max-w-[360px] aspect-square">
              <canvas ref={paintRef} width={CANVAS} height={CANVAS} className="hidden" aria-hidden />
              <canvas
                ref={compositeRef}
                width={CANVAS}
                height={CANVAS}
                className="w-full h-full rounded-full shadow-inner border-2 border-navy/10 touch-none cursor-crosshair"
                onDragOver={(e) => e.preventDefault()}
                onDrop={onCanvasDrop}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.hex)}
                  className={`w-8 h-8 rounded-full border-2 ${color === c.hex ? 'border-navy scale-110' : 'border-white shadow'}`}
                  style={{ backgroundColor: c.hex }}
                  aria-label={c.id}
                />
              ))}
            </div>

            {selected && tool === 'select' && (
              <div className="mt-3 flex flex-wrap gap-2 justify-center items-center">
                <span className="font-body text-xs text-navy/50">Drag shape to move · corner square to resize</span>
                <button
                  type="button"
                  className="font-heading text-xs text-merlion px-2"
                  onClick={() => {
                    setShapes((prev) => prev.filter((s) => s.id !== selected.id));
                    setSelectedId(null);
                  }}
                >
                  Delete shape
                </button>
              </div>
            )}

            {saveError && phase === 'edit' && (
              <p className="font-body text-xs text-merlion text-center mt-2">
                {saveError}{' '}
                {!user && (
                  <Link to="/login" className="text-teal underline">
                    Sign in
                  </Link>
                )}
              </p>
            )}

            <button
              type="button"
              onClick={beginDone}
              className="w-full mt-4 font-heading font-bold py-3 rounded-xl text-white"
              style={{ backgroundColor: accentColor }}
            >
              I&apos;m done!
            </button>
          </div>
        </div>
      )}
    </GameShell>
  );
}

function ShapeIcon({ kind, color }: { kind: ShapeKind; color: string }) {
  const s = 28;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-hidden>
      {kind === 'circle' && <circle cx={s / 2} cy={s / 2} r={10} fill={color} />}
      {kind === 'square' && <rect x={6} y={6} width={16} height={16} fill={color} />}
      {kind === 'rectangle' && <rect x={4} y={9} width={20} height={12} fill={color} />}
      {kind === 'triangle' && <polygon points={`${s / 2},5 23,23 5,23`} fill={color} />}
      {kind === 'line' && <line x1={4} y1={s / 2} x2={24} y2={s / 2} stroke={color} strokeWidth={4} />}
    </svg>
  );
}
