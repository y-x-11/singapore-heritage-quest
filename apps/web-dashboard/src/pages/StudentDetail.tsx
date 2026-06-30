import { useParams, Link } from 'react-router-dom';
import { MISSIONS, LOCATIONS, BADGES } from '@heritage/shared';

const STUDENT_DATA: Record<string, { name: string; xp: number; badges: string[]; missions: { id: string; status: string; score?: number }[] }> = {
  '1': { name: 'Aisha K.', xp: 320, badges: ['badge-chinatown', 'badge-explorer'], missions: [
    { id: 'mission-chinatown-01', status: 'completed', score: 100 },
    { id: 'mission-chinatown-02', status: 'completed', score: 80 },
    { id: 'mission-little-india-01', status: 'completed', score: 100 },
    { id: 'mission-little-india-02', status: 'completed', score: 60 },
    { id: 'mission-kampong-glam-01', status: 'completed', score: 80 },
  ]},
  '2': { name: 'Marcus T.', xp: 275, badges: ['badge-little-india'], missions: [
    { id: 'mission-little-india-01', status: 'completed', score: 100 },
    { id: 'mission-little-india-02', status: 'completed', score: 80 },
    { id: 'mission-kampong-glam-01', status: 'completed', score: 60 },
    { id: 'mission-chinatown-01', status: 'unlocked' },
  ]},
};

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const student = STUDENT_DATA[id ?? '1'] ?? STUDENT_DATA['1'];

  return (
    <div>
      <Link to="/students" className="text-teal font-body font-semibold text-sm hover:underline">← Back to Students</Link>
      <h1 className="font-heading font-extrabold text-3xl text-navy mt-4 mb-2">{student.name}</h1>
      <p className="text-navy/60 font-body mb-8">{student.xp} XP total</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-heading font-bold text-lg text-navy mb-4">Mission Timeline</h2>
          <div className="space-y-3">
            {student.missions.map((m) => {
              const mission = MISSIONS.find((ms) => ms.id === m.id);
              const loc = LOCATIONS.find((l) => l.id === mission?.locationId);
              return (
                <div key={m.id} className="flex items-center gap-3 p-3 bg-cream rounded-xl">
                  <span className="text-xl">{loc?.emoji}</span>
                  <div className="flex-1">
                    <p className="font-body font-semibold text-navy text-sm">{mission?.title}</p>
                    <p className="text-xs text-navy/50">{loc?.name}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                    m.status === 'completed' ? 'bg-teal/20 text-teal' : 'bg-sunshine/30 text-navy'
                  }`}>
                    {m.status === 'completed' ? `${m.score}%` : m.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-heading font-bold text-lg text-navy mb-4">Badges Earned</h2>
          <div className="grid grid-cols-2 gap-3">
            {student.badges.map((badgeId) => {
              const badge = BADGES.find((b) => b.id === badgeId);
              return badge ? (
                <div key={badgeId} className="text-center p-4 bg-cream rounded-xl">
                  <div className="text-3xl mb-1">{badge.emoji}</div>
                  <p className="font-heading font-bold text-sm text-navy">{badge.name}</p>
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
