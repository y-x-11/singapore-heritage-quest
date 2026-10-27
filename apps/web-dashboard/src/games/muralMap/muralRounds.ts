import { publicAssetUrl } from '../../lib/site';

export type MuralZoneId =
  | 'haji-lane'
  | 'arab-street'
  | 'bussorah-street'
  | 'baghdad-street'
  | 'sultan-mosque'
  | 'malay-heritage';

export interface MuralZone {
  id: MuralZoneId;
  label: string;
  mapLabel: string;
}

export const MURAL_ZONES: MuralZone[] = [
  { id: 'haji-lane', label: 'Haji Lane', mapLabel: 'Haji Lane' },
  { id: 'arab-street', label: 'Arab Street', mapLabel: 'Arab St' },
  { id: 'bussorah-street', label: 'Bussorah Street', mapLabel: 'Bussorah' },
  { id: 'baghdad-street', label: 'Baghdad Street', mapLabel: 'Baghdad' },
  { id: 'sultan-mosque', label: 'Sultan Mosque / North Bridge', mapLabel: 'Mosque' },
  { id: 'malay-heritage', label: 'Malay Heritage Centre', mapLabel: 'MHC / Istana' },
];

export interface MuralRound {
  id: string;
  cropSrc: string;
  hintSrc: string;
  fullSrc: string;
  correctZone: MuralZoneId;
  muralTitle: string;
  fact: string;
  wrongHints: Partial<Record<MuralZoneId, string>>;
}

const asset = (path: string) => publicAssetUrl(path);

/** Swap SVG/JPG paths when real mural photos are ready. */
export const MURAL_ROUNDS: MuralRound[] = [
  {
    id: 'round-haji',
    cropSrc: asset('games/kampong-glam/murals/mural-haji-crop.svg'),
    hintSrc: asset('games/kampong-glam/murals/mural-haji-full.svg'),
    fullSrc: asset('games/kampong-glam/murals/mural-haji-full.svg'),
    correctZone: 'haji-lane',
    muralTitle: 'Back-lane colour (placeholder)',
    fact:
      'Haji Lane became famous for indie boutiques and street art layered onto old shophouse walls — a newer chapter on top of kampong-era streets.',
    wrongHints: {
      'arab-street':
        'Pak Cik Aziz: That bright alley vibe is Haji Lane — Arab Street shutters still show batik and perfume trade motifs, not this layout.',
      'sultan-mosque':
        'Auntie Zara: The mosque quarter is quieter and more formal. This crop is from the café-and-mural back lanes.',
    },
  },
  {
    id: 'round-arab',
    cropSrc: asset('games/kampong-glam/murals/mural-arab-crop.svg'),
    hintSrc: asset('games/kampong-glam/murals/mural-arab-full.svg'),
    fullSrc: asset('games/kampong-glam/murals/mural-arab-full.svg'),
    correctZone: 'arab-street',
    muralTitle: 'Trader shutter art (placeholder)',
    fact:
      'Arab Street long sold batik, textiles, and attar. Murals and painted shutters often nod to that trading heritage.',
    wrongHints: {
      'haji-lane':
        'Pak Cik Aziz: Close on the colours — but this calligraphy-and-gold pattern faces the main trader row, not Haji’s hip back lane.',
      'baghdad-street':
        'Auntie Zara: Baghdad has shophouse rows too, yet this motif matches the Arab Street textile shops you still walk past today.',
    },
  },
  {
    id: 'round-bussorah',
    cropSrc: asset('games/kampong-glam/murals/mural-bussorah-crop.svg'),
    hintSrc: asset('games/kampong-glam/murals/mural-bussorah-full.svg'),
    fullSrc: asset('games/kampong-glam/murals/mural-bussorah-full.svg'),
    correctZone: 'bussorah-street',
    muralTitle: 'Community wall (placeholder)',
    fact:
      'Bussorah Street sits near the mosque — a pedestrian strip where community events and family-friendly art often appear.',
    wrongHints: {
      'sultan-mosque':
        'Pak Cik Aziz: You are near the golden dome, but this mural sits on Bussorah’s walking street, not on the mosque façade itself.',
      'malay-heritage':
        'Auntie Zara: The Heritage Centre tells royal kampong stories indoors — this outdoor wall is a short walk toward Bussorah.',
    },
  },
  {
    id: 'round-baghdad',
    cropSrc: asset('games/kampong-glam/murals/mural-baghdad-crop.svg'),
    hintSrc: asset('games/kampong-glam/murals/mural-baghdad-full.svg'),
    fullSrc: asset('games/kampong-glam/murals/mural-baghdad-full.svg'),
    correctZone: 'baghdad-street',
    muralTitle: 'Shophouse gable (placeholder)',
    fact:
      'Baghdad Street’s restored shophouses show how Kampong Glam kept its street grid while buildings were upgraded around the mosque.',
    wrongHints: {
      'haji-lane':
        'Pak Cik Aziz: Haji’s art is louder and narrower — this crop is the taller gable line you see along Baghdad.',
      'arab-street':
        'Auntie Zara: Arab Street runs parallel with different shopfront rhythm. Look for Baghdad’s row of pastel shophouses.',
    },
  },
  {
    id: 'round-mhc',
    cropSrc: asset('games/kampong-glam/murals/mural-mhc-crop.svg'),
    hintSrc: asset('games/kampong-glam/murals/mural-mhc-full.svg'),
    fullSrc: asset('games/kampong-glam/murals/mural-mhc-full.svg'),
    correctZone: 'malay-heritage',
    muralTitle: 'Kampong memory wall (placeholder)',
    fact:
      'The Malay Heritage Centre occupies Istana Kampong Gelam — a former palace where exhibits connect visitors to village life before HDB redevelopment.',
    wrongHints: {
      'sultan-mosque':
        'Pak Cik Aziz: The mosque is the spiritual heart; this kampong-memory art sits at the heritage centre grounds nearby.',
      'bussorah-street':
        'Auntie Zara: Bussorah is between mosque and shops — this story wall belongs to the istana / MHC zone.',
    },
  },
];
