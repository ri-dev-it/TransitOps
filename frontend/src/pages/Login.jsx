import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('ops@transitops.com');
  const [password, setPassword] = useState('demo');

  function handleSubmit(event) {
    event.preventDefault();
    login(email, password);
    navigate('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(110,139,61,0.2),_transparent_45%),_#F6F5F2] px-4 py-10 dark:bg-[radial-gradient(circle_at_top,_rgba(136,169,91,0.2),_transparent_45%),_#171A19]">
      <div className="w-full max-w-5xl overflow-hidden rounded-[36px] border border-[#D8C9A7]/70 bg-white shadow-2xl dark:border-[#3B433D] dark:bg-[#1F2421] lg:grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative overflow-hidden bg-[linear-gradient(135deg,#2F5D50_0%,#366857_100%)] p-8 text-white sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(212,224,164,0.12),_transparent_30%)]" />
          <div className="absolute left-6 top-8 h-24 w-24 rounded-full border border-white/15 bg-white/10 blur-2xl" />
          <div className="absolute bottom-10 right-8 h-28 w-28 rounded-full border border-white/10 bg-[#6E8B3D]/30 blur-3xl" />
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="relative">
            <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm">TransitOps • Smart operations</div>
            <h1 className="mt-6 text-4xl font-semibold leading-tight">Command the fleet from one calm control center.</h1>
            <p className="mt-4 max-w-md text-sm text-[#E9E7DE]">Monitor vehicles, dispatch trips, track maintenance, and review costs with a premium operations experience built for modern logistics teams.</p>
            <div className="mt-8 grid gap-3 text-sm text-[#E5E2D8] sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-3 shadow-sm backdrop-blur-sm">• Live fleet visibility with enterprise-grade clarity</div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-3 shadow-sm backdrop-blur-sm">• Streamlined maintenance and expense management</div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-3 shadow-sm backdrop-blur-sm">• Elegant light and dark experiences for every screen</div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-3 shadow-sm backdrop-blur-sm">• Fleet health at a glance</div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm backdrop-blur-sm">Fleet Health <span className="ml-2 font-semibold">98%</span></div>
              <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm backdrop-blur-sm">Today’s Trips <span className="ml-2 font-semibold">124</span></div>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6E8B3D]">Welcome back</p>
          <h2 className="mt-2 text-3xl font-semibold">Sign in to TransitOps</h2>
          <p className="mt-2 text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">Use any email and password to enter the preview experience.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Email</span>
              <input className="input-field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Password</span>
              <input className="input-field" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
            <button type="submit" className="w-full rounded-full bg-[#6E8B3D] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#5F7633] hover:shadow-md active:scale-[0.98]">
              Enter Smart Operations
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-[#D8C9A7]/70 bg-[#F6F5F2] p-4 text-sm text-[#6B6B6B] shadow-sm transition-all duration-300 dark:border-[#3B433D] dark:bg-[#242826] dark:text-[#B4B4B4]">
            <p className="font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">Preview mode</p>
            <p className="mt-1">The experience is intentionally front-end only, with placeholder data and no backend connection.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
