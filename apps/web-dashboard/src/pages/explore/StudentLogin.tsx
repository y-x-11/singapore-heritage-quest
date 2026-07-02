import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GoogleSignInButton from '../../components/GoogleSignInButton';

export default function StudentLogin() {
  const [classCode, setClassCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { loginStudentWithGoogle, isConfigured, user } = useAuth();
  const navigate = useNavigate();

  if (user?.role === 'student') {
    navigate('/explore/profile', { replace: true });
    return null;
  }

  const handleGoogle = async () => {
    setError('');
    setBusy(true);
    try {
      await loginStudentWithGoogle(classCode || undefined);
      navigate('/explore/profile');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign in failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <p className="text-5xl mb-3">🎒</p>
        <h1 className="font-heading font-extrabold text-2xl text-navy">Student Sign In</h1>
        <p className="font-body text-navy/60 text-sm mt-2">
          Join your class and track your heritage quest progress
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4">
        <div>
          <label className="block font-body font-semibold text-sm text-navy mb-2">
            Class code {isConfigured ? '(required for first sign-up)' : '(required)'}
          </label>
          <input
            type="text"
            placeholder="e.g. HERIT1"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value.toUpperCase())}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-body uppercase tracking-widest focus:border-teal outline-none"
          />
          <p className="text-xs text-navy/40 font-body mt-1.5">Get this code from your teacher</p>
        </div>

        <GoogleSignInButton onClick={handleGoogle} loading={busy} label="Sign in with Google" />

        {error && (
          <p className="text-merlion text-sm font-body font-semibold bg-merlion/10 rounded-xl p-3">{error}</p>
        )}

        {!isConfigured && (
          <p className="text-xs text-navy/50 font-body bg-cream rounded-xl p-3">
            Demo mode: Google sign-in is simulated. Add Firebase keys in <code>.env</code> for real Google login.
            Use class code <strong>HERIT1</strong>.
          </p>
        )}

        {isConfigured && (
          <p className="text-xs text-navy/50 font-body bg-cream rounded-xl p-3">
            First time? Enter your class code, then tap Google. Returning students can sign in directly.
          </p>
        )}
      </div>

      <p className="text-center mt-6 font-body text-sm text-navy/50">
        <Link to="/explore" className="text-teal font-semibold hover:underline">
          Continue without signing in →
        </Link>
      </p>

      <p className="text-center mt-4 font-body text-xs text-navy/40">
        Are you a teacher?{' '}
        <Link to="/login" className="text-teal hover:underline">
          Teacher login
        </Link>
      </p>
    </div>
  );
}
