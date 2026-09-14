import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { publicUsername } from '../../lib/authService';
import { calculateLevel, levelProgress, XP_PER_LEVEL } from '@heritage/shared';

export default function StudentProfile() {
  const { user, logout, loading, updateUsername } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  if (loading) {
    return <p className="text-center font-body text-navy/50 py-12">Loading…</p>;
  }

  if (!user || user.role !== 'student') {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-4">🔐</p>
        <p className="font-body text-navy/60 mb-4">Sign in to view your profile</p>
        <Link to="/login" className="bg-teal text-white font-heading font-bold px-6 py-3 rounded-xl">
          Student Sign In
        </Link>
      </div>
    );
  }

  const level = calculateLevel(user.xp);
  const progress = levelProgress(user.xp);
  const xpInLevel = user.xp - (level - 1) * XP_PER_LEVEL;
  const username = publicUsername(user);

  const handleLogout = async () => {
    await logout();
    navigate('/explore');
  };

  const startEditing = () => {
    setDraft(username);
    setUsernameError(null);
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setUsernameError(null);
  };

  const saveUsername = async () => {
    setSaving(true);
    setUsernameError(null);
    try {
      await updateUsername(draft);
      setEditing(false);
    } catch (err) {
      setUsernameError(err instanceof Error ? err.message : 'Could not update username.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Link to="/explore" className="text-teal font-body font-semibold text-sm hover:underline">
        Back to Explore
      </Link>

      <div className="mt-6 bg-white rounded-3xl shadow-lg p-6 text-center">
        {user.photoURL ? (
          <img src={user.photoURL} alt="" className="w-20 h-20 rounded-full mx-auto border-4 border-teal object-cover" />
        ) : (
          <div className="w-20 h-20 rounded-full mx-auto bg-teal/20 flex items-center justify-center text-4xl">🧭</div>
        )}

        {editing ? (
          <div className="mt-4 max-w-xs mx-auto">
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={20}
              className="w-full text-center font-heading font-extrabold text-xl text-navy border-2 border-teal/30 rounded-xl px-3 py-2 focus:outline-none focus:border-teal"
              autoFocus
            />
            {usernameError && (
              <p className="font-body text-xs text-merlion mt-2">{usernameError}</p>
            )}
            <div className="flex gap-2 mt-3 justify-center">
              <button
                type="button"
                onClick={saveUsername}
                disabled={saving}
                className="bg-teal text-white font-heading font-bold text-sm px-4 py-2 rounded-xl disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                disabled={saving}
                className="bg-navy/10 text-navy font-heading font-bold text-sm px-4 py-2 rounded-xl disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
            <p className="font-body text-xs text-navy/40 mt-2">2 to 20 characters. Letters, numbers, and spaces only.</p>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <h1 className="font-heading font-extrabold text-2xl text-navy">{username}</h1>
            <button
              type="button"
              onClick={startEditing}
              className="bg-teal/10 hover:bg-teal/20 text-teal font-heading font-bold text-xs px-3 py-1.5 rounded-full transition-colors"
              aria-label="Change username"
            >
              ✏️ Edit
            </button>
          </div>
        )}

        <p className="font-body text-navy/50 text-sm mt-2">{user.email}</p>
        <p className="inline-block mt-3 bg-teal/10 text-teal font-heading font-bold text-sm px-4 py-1 rounded-full">
          🎒 Student Explorer
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
          <p className="font-heading font-extrabold text-2xl text-teal">Lv.{level}</p>
          <p className="font-body text-xs text-navy/50">Level</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
          <p className="font-heading font-extrabold text-2xl text-gold">{user.xp}</p>
          <p className="font-body text-xs text-navy/50">XP</p>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex justify-between font-body text-xs text-navy/50 mb-2">
          <span>Level {level}</span>
          <span>
            {xpInLevel} / {XP_PER_LEVEL} XP
          </span>
        </div>
        <div className="h-3 bg-cream rounded-full overflow-hidden">
          <div
            className="h-full bg-teal rounded-full transition-all duration-500"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
        <p className="font-body text-xs text-navy/40 mt-2 text-center">
          {XP_PER_LEVEL - xpInLevel} XP to reach Level {level + 1}
        </p>
      </div>

      <div className="mt-6 bg-sunshine/20 rounded-2xl p-5">
        <h2 className="font-heading font-bold text-navy mb-2">🗺️ Keep exploring!</h2>
        <p className="font-body text-sm text-navy/70 mb-4">
          Visit heritage sites and play mini games to earn XP. Better performance means more XP. Every {XP_PER_LEVEL} XP
          levels you up!
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
