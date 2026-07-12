import { Link, useLocation } from 'react-router-dom';

export default function AccessDenied() {
  const location = useLocation();
  const attemptedPath = location.state?.from?.pathname;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6F5F2] px-4 text-[#2A2A2A] transition-colors duration-300 dark:bg-[#171A19] dark:text-[#F5F5F5]">
      <section className="w-full max-w-lg rounded-[32px] border border-[#D8C9A7]/70 bg-white p-8 text-center shadow-sm dark:border-[#3B433D] dark:bg-[#242826] sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6E8B3D]">Access restricted</p>
        <h1 className="mt-3 text-3xl font-semibold">You don’t have access to this area.</h1>
        <p className="mt-3 text-sm leading-6 text-[#6B6B6B] dark:text-[#B4B4B4]">
          Your current role doesn’t include permission for{attemptedPath ? ` ${attemptedPath}` : ' this page'}.
        </p>
        <Link
          to="/"
          className="mt-7 inline-flex rounded-full bg-[#6E8B3D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#5F7633] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#6E8B3D] focus:ring-offset-2 dark:focus:ring-offset-[#242826]"
        >
          Return to dashboard
        </Link>
      </section>
    </main>
  );
}
