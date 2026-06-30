import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    login(email, password);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-merlion to-gold p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🦁</div>
          <h1 className="font-heading font-extrabold text-2xl text-navy">Teacher Dashboard</h1>
          <p className="text-navy/60 font-body text-sm mt-1">Singapore Heritage Quest AR</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Teacher email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-body focus:border-teal outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-body focus:border-teal outline-none"
          />
          {error && <p className="text-merlion text-sm font-semibold">{error}</p>}
          <button type="submit" className="w-full bg-teal text-white font-heading font-bold py-3 rounded-xl hover:bg-teal/90 transition-colors">
            Log In
          </button>
        </form>
        <p className="text-center text-xs text-navy/40 mt-6 font-body">Demo mode — any credentials work for teachers</p>
      </div>
    </div>
  );
}
