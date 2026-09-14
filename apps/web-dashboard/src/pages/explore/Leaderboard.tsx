import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchLeaderboard, type LeaderboardEntry } from '../../lib/authService';

export default function Leaderboard() {
  const { user, loading: authLoading } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'student') {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchLeaderboard()
      .then((data) => {
        if (!cancelled) setEntries(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load leaderboard.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  if (authLoading) {
    return <p className="text-center font-body text-navy/50 py-12">Loading…</p>;
  }

  if (!user || user.role !== 'student') {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-4">🏆</p>
        <p className="font-body text-navy/60 mb-4">Sign in with Google to view the leaderboard</p>
        <Link to="/login" className="bg-teal text-white font-heading font-bold px-6 py-3 rounded-xl">
          Student Sign In
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading font-extrabold text-2xl text-navy mb-1">Leaderboard</h1>
      <p className="font-body text-sm text-navy/50 mb-6">Top explorers ranked by level</p>

      {loading && <p className="text-center font-body text-navy/50 py-12">Loading leaderboard…</p>}

      {error && (
        <div className="bg-merlion/10 text-merlion font-body text-sm rounded-2xl p-4 text-center">{error}</div>
      )}

      {!loading && !error && entries.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl shadow-sm">
          <p className="text-4xl mb-4">🧭</p>
          <p className="font-body text-navy/60">No explorers on the board yet. Be the first!</p>
        </div>
      )}

      {!loading && !error && entries.length > 0 && (
        <ul className="space-y-3">
          {entries.map((entry, index) => {
            const isCurrentUser = entry.uid === user.uid;
            return (
              <li
                key={entry.uid}
                className={`flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm ${
                  isCurrentUser ? 'ring-2 ring-teal/40' : ''
                }`}
              >
                <span className="font-heading font-bold text-navy/30 w-6 text-center shrink-0">
                  {index + 1}
                </span>
                {entry.photoURL ? (
                  <img
                    src={entry.photoURL}
                    alt=""
                    className="w-12 h-12 rounded-full border-2 border-teal object-cover shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-teal/20 flex items-center justify-center text-xl shrink-0">
                    🧭
                  </div>
                )}
                <p className="font-heading font-bold text-navy flex-1 min-w-0 truncate">{entry.username}</p>
                <span className="bg-teal/10 text-teal font-heading font-bold text-sm px-3 py-1 rounded-full shrink-0">
                  Lv.{entry.level}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
