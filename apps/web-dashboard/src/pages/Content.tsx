import { MISSIONS, QUIZZES, LOCATIONS, CHARACTERS } from '@heritage/shared';

export default function Content() {
  return (
    <div>
      <h1 className="font-heading font-extrabold text-3xl text-navy mb-2">Content</h1>
      <p className="text-navy/60 font-body mb-2">View seeded mission content (read-only in MVP)</p>
      <p className="text-xs text-navy/40 font-body mb-8">Content editing will be available in a future release</p>

      {LOCATIONS.map((loc) => {
        const character = CHARACTERS.find((c) => c.id === loc.characterId);
        const missions = MISSIONS.filter((m) => m.locationId === loc.id);
        return (
          <div key={loc.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{loc.emoji}</span>
              <div>
                <h2 className="font-heading font-bold text-xl text-navy">{loc.name}</h2>
                <p className="text-sm text-navy/50 font-body">Character: {character?.name}</p>
              </div>
            </div>
            <div className="space-y-3">
              {missions.map((m) => {
                const quiz = QUIZZES.find((q) => q.id === m.quizId);
                return (
                  <div key={m.id} className="p-4 bg-cream rounded-xl">
                    <p className="font-heading font-bold text-navy">{m.title}</p>
                    <p className="text-sm text-navy/60 font-body mt-1">{m.story}</p>
                    <div className="flex gap-4 mt-2 text-xs text-navy/40 font-body">
                      <span>+{m.xpReward} XP</span>
                      <span>{quiz?.questions.length ?? 0} quiz questions</span>
                      <span>QR: {m.unlockQrCode.slice(0, 40)}...</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
