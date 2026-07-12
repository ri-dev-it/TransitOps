import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when typing
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);
        navigate('/', { replace: true });
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F5F2] p-4 dark:bg-[#1F2421]">
      <div className="w-full max-w-md rounded-[32px] border border-[#D8C9A7]/70 bg-white p-8 shadow-xl dark:border-[#3B433D] dark:bg-[#242826]">
        
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Welcome Back</p>
          <h1 className="mt-2 text-3xl font-bold text-[#2A2A2A] dark:text-[#F5F5F5]">TransitOps</h1>
          <p className="mt-2 text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">Sign in to manage your fleet operations.</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-[#6B6B6B] dark:text-[#B4B4B4]">Email Address</label>
            <input 
              type="email" 
              name="email" 
              required 
              value={formData.email} 
              onChange={handleInputChange} 
              className="w-full rounded-xl border border-[#D8C9A7]/70 bg-[#F6F5F2] p-3 outline-none transition-colors focus:border-[var(--accent)] dark:border-[#3B433D] dark:bg-[#1F2421] dark:text-[#F5F5F5]" 
              placeholder="admin@transitops.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#6B6B6B] dark:text-[#B4B4B4]">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              value={formData.password} 
              onChange={handleInputChange} 
              className="w-full rounded-xl border border-[#D8C9A7]/70 bg-[#F6F5F2] p-3 outline-none transition-colors focus:border-[var(--accent)] dark:border-[#3B433D] dark:bg-[#1F2421] dark:text-[#F5F5F5]" 
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full rounded-full bg-[var(--accent)] py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--accent-hover)] active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
