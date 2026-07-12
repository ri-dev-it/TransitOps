import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    if (!email || !password) {
      setFormError('Please enter both email and password.');
      return;
    }
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setFormError(result.message);
    }
  }

  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-6">
          <span className="w-3 h-3 rounded-sm bg-signal-500 inline-block" />
          <h1 className="text-white font-display font-semibold text-xl">TransitOps</h1>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-1">Sign in</h2>
          <p className="text-sm text-ink-700 mb-4">Access the fleet operations console.</p>

          {formError && (
            <div className="mb-4 text-sm bg-red-50 text-red-700 border border-red-100 rounded-md px-3 py-2">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-ink-700 mb-1">Email</label>
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@transitops.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-700 mb-1">Password</label>
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-mist-100 text-xs text-ink-700 space-y-1">
            <p className="font-medium text-ink-900">Demo accounts (password: Passw0rd!):</p>
            <p>manager@transitops.com — Fleet Manager</p>
            <p>driver@transitops.com — Driver</p>
            <p>safety@transitops.com — Safety Officer</p>
            <p>finance@transitops.com — Financial Analyst</p>
          </div>
        </div>
      </div>
    </div>
  );
}
