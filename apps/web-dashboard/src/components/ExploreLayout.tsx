import { Link, Outlet } from 'react-router-dom';

export default function ExploreLayout() {
  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-gradient-to-r from-merlion to-gold text-white px-4 py-5 shadow-md">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <Link to="/explore" className="flex items-center gap-2">
              <span className="text-2xl">🦁</span>
              <span className="font-heading font-extrabold text-lg">Heritage Quest</span>
            </Link>
            <p className="text-white/80 text-xs font-body mt-0.5">Singapore Heritage Explorer</p>
          </div>
          <Link
            to="/explore/scan"
            className="bg-white text-navy font-heading font-bold text-sm px-4 py-2 rounded-xl shadow hover:bg-cream transition-colors"
          >
            📷 Scan QR
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
