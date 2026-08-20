import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ExploreLayout() {
  const { user, loading } = useAuth();
  const isStudent = user?.role === 'student';

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-gradient-to-r from-merlion to-gold text-white px-4 py-5 shadow-md">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <div>
            <Link to="/explore" className="flex items-center gap-2">
              <span className="text-2xl">🦁</span>
              <span className="font-heading font-extrabold text-lg">Heritage Quest</span>
            </Link>
            <p className="text-white/80 text-xs font-body mt-0.5">Singapore Heritage Explorer</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/explore/scan"
              className="bg-white text-navy font-heading font-bold text-sm px-3 py-2 rounded-xl shadow hover:bg-cream transition-colors"
            >
              📷 Scan
            </Link>
            {!loading &&
              (isStudent ? (
                <Link
                  to="/explore/profile"
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-heading font-bold text-sm px-3 py-2 rounded-xl transition-colors"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <span>🎒</span>
                  )}
                  Profile
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="bg-white text-navy font-heading font-bold text-sm px-3 py-2 rounded-xl shadow hover:bg-cream transition-colors"
                >
                  Sign in
                </Link>
              ))}
          </div>
        </div>
      </header>
      <nav className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 flex gap-1">
          <NavLink
            to="/explore"
            end
            className={({ isActive }) =>
              `font-heading font-bold text-sm px-4 py-3 border-b-2 transition-colors ${
                isActive
                  ? 'border-teal text-teal'
                  : 'border-transparent text-navy/50 hover:text-navy'
              }`
            }
          >
            Heritage Sites
          </NavLink>
          <NavLink
            to="/explore/references"
            className={({ isActive }) =>
              `font-heading font-bold text-sm px-4 py-3 border-b-2 transition-colors ${
                isActive
                  ? 'border-teal text-teal'
                  : 'border-transparent text-navy/50 hover:text-navy'
              }`
            }
          >
            References
          </NavLink>
        </div>
      </nav>
      <main className="max-w-3xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
