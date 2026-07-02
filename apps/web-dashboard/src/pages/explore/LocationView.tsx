import { Link, useParams } from 'react-router-dom';
import { getLocationGuide, resolveAssetUrl, CHARACTERS } from '@heritage/shared';
import { getSiteBaseUrl } from '../../lib/site';
import LocationGame from '../../games/LocationGame';

export default function LocationView() {
  const { id } = useParams<{ id: string }>();
  const guide = id ? getLocationGuide(id) : undefined;
  const siteBase = getSiteBaseUrl();

  if (!guide) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-4">🗺️</p>
        <h1 className="font-heading font-bold text-xl text-navy">Location not found</h1>
        <Link to="/explore" className="text-teal font-body text-sm mt-4 inline-block hover:underline">
          ← Back to Explore
        </Link>
      </div>
    );
  }

  const character = CHARACTERS.find((c) => c.id === guide.characterId);
  const heroUrl = resolveAssetUrl(guide.heroImage, siteBase);

  return (
    <article>
      <Link to="/explore" className="text-teal font-body font-semibold text-sm hover:underline">
        ← All heritage sites
      </Link>

      <div className="mt-4 rounded-3xl overflow-hidden shadow-lg relative h-52">
        <img src={heroUrl} alt={guide.name} className="w-full h-full object-cover" />
        <div
          className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent"
        />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <span className="text-4xl">{guide.emoji}</span>
          <h1 className="font-heading font-extrabold text-3xl mt-1">{guide.name}</h1>
          <p className="font-body text-white/80 text-sm">{guide.district} · {guide.tagline}</p>
        </div>
      </div>

      {character && (
        <div
          className="mt-4 bg-white rounded-2xl p-4 flex items-center gap-4 border-l-4 shadow-sm"
          style={{ borderLeftColor: guide.color }}
        >
          <span className="text-4xl">{character.emoji}</span>
          <div>
            <p className="font-heading font-bold text-navy">{character.name}</p>
            <p className="font-body text-sm text-navy/60 italic">&ldquo;{character.introLine}&rdquo;</p>
          </div>
        </div>
      )}

      <section className="mt-6 bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="font-heading font-bold text-lg text-navy mb-3">About this place</h2>
        <p className="font-body text-navy/80 leading-relaxed text-sm">{guide.overview}</p>
      </section>

      <LocationGame config={guide.game} accentColor={guide.color} locationName={guide.name} />

      <section className="mt-4 grid gap-3">
        {guide.highlights.map((h) => (
          <div key={h.title} className="bg-white rounded-2xl p-4 shadow-sm flex gap-3">
            <span className="text-2xl">{h.icon}</span>
            <div>
              <h3 className="font-heading font-bold text-navy text-sm">{h.title}</h3>
              <p className="font-body text-navy/60 text-sm mt-0.5">{h.description}</p>
            </div>
          </div>
        ))}
      </section>

      {guide.gallery.length > 1 && (
        <section className="mt-6">
          <h2 className="font-heading font-bold text-lg text-navy mb-3">Gallery</h2>
          <div className="grid grid-cols-2 gap-3">
            {guide.gallery.map((img, i) => (
              <img
                key={i}
                src={resolveAssetUrl(img, siteBase)}
                alt={`${guide.name} ${i + 1}`}
                className="rounded-xl w-full h-28 object-cover shadow-sm"
              />
            ))}
          </div>
        </section>
      )}

      <section className="mt-6 bg-sunshine/20 rounded-2xl p-5">
        <h2 className="font-heading font-bold text-lg text-navy mb-3">🧠 Fun Facts</h2>
        <ul className="space-y-2">
          {guide.funFacts.map((fact, i) => (
            <li key={i} className="font-body text-sm text-navy/80 flex gap-2">
              <span className="text-gold font-bold">•</span>
              {fact}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4 bg-teal/10 rounded-2xl p-5">
        <h2 className="font-heading font-bold text-lg text-navy mb-3">📍 Visit Tips</h2>
        <ul className="space-y-2">
          {guide.visitTips.map((tip, i) => (
            <li key={i} className="font-body text-sm text-navy/80 flex gap-2">
              <span className="text-teal font-bold">{i + 1}.</span>
              {tip}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 text-center pb-8">
        <Link
          to="/explore/scan"
          className="inline-block bg-teal text-white font-heading font-bold px-6 py-3 rounded-xl"
        >
          Scan another location
        </Link>
      </div>
    </article>
  );
}
