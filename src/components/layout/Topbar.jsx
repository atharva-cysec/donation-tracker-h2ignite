import { Bell, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function Topbar({ title = 'Dashboard', onMenuClick }) {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E4E8E5]">
      <div className="flex items-center justify-between px-4 sm:px-6 h-14 gap-4">

        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="lg:hidden p-1.5 rounded-lg text-[#68746F] hover:text-[#1D2925] hover:bg-[#F4F6F4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F7D5B] transition-colors shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-[#1D2925] truncate">{title}</h1>
            <p className="text-xs text-[#9BAB9E] hidden sm:block truncate leading-tight">
              Welcome back, {firstName}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            aria-label="Notifications"
            className="relative p-1.5 rounded-lg text-[#68746F] hover:text-[#1D2925] hover:bg-[#F4F6F4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F7D5B] transition-colors"
          >
            <Bell className="w-4.5 h-4.5" strokeWidth={1.75} />
            <span aria-hidden="true" className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#2F7D5B]" />
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-[#E4E8E5]">
            <div
              aria-hidden="true"
              className="w-7 h-7 rounded-full bg-[#EAF3EE] border border-[#C8DFD2] flex items-center justify-center text-[#2F7D5B] font-semibold text-xs select-none"
            >
              {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
            </div>
            <span className="hidden md:block text-sm font-medium text-[#1D2925] max-w-[120px] truncate">
              {user?.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
