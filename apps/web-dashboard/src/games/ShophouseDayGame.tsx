import { useState } from 'react';
import type { HeritageGameConfig } from '@heritage/shared';
import GameShell, { GameOverlay } from './GameShell';

interface Choice {
  label: string;
  community: number;
  result: string;
}

interface Scene {
  time: string;
  emoji: string;
  prompt: string;
  choices: Choice[];
}

const SCENES: Scene[] = [
  {
    time: 'Morning',
    emoji: '🌅',
    prompt: 'Open the shophouse shutters. A clan association neighbour asks for help stacking festival lanterns before customers arrive.',
    choices: [
      {
        label: 'Help hang lanterns first',
        community: 2,
        result: 'The street looks festive. Clan ties made Chinatown resilient — neighbours relied on each other.',
      },
      {
        label: 'Open early for sales',
        community: 0,
        result: 'You earn a few extra coins, but the neighbour looks disappointed. Profit alone rarely built these streets.',
      },
    ],
  },
  {
    time: 'Afternoon',
    emoji: '☀️',
    prompt: 'A tired coolie needs a cheap bowl of tea. A tourist offers double for the last souvenir fan.',
    choices: [
      {
        label: 'Serve the coolie tea',
        community: 2,
        result: 'Shophouses fed workers who carried goods through these alleys. Community kept the district alive.',
      },
      {
        label: 'Sell the fan to the tourist',
        community: 0,
        result: 'Tourists bring income — but heritage trades also served daily life for migrants and labourers.',
      },
    ],
  },
  {
    time: 'Evening',
    emoji: '🏮',
    prompt: 'Lanterns glow on Temple Street. Do you close early to rest, or stay open to share mooncakes with the block?',
    choices: [
      {
        label: 'Share mooncakes with neighbours',
        community: 2,
        result: 'Pastry shops like Tai Chong Kok linked festivals to family enterprise. Sharing cemented belonging.',
      },
      {
        label: 'Close early and count takings',
        community: 0,
        result: 'Rest matters — yet evenings were when the neighbourhood felt most like home.',
      },
    ],
  },
];

interface Props {
  config: HeritageGameConfig;
  accentColor: string;
}

export default function ShophouseDayGame({ config, accentColor }: Props) {
  const [phase, setPhase] = useState<'idle' | 'playing' | 'won'>('idle');
  const [sceneIndex, setSceneIndex] = useState(0);
  const [community, setCommunity] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const start = () => {
    setSceneIndex(0);
    setCommunity(0);
    setFeedback(null);
    setPhase('playing');
  };

  const choose = (choice: Choice) => {
    setCommunity((c) => c + choice.community);
    setFeedback(choice.result);
  };

  const next = () => {
    setFeedback(null);
    if (sceneIndex >= SCENES.length - 1) {
      setPhase('won');
      return;
    }
    setSceneIndex((i) => i + 1);
  };

  const scene = SCENES[sceneIndex];
  const ending =
    community >= 4
      ? `${config.winMessage} Your day leaned toward community — the heart of Chinatown shophouse life.`
      : `${config.winMessage} Trade kept the lights on, but clan and neighbour ties made the street a home.`;

  return (
    <GameShell title={config.title} accentColor={accentColor}>
      {phase === 'idle' && (
        <GameOverlay title={config.title} body={config.instructions} buttonLabel="Open the shutters" onAction={start} />
      )}

      {phase === 'won' && (
        <GameOverlay title="Day complete!" body={ending} buttonLabel="Replay the day" onAction={start} tone="won" />
      )}

      {phase === 'playing' && scene && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="font-heading font-bold text-sm text-navy">
              {scene.emoji} {scene.time}
            </p>
            <p className="font-body text-xs text-navy/50">
              Scene {sceneIndex + 1}/{SCENES.length} · Community {community}
            </p>
          </div>

          <p className="font-body text-sm text-navy/80 leading-relaxed">{scene.prompt}</p>

          {!feedback ? (
            <div className="space-y-2">
              {scene.choices.map((choice) => (
                <button
                  key={choice.label}
                  type="button"
                  onClick={() => choose(choice)}
                  className="w-full text-left rounded-xl border-2 border-gray-200 px-4 py-3 font-body text-sm hover:border-navy/40 hover:bg-cream transition-colors"
                >
                  {choice.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="font-body text-sm text-navy/80 bg-sunshine/20 rounded-xl px-3 py-3">💡 {feedback}</p>
              <button
                type="button"
                onClick={next}
                className="w-full bg-navy text-white font-heading font-bold py-2.5 rounded-xl"
              >
                {sceneIndex >= SCENES.length - 1 ? 'Finish the day' : 'Continue'}
              </button>
            </div>
          )}
        </div>
      )}
    </GameShell>
  );
}
