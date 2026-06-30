import type { Badge, Character, Collectible, Location, Mission, Quiz } from './types';
import { formatQrPayload } from './constants';
import { LOCATIONS_FROM_CONFIG } from './locationUtils';

export const LOCATIONS: Location[] = LOCATIONS_FROM_CONFIG;

export const CHARACTERS: Character[] = [
  {
    id: 'coolie',
    name: 'Ah Beng the Coolie',
    title: 'Chinatown Labourer',
    locationId: 'chinatown',
    introLine: "Gong xi! I'm Ah Beng. Let me show you how early migrants built Singapore with sweat and hope!",
    emoji: '👷',
    color: '#E63946',
  },
  {
    id: 'hawker',
    name: 'Muthu the Hawker',
    title: 'Little India Food Seller',
    locationId: 'little-india',
    introLine: "Vanakkam! I'm Muthu. The aromas of spices and sizzling pans tell stories of our shared food heritage!",
    emoji: '🍛',
    color: '#9B5DE5',
  },
  {
    id: 'kampong-boy',
    name: 'Razak the Kampong Boy',
    title: 'Kampong Glam Youth',
    locationId: 'kampong-glam',
    introLine: "Assalamualaikum! I'm Razak. Before the tall buildings, we lived in kampongs full of community spirit!",
    emoji: '🪁',
    color: '#2A9D8F',
  },
];

export const BADGES: Badge[] = [
  { id: 'badge-chinatown', name: 'Temple Guardian', description: 'Completed all Chinatown missions', locationId: 'chinatown', emoji: '🏮', color: '#E63946' },
  { id: 'badge-little-india', name: 'Spice Master', description: 'Completed all Little India missions', locationId: 'little-india', emoji: '🪔', color: '#9B5DE5' },
  { id: 'badge-kampong-glam', name: 'Kampong Hero', description: 'Completed all Kampong Glam missions', locationId: 'kampong-glam', emoji: '🕌', color: '#2A9D8F' },
  { id: 'badge-explorer', name: 'Heritage Explorer', description: 'Discovered all three heritage zones', locationId: 'all', emoji: '🗺️', color: '#FFD166' },
  { id: 'badge-quiz-master', name: 'Quiz Master', description: 'Scored 100% on any heritage quiz', locationId: 'all', emoji: '🧠', color: '#F4A261' },
  { id: 'badge-streak-7', name: '7-Day Streak', description: 'Maintained a 7-day learning streak', locationId: 'all', emoji: '🔥', color: '#EF476F' },
];

export const COLLECTIBLES: Collectible[] = [
  { id: 'joss-stick', name: 'Joss Stick', description: 'Used in temple offerings at Chinatown', locationId: 'chinatown', emoji: '🧧', rarity: 'common' },
  { id: 'opium-pipe-replica', name: 'Opium Pipe Replica', description: 'A reminder of colonial-era trade', locationId: 'chinatown', emoji: '🏺', rarity: 'rare' },
  { id: 'lion-dance-mask', name: 'Lion Dance Mask', description: 'Worn during Chinese New Year celebrations', locationId: 'chinatown', emoji: '🦁', rarity: 'legendary' },
  { id: 'roti-prata-card', name: 'Roti Prata Recipe Card', description: 'Secret recipe from a famous hawker', locationId: 'little-india', emoji: '🫓', rarity: 'common' },
  { id: 'spice-box', name: 'Spice Box', description: 'Cardamom, cumin, and turmeric from Serangoon Road', locationId: 'little-india', emoji: '🌶️', rarity: 'rare' },
  { id: 'kolam-pattern', name: 'Kolam Pattern', description: 'Rangoli art drawn during Deepavali', locationId: 'little-india', emoji: '🎨', rarity: 'legendary' },
  { id: 'kampong-wau', name: 'Kampong Wau', description: 'Traditional Malay kite from village days', locationId: 'kampong-glam', emoji: '🪁', rarity: 'common' },
  { id: 'batik-cloth', name: 'Batik Cloth', description: 'Hand-dyed fabric from Arab Street traders', locationId: 'kampong-glam', emoji: '🧣', rarity: 'rare' },
  { id: 'sultan-coin', name: 'Sultan Coin', description: 'Replica coin from the Malay royalty era', locationId: 'kampong-glam', emoji: '🪙', rarity: 'legendary' },
];

