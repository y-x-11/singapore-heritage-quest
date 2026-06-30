import { Link } from 'react-router-dom';
import { LOCATION_GUIDES, getLocationPageUrl, resolveAssetUrl } from '@heritage/shared';
import QRCodeDisplay from '../components/QRCodeDisplay';
import { getSiteBaseUrl } from '../lib/site';

export default function ExploreHome() {
  const siteBase = getSiteBaseUrl();

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="font-heading font-extrabold text-3xl text-navy mb-2">Explore Heritage Sites</h1>
        <p className="font-body text-navy/60 text-sm max-w-md mx-auto">
          Scan a location QR code to learn about Singapore&apos;s cultural heritage — or browse each site below.
        </p>
        <Link
          to="/explore/scan"
          className="inline-block mt-5 bg-teal text-white font-heading font-bold px-8 py-3 rounded-2xl shadow-lg hover:bg-teal/90 transition-colors"
        >
          📷 Scan Heritage QR Code
        </Link>
      </div>

      <div className="space-y-6">
        {LOCATION_GUIDES.map((guide) => {
          const pageUrl = getLocationPageUrl(guide.id, siteBase);
          const heroUrl = resolveAssetUrl(guide.heroImage, siteBase);

          return (
            <article
              key={guide.id}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
              style={{ borderLeftWidth: 5, borderLeftColor: guide.color }}
            >
              <div className="h-40 bg-gradient-to-br from-navy/5 to-transparent relative overflow-hidden">
                <img src={heroUrl} alt={guide.name} className="w-full h-full object-cover opacity-90" />
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <span className="text-3xl">{guide.emoji}</span>
                  <div>
                    <h2 className="font-heading font-extrabold text-xl text-white drop-shadow-md">{guide.name}</h2>
                    <p className="text-white/90 text-xs font-body drop-shadow">{guide.district}</p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <p className="font-body font-semibold text-teal text-sm mb-1">{guide.tagline}</p>
                <p className="font-body text-navy/70 text-sm leading-relaxed mb-4">{guide.shortDescription}</p>

                <div className="flex flex-col sm:flex-row gap-5 items-center">
                  <QRCodeDisplay value={pageUrl} label="Scan to open on your phone" />
                  <div className="flex-1 space-y-2 w-full">
                    <Link
                      to={`/explore/location/${guide.id}`}
                      className="block w-full text-center bg-navy text-white font-heading font-bold py-3 rounded-xl hover:bg-navy/90"
                    >
                      View {guide.name} →
                    </Link>
                    <p className="text-xs text-navy/40 font-body text-center break-all">{pageUrl}</p>
                    <p className="text-xs text-navy/50 font-body text-center">
                      Print this QR at the site for visitors to scan
                    </p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <p className="text-center text-xs text-navy/40 font-body mt-8">
        Content editable in <code className="bg-white px-1 rounded">packages/shared/src/locations.config.ts</code>
      </p>
    </div>
  );
}
