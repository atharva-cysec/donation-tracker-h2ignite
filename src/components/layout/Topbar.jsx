import { Bell, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Topbar — minimal sticky header for the app shell.
 *
 * Props:
 *   title       — current page section label
 *   onMenuClick — opens mobile sidebar drawer
 */
function Topbar({ title = 'Dashboard', onMenuClick }) {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 sm:px-6 h-14 gap-4">

        {/* Left — hamburger (mobile) + title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-gray-900 truncate">
              {title}
            </h1>
            <p className="text-xs text-gray-400 hidden sm:block truncate leading-tight">
              Welcome back, {firstName}
            </p>
          </div>
        </div>

        {/* Right — notifications + avatar */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            aria-label="Notifications"
            className="relative p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
          >
            <Bell className="w-4.5 h-4.5" strokeWidth={1.75} />
            <span
              aria-hidden="true"
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-500"
            />
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <div
              aria-hidden="true"
              className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 font-semibold text-xs select-none"
            >
              {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
              {user?.name}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}

export default Topbar;
