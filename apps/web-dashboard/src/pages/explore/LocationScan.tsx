import { Link } from 'react-router-dom';
import LocationScanner from '../../components/LocationScanner';

export default function LocationScan() {
  return (
    <div className="text-center">
      <Link to="/explore" className="text-teal font-body font-semibold text-sm hover:underline">
        ← Back to sites
      </Link>
      <h1 className="font-heading font-extrabold text-2xl text-navy mt-4 mb-2">Scan Heritage QR</h1>
      <p className="font-body text-navy/60 text-sm mb-6 max-w-sm mx-auto">
        Allow camera access, then point at a location QR code from the Explore page or a printed sign at the site.
      </p>
      <LocationScanner />
      <div className="mt-8 bg-white rounded-2xl p-4 text-left max-w-sm mx-auto border border-gray-100">
        <p className="font-heading font-bold text-sm text-navy mb-2">💡 Tip</p>
        <p className="font-body text-xs text-navy/60 leading-relaxed">
          On iPhone, you can also scan the QR with the Camera app — it will open the heritage page directly in Safari.
        </p>
      </div>
    </div>
  );
}