function makeMission(
  id: string,
  locationId: string,
  characterId: string,
  title: string,
  story: string,
  storyPanels: { text: string; emoji: string }[],
  xpReward: number,
  unlockToken: string,
  quizId: string,
  badgeId: string,
  collectibleIds: string[],
  order: number
): Mission {
  return {
    id,
    locationId,
    characterId,
    title,
    story,
    storyPanels,
    xpReward,
    unlockQrCode: formatQrPayload(locationId, id, unlockToken),
    quizId,
    badgeId,
    collectibleIds,
    order,
  };
}

export const MISSIONS: Mission[] = [
  makeMission(
    'mission-chinatown-01',
    'chinatown',
    'coolie',
    'The Coolie\'s Burden',
    'Ah Beng carries heavy sacks at the docks, dreaming of a better life for his family back in China.',
    [
      { text: 'In the 1800s, coolies were migrant labourers who carried goods on their shoulders through Singapore\'s bustling ports.', emoji: '⚓' },
      { text: 'They lived in cramped shophouse quarters along Smith Street and Temple Street.', emoji: '🏠' },
      { text: 'Despite hardship, they built temples and clan associations to support each other.', emoji: '🙏' },
    ],
    50,
    'coolie01',
    'quiz-chinatown-01',
    'badge-chinatown',
    ['joss-stick'],
    1
  ),
  makeMission(
    'mission-chinatown-02',
    'chinatown',
    'coolie',
    'Temple Street Tales',
    'Follow Ah Beng to the Buddha Tooth Relic Temple and learn about faith and community.',
    [
      { text: 'Chinatown\'s temples were centres of worship and social gathering for the Chinese community.', emoji: '🏮' },
      { text: 'Festivals like Chinese New Year brought lion dances and red lanterns to every corner.', emoji: '🦁' },
      { text: 'Today, these traditions still light up Chinatown every year!', emoji: '✨' },
    ],
    75,
    'coolie02',
    'quiz-chinatown-02',
    'badge-chinatown',
    ['opium-pipe-replica'],
    2
  ),
  makeMission(
    'mission-chinatown-03',
    'chinatown',
    'coolie',
    'Lion Dance Legacy',
    'Join the lion dance troupe and discover how coolies preserved their culture through performance.',
    [
      { text: 'Lion dances were performed to ward off evil spirits and welcome prosperity.', emoji: '🥁' },
      { text: 'Coolie kinsmen formed troupes that practised in back alleys after long work days.', emoji: '💪' },
      { text: 'The thunder of drums still echoes through Chinatown during every festival!', emoji: '🎊' },
    ],
    100,
    'coolie03',
    'quiz-chinatown-03',
    'badge-chinatown',
    ['lion-dance-mask'],
    3
  ),
  makeMission(
    'mission-little-india-01',
    'little-india',
    'hawker',
    'The Hawker\'s Stall',
    'Muthu sets up his prata stall at dawn, flipping dough while sharing stories of Indian migration.',
    [
      { text: 'Indian immigrants arrived in the 1800s, many working on rubber plantations and in the army.', emoji: '🌴' },
      { text: 'Hawker stalls along Serangoon Road served affordable meals to workers and families.', emoji: '🍛' },
      { text: 'Roti prata, biryani, and teh tarik became beloved by all Singaporeans!', emoji: '☕' },
    ],
    50,
    'hawker01',
    'quiz-little-india-01',
    'badge-little-india',
    ['roti-prata-card'],
    1
  ),
  makeMission(
    'mission-little-india-02',
    'little-india',
    'hawker',
    'Spice Road Secrets',
    'Explore the spice shops and learn how trade routes connected India to Singapore.',
    [
      { text: 'Little India\'s spice shops imported cardamom, turmeric, and chilli from South India.', emoji: '🌶️' },
      { text: 'Traders on Arab Street and Serangoon Road supplied spices to homes and restaurants island-wide.', emoji: '🛒' },
      { text: 'The fragrance of spices still fills the air when you walk down these streets!', emoji: '👃' },
    ],
    75,
    'hawker02',
    'quiz-little-india-02',
    'badge-little-india',
    ['spice-box'],
    2
  ),
  makeMission(
    'mission-little-india-03',
    'little-india',
    'hawker',
    'Deepavali Lights',
    'Help Muthu decorate his stall for Deepavali and learn about the Festival of Lights.',
    [
      { text: 'Deepavali celebrates the victory of light over darkness in Hindu tradition.', emoji: '🪔' },
      { text: 'Families draw colourful kolam patterns outside their homes using rice flour.', emoji: '🎨' },
      { text: 'Little India transforms into a dazzling wonderland of lights every October or November!', emoji: '✨' },
    ],
    100,
    'hawker03',
    'quiz-little-india-03',
    'badge-little-india',
    ['kolam-pattern'],
    3
  ),
  makeMission(
    'mission-kampong-glam-01',
    'kampong-glam',
    'kampong-boy',
    'Life in the Kampong',
    'Razak invites you to his wooden kampong house and shares memories of village life.',
    [
      { text: 'Before HDB flats, many Malay families lived in kampongs — traditional villages with wooden houses.', emoji: '🏡' },
      { text: 'Children flew wau kites and played gasing (spinning tops) in open fields.', emoji: '🪁' },
      { text: 'Neighbours shared food and helped raise each other\'s children — true kampong spirit!', emoji: '🤝' },
    ],
    50,
    'kampong01',
    'quiz-kampong-glam-01',
    'badge-kampong-glam',
    ['kampong-wau'],
    1
  ),
  makeMission(
    'mission-kampong-glam-02',
    'kampong-glam',
    'kampong-boy',
    'Sultan\'s Domain',
    'Visit the Sultan Mosque and learn about Malay royalty and the Kampong Glam heritage.',
    [
      { text: 'Kampong Glam was allocated to the Malay community by Sir Stamford Raffles in 1819.', emoji: '📜' },
      { text: 'The Sultan Mosque, with its golden dome, is the heart of the Muslim community here.', emoji: '🕌' },
      { text: 'Arab traders brought batik, perfumes, and textiles to the shops along Arab Street.', emoji: '🧣' },
    ],
    75,
    'kampong02',
    'quiz-kampong-glam-02',
    'badge-kampong-glam',
    ['batik-cloth'],
    2
  ),
  makeMission(
    'mission-kampong-glam-03',
    'kampong-glam',
    'kampong-boy',
    'The Last Kampong',
    'Discover how urbanisation changed kampong life and why we preserve these memories.',
    [
      { text: 'By the 1980s, most kampongs were cleared to make way for modern housing.', emoji: '🏗️' },
      { text: 'Former kampong residents still gather to share stories and maintain their bonds.', emoji: '💬' },
      { text: 'Heritage trails in Kampong Glam keep the spirit of the old village alive for new generations!', emoji: '🌟' },
    ],
    100,
    'kampong03',
    'quiz-kampong-glam-03',
    'badge-kampong-glam',
    ['sultan-coin'],
    3
  ),
];

