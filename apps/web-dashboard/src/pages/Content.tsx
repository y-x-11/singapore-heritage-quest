import { LOCATION_GUIDES, CHARACTERS, MISSIONS, QUIZZES } from '@heritage/shared';
import { Link } from 'react-router-dom';

export default function Content() {
  return (
    <div>
      <h1 className="font-heading font-extrabold text-3xl text-navy mb-2">Content</h1>
      <p className="text-navy/60 font-body mb-4">
        Location images &amp; text are edited in{' '}
        <code className="bg-cream px-2 py-0.5 rounded text-sm">packages/shared/src/locations.config.ts</code>
      </p>
      <a
        href={`${import.meta.env.BASE_URL}explore`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mb-8 bg-teal text-white font-heading font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-teal/90"
      >
        🗺️ Open Public Explore Page (QR codes)
      </a>

      {LOCATION_GUIDES.map((guide) => {
        const character = CHARACTERS.find((c) => c.id === guide.characterId);
        const missions = MISSIONS.filter((m) => m.locationId === guide.id);
        return (
          <div key={guide.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{guide.emoji}</span>
              <div>
                <h2 className="font-heading font-bold text-xl text-navy">{guide.name}</h2>
                <p className="text-sm text-navy/50 font-body">Character: {character?.name}</p>
              </div>
              <Link
                to={`/explore/location/${guide.id}`}
                className="ml-auto text-teal font-body text-sm font-semibold hover:underline"
              >
                Preview →
              </Link>
            </div>
            <p className="font-body text-sm text-navy/70 mb-4">{guide.overview.slice(0, 200)}…</p>
            <div className="space-y-3">
              {missions.map((m) => {
                const quiz = QUIZZES.find((q) => q.id === m.quizId);
                return (
                  <div key={m.id} className="p-4 bg-cream rounded-xl">
                    <p className="font-heading font-bold text-navy">{m.title}</p>
                    <div className="flex gap-4 mt-2 text-xs text-navy/40 font-body">
                      <span>+{m.xpReward} XP</span>
                      <span>{quiz?.questions.length ?? 0} quiz questions</span>
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
