import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Heart,
  ClipboardList,
  Settings,
  CircleHelp,
  LogOut,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { label: 'Dashboard',      icon: LayoutDashboard, to: '/dashboard'    },
  { label: 'Causes',         icon: Heart,           to: '/causes'       },
  { label: 'My Donations',   icon: ClipboardList,   to: '/my-donations' },
  { label: 'Settings',       icon: Settings,        to: '/settings'     },
  { label: 'Help & Support', icon: CircleHelp,      to: '/support'      },
];

// ─── Nav link ─────────────────────────────────────────────────────────────────
function NavLink({ item, onClick }) {
  const { pathname } = useLocation();
  const isActive = pathname === item.to;
  const Icon = item.icon;

  return (
    <Link
      to={item.to}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={[
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
        'transition-colors duration-150 outline-none',
        'focus-visible:ring-2 focus-visible:ring-[#2F7D5B]',
        isActive
          ? 'bg-[#2F7D5B] text-white shadow-xs'
          : 'text-[#8BAA99] hover:bg-[#1F3D32] hover:text-[#C5D9CE]',
      ].join(' ')}
    >
      <Icon className="w-4 h-4 shrink-0" strokeWidth={isActive ? 2.5 : 1.75} />
      {item.label}
    </Link>
  );
}

// ─── Sidebar content ──────────────────────────────────────────────────────────
function SidebarContent({ onNavClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onNavClick) onNavClick();
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex flex-col h-full select-none bg-[#18332B]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-[#1F3D32] shrink-0">
        <div className="w-7 h-7 rounded-lg bg-[#2F7D5B] flex items-center justify-center shadow-xs">
          <ShieldCheck className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <span className="font-bold text-white text-sm tracking-tight">
          TrustDonate
        </span>
      </div>

      {/* Nav */}
      <nav aria-label="Main navigation" className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-widest text-[#3D6353]">
          Navigate
        </p>
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} item={item} onClick={onNavClick} />
        ))}
      </nav>

      {/* User profile + Logout separated at bottom */}
      <div className="px-3 py-4 border-t border-[#1F3D32] shrink-0 space-y-1">
        {/* User Card */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#122620] mb-2">
          <div
            aria-hidden="true"
            className="w-7 h-7 rounded-full border border-[#2F7D5B]/40 bg-[#2F7D5B]/20 flex items-center justify-center text-[#8BAA99] font-bold text-xs shrink-0"
          >
            {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#C5D9CE] truncate leading-tight">
              {user?.name || 'Guest User'}
            </p>
            <p className="text-xs text-[#3D6353] truncate leading-tight">
              {user?.email || 'demo@trustdonate.test'}
            </p>
          </div>
        </div>

        {/* Proper understated Logout button */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[#8BAA99] hover:bg-[#1F3D32] hover:text-[#C5D9CE] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F7D5B] cursor-pointer"
          aria-label="Logout of TrustDonate"
        >
          <LogOut className="w-4 h-4 shrink-0 text-[#8BAA99]" strokeWidth={1.75} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

// ─── Sidebar (desktop + mobile drawer) ────────────────────────────────────────
function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-56 xl:w-60 shrink-0 bg-[#18332B] min-h-screen sticky top-0"
        aria-label="Application sidebar"
      >
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" aria-modal="true" role="dialog" aria-label="Navigation menu">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} aria-hidden="true" />
          <div className="absolute inset-y-0 left-0 w-64 bg-[#18332B] flex flex-col shadow-2xl">
            <button
              onClick={onClose}
              aria-label="Close navigation menu"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#8BAA99] hover:text-white hover:bg-[#1F3D32] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F7D5B] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <SidebarContent onNavClick={onClose} />
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
