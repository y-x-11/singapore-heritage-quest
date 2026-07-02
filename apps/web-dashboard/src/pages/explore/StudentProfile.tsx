import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { calculateLevel } from '@heritage/shared';

export default function StudentProfile() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <p className="text-center font-body text-navy/50 py-12">Loading…</p>;
  }

  if (!user || user.role !== 'student') {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-4">🔐</p>
        <p className="font-body text-navy/60 mb-4">Sign in to view your profile</p>
        <Link to="/explore/login" className="bg-teal text-white font-heading font-bold px-6 py-3 rounded-xl">
          Student Sign In
        </Link>
      </div>
    );
  }

  const level = calculateLevel(user.xp);

  const handleLogout = async () => {
    await logout();
    navigate('/explore');
  };

  return (
    <div>
      <Link to="/explore" className="text-teal font-body font-semibold text-sm hover:underline">
        ← Back to Explore
      </Link>

      <div className="mt-6 bg-white rounded-3xl shadow-lg p-6 text-center">
        {user.photoURL ? (
          <img src={user.photoURL} alt="" className="w-20 h-20 rounded-full mx-auto border-4 border-teal object-cover" />
        ) : (
          <div className="w-20 h-20 rounded-full mx-auto bg-teal/20 flex items-center justify-center text-4xl">🧭</div>
        )}
        <h1 className="font-heading font-extrabold text-2xl text-navy mt-4">{user.displayName}</h1>
        <p className="font-body text-navy/50 text-sm">{user.email}</p>
        <p className="inline-block mt-3 bg-teal/10 text-teal font-heading font-bold text-sm px-4 py-1 rounded-full">
          🎒 Student Explorer
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
          <p className="font-heading font-extrabold text-2xl text-teal">Lv.{level}</p>
          <p className="font-body text-xs text-navy/50">Level</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
          <p className="font-heading font-extrabold text-2xl text-gold">{user.xp}</p>
          <p className="font-body text-xs text-navy/50">XP</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
          <p className="font-heading font-extrabold text-2xl text-merlion">🔥{user.streak}</p>
          <p className="font-body text-xs text-navy/50">Streak</p>
        </div>
      </div>

      <div className="mt-6 bg-sunshine/20 rounded-2xl p-5">
        <h2 className="font-heading font-bold text-navy mb-2">🗺️ Keep exploring!</h2>
        <p className="font-body text-sm text-navy/70 mb-4">
          Visit heritage sites, play mini-games, and scan QR codes to earn XP. Progress syncs when you use the mobile app with the same account.
        </p>
        <Link to="/explore" className="block text-center bg-navy text-white font-heading font-bold py-3 rounded-xl">
          Explore Heritage Sites
        </Link>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="w-full mt-6 text-merlion font-body font-semibold py-3 hover:underline"
      >
        Sign out
      </button>
    </div>
  );
}
