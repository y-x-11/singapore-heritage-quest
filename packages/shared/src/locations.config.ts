/**
 * ═══════════════════════════════════════════════════════════════════
 *  HERITAGE LOCATIONS CONFIG — edit this file to update the website
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Images: add files to apps/web-dashboard/public/locations/
 *          then reference them as "locations/your-image.jpg"
 *
 *  Or use full URLs (https://...) for external images.
 *
 *  QR codes on the website link to: /explore/location/<id>
 */

import type { LocationGuide } from './types';

export const LOCATION_GUIDES: LocationGuide[] = [
  {
    id: 'chinatown',
    name: 'Chinatown',
    district: 'Outram',
    emoji: '🏮',
    color: '#E63946',
    characterId: 'coolie',
    lat: 1.2834,
    lng: 103.8444,
    radiusMeters: 150,
    tagline: 'Temple streets & migrant stories',
    shortDescription:
      'Explore temple streets, shophouses, and the stories of early Chinese migrants who shaped Singapore.',
    overview:
      'Chinatown is one of Singapore\'s oldest districts, where Chinese immigrants arrived in the 1800s seeking work and a new life. Shophouses line narrow streets, temples anchor the community, and festivals like Chinese New Year still fill the air with drums and red lanterns. Walk Smith Street, visit the Buddha Tooth Relic Temple, and imagine the coolies who carried goods through these same alleys.',
    heroImage: 'locations/chinatown.svg',
    gallery: ['locations/chinatown.svg', 'locations/chinatown-2.svg'],
    highlights: [
      {
        icon: '🏠',
        title: 'Shophouse Living',
        description: 'Migrants lived in cramped shophouses — shops below, families above — forming tight-knit clan communities.',
      },
      {
        icon: '🙏',
        title: 'Temples & Faith',
        description: 'Buddhist and Taoist temples were centres of worship, festivals, and mutual aid for the Chinese community.',
      },
      {
        icon: '🦁',
        title: 'Lion Dance Traditions',
        description: 'Lion dance troupes performed during festivals to welcome prosperity and ward off bad luck.',
      },
    ],
    funFacts: [
      'Chinatown was one of the first areas Sir Stamford Raffles allocated to the Chinese community in 1819.',
      'Smith Street is famous for its hawker stalls and night market atmosphere.',
      'The Buddha Tooth Relic Temple houses a sacred relic and stunning rooftop garden.',
    ],
    visitTips: [
      'Best visited in the evening when lanterns light up the streets.',
      'Try local snacks along Smith Street and Temple Street.',
      'Look up at the ornate shophouse facades — each tells a story.',
    ],
    game: {
      type: 'catch',
      title: 'Dish Dash!',
      instructions: 'Move Ah Beng left and right to catch falling Chinese dishes in his mouth! Use arrow keys, mouse, or touch.',
      catcherName: 'Ah Beng',
      catcherEmoji: '👷',
      items: ['🥟', '🍜', '🥮', '🍚', '🥡', '🍵', '🥢'],
      winScore: 12,
      winMessage: 'Shiok! You caught enough dishes to feed the whole clan association!',
    },
  },
  {
    id: 'little-india',
    name: 'Little India',
    district: 'Rochor',
    emoji: '🪔',
    color: '#9B5DE5',
    characterId: 'hawker',
    lat: 1.3064,
    lng: 103.851,
    radiusMeters: 150,
    tagline: 'Spices, sounds & shared food',
    shortDescription:
      'Discover spice markets, colourful murals, and the vibrant food culture of the Indian community.',
    overview:
      'Little India pulses with colour, fragrance, and flavour. Indian immigrants brought spices, traditions, and recipes that became part of Singapore\'s identity. Serangoon Road is the main artery — spice shops spill onto sidewalks, saree stores shimmer, and hawkers flip roti prata at all hours. During Deepavali, the entire district transforms into a Festival of Lights.',
    heroImage: 'locations/little-india.svg',
    gallery: ['locations/little-india.svg', 'locations/little-india-2.svg'],
    highlights: [
      {
        icon: '🌶️',
        title: 'Spice Trade',
        description: 'Indian traders imported cardamom, turmeric, and chilli — flavours that define local cuisine today.',
      },
      {
        icon: '🍛',
        title: 'Hawker Heritage',
        description: 'Roti prata, biryani, and teh tarik were sold from stalls serving workers and families alike.',
      },
      {
        icon: '🪔',
        title: 'Deepavali Lights',
        description: 'The Festival of Lights brings dazzling decorations, kolam art, and community celebrations.',
      },
    ],
    funFacts: [
      'Serangoon Road was named after a nutmeg plantation that once stood nearby.',
      'Tekka Market is one of Singapore\'s busiest wet markets.',
      'Little India Arcade sells everything from spices to henna art.',
    ],
    visitTips: [
      'Visit during Deepavali (Oct–Nov) for spectacular light displays.',
      'Morning is best for fresh spices and market bustle.',
      'Don\'t miss a plate of roti prata with curry on Serangoon Road.',
    ],
    game: {
      type: 'catch',
      title: 'Prata Flip Catch!',
      instructions: 'Help Muthu the hawker catch flying roti prata and spices! Move with arrow keys, mouse, or touch.',
      catcherName: 'Muthu',
      catcherEmoji: '🍛',
      items: ['🫓', '🌶️', '🍛', '☕', '🥥', '🧄', '🫚'],
      winScore: 12,
      winMessage: 'Wah lau! Muthu\'s stall is ready — the best prata on Serangoon Road!',
    },
  },
  {
    id: 'kampong-glam',
    name: 'Kampong Glam',
    district: 'Bugis',
    emoji: '🕌',
    color: '#2A9D8F',
    characterId: 'kampong-boy',
    lat: 1.302,
    lng: 103.859,
    radiusMeters: 150,
    tagline: 'Kampong spirit & Malay-Arab heritage',
    shortDescription:
      'Walk through the Malay-Arab quarter, Sultan Mosque, and memories of traditional kampong life.',
    overview:
      'Kampong Glam was the historic seat of Malay royalty and a thriving Arab trading quarter. Before HDB flats, kampong villages dotted the landscape — neighbours shared food, flew wau kites, and looked out for one another. Today, the golden dome of Sultan Mosque still anchors the community, while Arab Street shops sell batik, perfumes, and textiles.',
    heroImage: 'locations/kampong-glam.svg',
    gallery: ['locations/kampong-glam.svg', 'locations/kampong-glam-2.svg'],
    highlights: [
      {
        icon: '🏡',
        title: 'Kampong Life',
        description: 'Wooden kampong houses on stilts housed families who lived by gotong royong — community cooperation.',
      },
      {
        icon: '🕌',
        title: 'Sultan Mosque',
        description: 'The golden-domed mosque is the heart of the Muslim community and a national landmark.',
      },
      {
        icon: '🧣',
        title: 'Arab Street Traders',
        description: 'Arab merchants sold batik, perfumes, and textiles along these historic shop rows.',
      },
    ],
    funFacts: [
      'Kampong Glam was reserved for the Malay community by Sir Stamford Raffles in 1819.',
      'The Malay Heritage Centre is housed in a former royal palace (Istana Kampong Gelam).',
      'Haji Lane is famous for street art and indie boutiques.',
    ],
    visitTips: [
      'Dress modestly when visiting the mosque (robes provided at entrance).',
      'Explore Haji Lane and Arab Street for unique crafts and cafés.',
      'Visit the Malay Heritage Centre for deeper history.',
    ],
    game: {
      type: 'catch',
      title: 'Wau Kite Catch!',
      instructions: 'Help Razak catch wau kites drifting on the kampong breeze! Move with arrow keys, mouse, or touch.',
      catcherName: 'Razak',
      catcherEmoji: '🪁',
      items: ['🪁', '🎐', '🏠', '🌴', '⚽', '🪶', '🌺'],
      winScore: 12,
      winMessage: 'Bagus! The kampong kids cheer — you kept every kite flying high!',
    },
  },
];
