import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthToast() {
  const { notice, clearNotice } = useAuth();

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(clearNotice, 4000);
    return () => window.clearTimeout(timeout);
  }, [notice, clearNotice]);

  if (!notice) return null;

  const error = notice.type === 'error';
  return (
    <div className="fixed right-4 top-4 z-50 max-w-sm animate-[fade-in_0.2s_ease-out]" role="status" aria-live="polite">
      <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg ${error ? 'border-red-200 bg-red-50 text-red-800 dark:border-red-900/70 dark:bg-red-950/80 dark:text-red-100' : 'border-[#B8CD88] bg-[#F4F8E9] text-[#29442F] dark:border-[#6E8B3D] dark:bg-[#253622] dark:text-[#E8F2D1]'}`}>
        <span aria-hidden="true">{error ? '!' : '✓'}</span>
        <p className="text-sm font-medium">{notice.message}</p>
        <button type="button" onClick={clearNotice} className="ml-auto text-sm opacity-70 transition hover:opacity-100" aria-label="Dismiss notification">×</button>
      </div>
    </div>
  );
}
