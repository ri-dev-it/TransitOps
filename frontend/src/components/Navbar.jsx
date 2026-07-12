import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_GROUPS = [
  {
    label: 'Fleet',
    items: [
      { to: '/vehicles', label: 'Vehicle Registry' },
      { to: '/maintenance', label: 'Maintenance Log' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/drivers', label: 'Drivers' },
      { to: '/trips', label: 'Trips & Dispatch' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { to: '/fuel', label: 'Fuel & Expenses' },
      { to: '/reports', label: 'Reports & Analytics' },
    ],
  },
];

function Dropdown({ group }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();
  const isActiveGroup = group.items.some((i) => location.pathname.startsWith(i.to));

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isActiveGroup ? 'text-signal-500' : 'text-mist-100 hover:text-white'
        }`}
      >
        {group.label}
        <span className="ml-1 text-xs opacity-60">▾</span>
      </button>
      {open && (
        <div className="absolute left-0 mt-1 w-52 bg-white rounded-md shadow-lg border border-mist-200 py-1 z-50">
          {group.items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-ink-800 hover:bg-mist-100"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  if (!user) return null;

  return (
    <nav className="bg-ink-900 border-b border-ink-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-signal-500 inline-block" />
            <span className="font-display font-semibold text-white tracking-tight">TransitOps</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className="px-3 py-2 text-sm font-medium rounded-md text-mist-100 hover:text-white"
            >
              Dashboard
            </Link>
            {NAV_GROUPS.map((group) => (
              <Dropdown key={group.label} group={group} />
            ))}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2 text-sm text-mist-100 hover:text-white"
          >
            <span className="w-7 h-7 rounded-full bg-ink-700 flex items-center justify-center text-xs font-semibold text-signal-500">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
            <span className="hidden sm:inline">{user.name}</span>
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-mist-200 py-1 z-50">
              <div className="px-4 py-2 border-b border-mist-100">
                <p className="text-sm font-medium text-ink-900">{user.name}</p>
                <p className="text-xs text-ink-700 capitalize">{user.role?.replace('_', ' ')}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-mist-100"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
