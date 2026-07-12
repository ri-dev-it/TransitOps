function formatRole(role) {
  return (role || 'fleet-manager')
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function initials(name) {
  return (name || 'TransitOps User')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function UserProfileCard({ user }) {
  const name = user?.name || 'Operator';

  return (
    <div className="hidden items-center gap-2 rounded-2xl border border-[#D8C9A7]/70 bg-white px-2.5 py-2 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-[#3B433D] dark:bg-[#1F2421] lg:flex">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6E8B3D] text-xs font-semibold text-white shadow-sm">
        {user?.avatar || initials(name)}
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block max-w-28 truncate text-xs font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">{name}</span>
        <span className="mt-0.5 inline-flex rounded-full bg-[#D8C9A7]/60 px-2 py-0.5 text-[10px] font-semibold text-[#355841] dark:bg-[#6E8B3D]/30 dark:text-[#E8F2D1]">
          {formatRole(user?.role)}
        </span>
      </span>
    </div>
  );
}
