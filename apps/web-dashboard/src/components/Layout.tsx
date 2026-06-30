import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/students', label: 'Students', icon: '👥' },
  { path: '/classes', label: 'Classes', icon: '🏫' },
  { path: '/content', label: 'Content', icon: '📚' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-navy text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="text-2xl mb-1">🦁</div>
          <h1 className="font-heading font-extrabold text-lg">Heritage Quest</h1>
          <p className="text-white/60 text-sm">Teacher Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-body font-semibold text-sm transition-colors ${
                location.pathname === item.path ? 'bg-teal text-white' : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <a
            href={`${import.meta.env.BASE_URL}explore`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-body font-semibold text-sm text-white/70 hover:bg-white/10 mt-2 border border-white/10"
          >
            <span>🗺️</span>
            Public Explore (QR)
          </a>
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-sm font-semibold">{user?.displayName}</p>
          <p className="text-xs text-white/50 mb-3">{user?.email}</p>
          <button onClick={logout} className="text-sm text-merlion hover:underline">
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
