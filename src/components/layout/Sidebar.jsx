import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Heart,
  ClipboardList,
  Settings,
  LogOut,
  ShieldCheck,
  X,
  Menu,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { label: 'Dashboard',    icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Causes',       icon: Heart,           to: '/causes'    },
  { label: 'My Donations', icon: ClipboardList,   to: '/my-donations' },
  { label: 'Settings',     icon: Settings,        to: '/settings'  },
];

// ─── Single nav link ──────────────────────────────────────────────────────────
function NavLink({ item, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === item.to;
  const Icon = item.icon;

  return (
    <Link
      to={item.to}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={[
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
        'transition-colors duration-150 outline-none',
        'focus-visible:ring-2 focus-visible:ring-blue-500',
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200',
      ].join(' ')}
    >
      <Icon className="w-4 h-4 shrink-0" strokeWidth={isActive ? 2.5 : 1.75} />
      {item.label}
    </Link>
  );
}

// ─── Sidebar inner content (shared by desktop + mobile) ───────────────────────
function SidebarContent({ onNavClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex flex-col h-full select-none">

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-gray-800 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
          <ShieldCheck className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <span className="font-bold text-white text-sm tracking-tight">
          TrustDonate
        </span>
      </div>

      {/* Navigation */}
      <nav
        aria-label="Main navigation"
        className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto"
      >
        <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-widest text-gray-600">
          Menu
        </p>
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} item={item} onClick={onNavClick} />
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-gray-800 shrink-0 space-y-1">
        {/* User info */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-800 mb-2">
          <div
            aria-hidden="true"
            className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs shrink-0"
          >
            {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-200 truncate leading-tight">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 truncate leading-tight">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-800 hover:text-red-400 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <LogOut className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          Log out
        </button>
      </div>
    </div>
  );
}

// ─── Sidebar component (desktop + mobile drawer) ──────────────────────────────
function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      {/* Desktop — always visible */}
      <aside
        className="hidden lg:flex flex-col w-56 xl:w-60 shrink-0 bg-gray-900 min-h-screen sticky top-0"
        aria-label="Application sidebar"
      >
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          aria-modal="true"
          role="dialog"
          aria-label="Navigation menu"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="absolute inset-y-0 left-0 w-64 bg-gray-900 flex flex-col shadow-2xl">
            <button
              onClick={onClose}
              aria-label="Close navigation menu"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
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
