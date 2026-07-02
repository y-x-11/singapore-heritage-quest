import type { LocationGameConfig } from '@heritage/shared';
import CatchHeritageGame from './CatchHeritageGame';

interface LocationGameProps {
  config: LocationGameConfig;
  accentColor: string;
  locationName: string;
}

export default function LocationGame({ config, accentColor, locationName }: LocationGameProps) {
  if (config.type === 'catch') {
    return (
      <section className="mt-6 bg-white rounded-3xl p-5 shadow-sm border-2 border-dashed" style={{ borderColor: accentColor }}>
        <div className="text-center mb-4">
          <h2 className="font-heading font-extrabold text-xl text-navy">🎮 Heritage Mini-Game</h2>
          <p className="font-body text-navy/50 text-sm mt-1">Play a {locationName} challenge!</p>
        </div>
        <CatchHeritageGame config={config} accentColor={accentColor} />
      </section>
    );
  }

  return null;
}