export const QUIZZES: Quiz[] = [
  {
    id: 'quiz-chinatown-01',
    missionId: 'mission-chinatown-01',
    title: 'Coolie Knowledge Check',
    questions: [
      { id: 'q1', question: 'What was a coolie\'s main job in early Singapore?', options: ['Carrying heavy goods', 'Teaching school', 'Building ships', 'Farming rice'], correctIndex: 0, explanation: 'Coolies were manual labourers who carried goods at ports and markets.' },
      { id: 'q2', question: 'Where did many Chinese migrants live in Chinatown?', options: ['HDB flats', 'Shophouses', 'Mansions', 'Tents'], correctIndex: 1, explanation: 'Cramped shophouse quarters housed many migrant workers.' },
      { id: 'q3', question: 'What did clan associations provide?', options: ['Free food only', 'Community support', 'Government jobs', 'Ship tickets'], correctIndex: 1, explanation: 'Clan associations helped migrants with housing, jobs, and welfare.' },
      { id: 'q4', question: 'Which festival features lion dances in Chinatown?', options: ['Deepavali', 'Hari Raya', 'Chinese New Year', 'Christmas'], correctIndex: 2, explanation: 'Lion dances are a highlight of Chinese New Year celebrations.' },
      { id: 'q5', question: 'Coolies mainly came from which country?', options: ['India', 'China', 'Malaysia', 'Indonesia'], correctIndex: 1, explanation: 'Most coolies were Chinese migrants seeking work in colonial Singapore.' },
    ],
  },
  {
    id: 'quiz-chinatown-02',
    missionId: 'mission-chinatown-02',
    title: 'Temple Street Quiz',
    questions: [
      { id: 'q1', question: 'Temples in Chinatown served as what?', options: ['Only places of worship', 'Worship and social centres', 'Schools only', 'Markets'], correctIndex: 1, explanation: 'Temples were both spiritual and social gathering places.' },
      { id: 'q2', question: 'What colour dominates Chinese New Year decorations?', options: ['Blue', 'Green', 'Red', 'Purple'], correctIndex: 2, explanation: 'Red symbolises luck and prosperity in Chinese culture.' },
      { id: 'q3', question: 'Lion dances are meant to ward off what?', options: ['Rain', 'Evil spirits', 'Heat', 'Insects'], correctIndex: 1, explanation: 'The lion dance traditionally scares away bad luck and evil spirits.' },
      { id: 'q4', question: 'Smith Street is famous for what?', options: ['Food stalls', 'Car dealerships', 'Bookshops', 'Gyms'], correctIndex: 0, explanation: 'Smith Street is a popular food street in Chinatown.' },
      { id: 'q5', question: 'The Buddha Tooth Relic Temple is located in which area?', options: ['Little India', 'Chinatown', 'Orchard', 'Jurong'], correctIndex: 1, explanation: 'This famous temple is in the heart of Chinatown.' },
    ],
  },
  {
    id: 'quiz-chinatown-03',
    missionId: 'mission-chinatown-03',
    title: 'Lion Dance Challenge',
    questions: [
      { id: 'q1', question: 'What instrument drives the lion dance rhythm?', options: ['Piano', 'Drums', 'Flute', 'Guitar'], correctIndex: 1, explanation: 'Drums, gongs, and cymbals accompany lion dance performances.' },
      { id: 'q2', question: 'Who typically performed lion dances?', options: ['Colonial officers', 'Coolie community groups', 'British soldiers', 'Tourists'], correctIndex: 1, explanation: 'Coolie kinsmen formed cultural troupes to preserve traditions.' },
      { id: 'q3', question: 'Lion dances welcome what?', options: ['Bad weather', 'Prosperity', 'Silence', 'Winter'], correctIndex: 1, explanation: 'The dance welcomes good fortune and prosperity.' },
      { id: 'q4', question: 'How many people typically operate one lion costume?', options: ['One', 'Two', 'Five', 'Ten'], correctIndex: 1, explanation: 'Two performers — one for the head, one for the body.' },
      { id: 'q5', question: 'Lion dances are performed during which occasion?', options: ['Funerals', 'Festivals', 'Elections', 'Sports events'], correctIndex: 1, explanation: 'Lion dances are a festive tradition at celebrations and festivals.' },
    ],
  },
  {
    id: 'quiz-little-india-01',
    missionId: 'mission-little-india-01',
    title: 'Hawker Heritage Quiz',
    questions: [
      { id: 'q1', question: 'Roti prata originated from which culinary tradition?', options: ['Chinese', 'Indian', 'Malay', 'Japanese'], correctIndex: 1, explanation: 'Roti prata has Indian roots and became a Singapore favourite.' },
      { id: 'q2', question: 'What is teh tarik?', options: ['Pulled tea', 'Fried rice', 'Spicy curry', 'Sweet bread'], correctIndex: 0, explanation: 'Teh tarik means "pulled tea" — aerated by pouring between cups.' },
      { id: 'q3', question: 'Serangoon Road is the main street of which district?', options: ['Chinatown', 'Little India', 'Kampong Glam', 'Marina Bay'], correctIndex: 1, explanation: 'Serangoon Road runs through the heart of Little India.' },
      { id: 'q4', question: 'Hawker stalls mainly served whom?', options: ['Only tourists', 'Workers and families', 'Only royalty', 'Only children'], correctIndex: 1, explanation: 'Hawkers provided affordable meals for everyday Singaporeans.' },
      { id: 'q5', question: 'Many Indian immigrants worked on what plantations?', options: ['Tea', 'Rubber', 'Coffee', 'Cotton'], correctIndex: 1, explanation: 'Rubber plantations employed many Indian labourers.' },
    ],
  },
  {
    id: 'quiz-little-india-02',
    missionId: 'mission-little-india-02',
    title: 'Spice Road Quiz',
    questions: [
      { id: 'q1', question: 'Which spice is NOT commonly sold in Little India?', options: ['Turmeric', 'Cardamom', 'Chocolate', 'Chilli'], correctIndex: 2, explanation: 'Chocolate is not a traditional spice sold in Little India shops.' },
      { id: 'q2', question: 'Spice trade connected India to Singapore via what?', options: ['Air routes', 'Sea trade routes', 'Railways', 'Telegraph'], correctIndex: 1, explanation: 'Maritime trade brought spices across the Indian Ocean.' },
      { id: 'q3', question: 'Turmeric is known for its what colour?', options: ['Red', 'Yellow', 'Blue', 'White'], correctIndex: 1, explanation: 'Turmeric is a bright yellow spice used in curries.' },
      { id: 'q4', question: 'Spice shops in Little India are called what?', options: ['Supermarkets', 'Provision shops', 'Banks', 'Hotels'], correctIndex: 1, explanation: 'Traditional provision shops sell spices and groceries.' },
      { id: 'q5', question: 'Indian traders also sold spices on which nearby street?', options: ['Orchard Road', 'Arab Street', 'Sentosa', 'East Coast'], correctIndex: 1, explanation: 'Arab Street traders also dealt in spices and textiles.' },
    ],
  },
  {
    id: 'quiz-little-india-03',
    missionId: 'mission-little-india-03',
    title: 'Deepavali Lights Quiz',
    questions: [
      { id: 'q1', question: 'Deepavali celebrates the victory of what?', options: ['Light over darkness', 'Summer over winter', 'Land over sea', 'Fire over water'], correctIndex: 0, explanation: 'Deepavali is the Festival of Lights in Hindu tradition.' },
      { id: 'q2', question: 'Kolam patterns are made using what?', options: ['Paint', 'Rice flour', 'Sand only', 'Plastic'], correctIndex: 1, explanation: 'Kolam (rangoli) patterns are traditionally drawn with rice flour.' },
      { id: 'q3', question: 'Deepavali is also known as what?', options: ['Festival of Lights', 'Festival of Kites', 'Festival of Boats', 'Festival of Flowers'], correctIndex: 0, explanation: 'Deepavali literally means "row of lights".' },
      { id: 'q4', question: 'Little India is decorated with lights during which month roughly?', options: ['January', 'October-November', 'June', 'March'], correctIndex: 1, explanation: 'Deepavali usually falls in October or November.' },
      { id: 'q5', question: 'Oil lamps used during Deepavali are called what?', options: ['Diyas', 'Lanterns', 'Candles', 'Torches'], correctIndex: 0, explanation: 'Diyas are small clay oil lamps lit during Deepavali.' },
    ],
  },
  {
    id: 'quiz-kampong-glam-01',
    missionId: 'mission-kampong-glam-01',
    title: 'Kampong Life Quiz',
    questions: [
      { id: 'q1', question: 'What is a kampong?', options: ['A tall building', 'A traditional village', 'A shopping mall', 'A train station'], correctIndex: 1, explanation: 'Kampong means village in Malay.' },
      { id: 'q2', question: 'What is a wau?', options: ['A kite', 'A boat', 'A drum', 'A hat'], correctIndex: 0, explanation: 'Wau is a traditional Malay kite.' },
      { id: 'q3', question: 'Kampong houses were typically made of what?', options: ['Steel and glass', 'Wood', 'Marble', 'Plastic'], correctIndex: 1, explanation: 'Traditional kampong houses were wooden structures on stilts.' },
      { id: 'q4', question: 'What does "kampong spirit" mean?', options: ['Competition', 'Community neighbourliness', 'Silence', 'Wealth'], correctIndex: 1, explanation: 'Kampong spirit means looking out for your neighbours.' },
      { id: 'q5', question: 'Gasing is a traditional what?', options: ['Dance', 'Spinning top game', 'Song', 'Food'], correctIndex: 1, explanation: 'Gasing is a popular Malay spinning top game.' },
    ],
  },
  {
    id: 'quiz-kampong-glam-02',
    missionId: 'mission-kampong-glam-02',
    title: 'Sultan\'s Domain Quiz',
    questions: [
      { id: 'q1', question: 'Who allocated Kampong Glam to the Malay community?', options: ['Lee Kuan Yew', 'Stamford Raffles', 'Queen Victoria', 'Sultan alone'], correctIndex: 1, explanation: 'Sir Stamford Raffles designated Kampong Glam in 1819.' },
      { id: 'q2', question: 'The Sultan Mosque is known for its what?', options: ['Red roof', 'Golden dome', 'Blue walls', 'Green garden'], correctIndex: 1, explanation: 'The mosque\'s golden dome is an iconic landmark.' },
      { id: 'q3', question: 'Arab Street is famous for selling what?', options: ['Electronics', 'Batik and textiles', 'Cars', 'Furniture'], correctIndex: 1, explanation: 'Arab Street shops sell batik, perfumes, and fabrics.' },
      { id: 'q4', question: 'Kampong Glam is in which planning area?', options: ['Jurong', 'Bugis/Rochor', 'Woodlands', 'Tampines'], correctIndex: 1, explanation: 'Kampong Glam sits in the Bugis/Rochor area.' },
      { id: 'q5', question: 'The Malay Heritage Centre is housed in a former what?', options: ['School', 'Istana (palace)', 'Hospital', 'Factory'], correctIndex: 1, explanation: 'It was once the Istana Kampong Gelam, a royal palace.' },
    ],
  },
  {
    id: 'quiz-kampong-glam-03',
    missionId: 'mission-kampong-glam-03',
    title: 'Urban Change Quiz',
    questions: [
      { id: 'q1', question: 'Most kampongs were cleared by which decade?', options: ['1920s', '1980s', '2000s', '1890s'], correctIndex: 1, explanation: 'Urban redevelopment cleared most kampongs by the 1980s.' },
      { id: 'q2', question: 'What replaced many kampongs?', options: ['HDB flats', 'Airports', 'Farms', 'Lakes'], correctIndex: 0, explanation: 'Public housing (HDB) replaced traditional villages.' },
      { id: 'q3', question: 'Why do we preserve kampong memories?', options: ['For tourism only', 'To understand our social history', 'To sell houses', 'No reason'], correctIndex: 1, explanation: 'Kampong heritage teaches us about community and identity.' },
      { id: 'q4', question: 'Heritage trails in Kampong Glam help whom?', options: ['Only historians', 'New generations learn history', 'Only tourists', 'Nobody'], correctIndex: 1, explanation: 'Trails make history accessible to students and visitors.' },
      { id: 'q5', question: 'Former kampong residents still do what?', options: ['Forget everything', 'Gather and share stories', 'Move abroad only', 'Build new kampongs'], correctIndex: 1, explanation: 'Community reunions keep kampong memories alive.' },
    ],
  },
];

export const DAILY_QUESTS = [
  { id: 'daily-scan', title: 'Scan a Heritage Card', description: 'Scan any heritage card QR code today', xpReward: 25, type: 'scan' as const },
  { id: 'daily-quiz', title: 'Quiz Champion', description: 'Complete any quiz with at least 60% score', xpReward: 30, type: 'quiz' as const },
  { id: 'daily-visit', title: 'Zone Explorer', description: 'Visit a heritage zone on the map', xpReward: 20, type: 'visit' as const },
];
