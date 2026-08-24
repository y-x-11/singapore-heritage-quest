import type { HeritageGameConfig } from '@heritage/shared';
import TcmSortGame from './TcmSortGame';
import ShophouseDayGame from './ShophouseDayGame';
import TehTarikGame from './TehTarikGame';
import KolamGame from './KolamGame';
import SongketGame from './SongketGame';
import TailorGame from './TailorGame';

interface LocationGameProps {
  config: HeritageGameConfig;
  accentColor: string;
}

export default function LocationGame({ config, accentColor }: LocationGameProps) {
  switch (config.type) {
    case 'tcm-sort':
      return <TcmSortGame config={config} accentColor={accentColor} />;
    case 'shophouse-day':
      return <ShophouseDayGame config={config} accentColor={accentColor} />;
    case 'teh-tarik':
      return <TehTarikGame config={config} accentColor={accentColor} />;
    case 'kolam':
      return <KolamGame config={config} accentColor={accentColor} />;
    case 'songket':
      return <SongketGame config={config} accentColor={accentColor} />;
    case 'tailor':
      return <TailorGame config={config} accentColor={accentColor} />;
    default:
      return null;
  }
}
