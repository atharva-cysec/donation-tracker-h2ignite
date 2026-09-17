import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

/**
 * Dashboard — Phase 1 stub.
 *
 * This is a placeholder that shows the authenticated user's name
 * and a logout button. Full dashboard content (donation cards,
 * status tracker, causes, etc.) will be built in later phases.
 */
function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Get first name for a friendlier greeting
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Top Navigation Bar ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">
              TrustDonate
            </span>
          </div>

          {/* Right side — user info + logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-800">
                {user?.name}
              </span>
              <span className="text-xs text-slate-400">{user?.email}</span>
            </div>

            {/* Avatar circle */}
            <div
              aria-hidden="true"
              className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm select-none"
            >
              {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              aria-label="Log out"
              className="text-slate-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Log out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Greeting */}
        <div className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
            Good to see you, {firstName}! 👋
          </h1>
          <p className="text-slate-500 text-base">
            Your donation dashboard is on its way.
          </p>
        </div>

        {/* Phase placeholder card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10 max-w-2xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
              <LayoutDashboard className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">
                Dashboard Coming Soon
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Phase 1 — Authentication — is complete. The full donation
                dashboard will be built in the next phase.
              </p>
            </div>
          </div>

          {/* Phase checklist */}
          <div className="space-y-3 border-t border-slate-100 pt-6">
            <PhaseItem
              icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              label="Phase 1 — Login & Signup"
              done
            />
            <PhaseItem
              icon={<Clock className="w-4 h-4 text-slate-300" />}
              label="Phase 2 — Dashboard & Donation Cards"
              done={false}
            />
            <PhaseItem
              icon={<Clock className="w-4 h-4 text-slate-300" />}
              label="Phase 3 — Donation Status Tracker"
              done={false}
            />
            <PhaseItem
              icon={<Clock className="w-4 h-4 text-slate-300" />}
              label="Phase 4 — Blockchain Integration"
              done={false}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function PhaseItem({ icon, label, done }) {
  return (
    <div className="flex items-center gap-3">
      <div className="shrink-0">{icon}</div>
      <span
        className={`text-sm font-medium ${
          done ? 'text-slate-800' : 'text-slate-400'
        }`}
      >
        {label}
      </span>
      {done && (
        <span className="ml-auto text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
          Complete
        </span>
      )}
    </div>
  );
}

export default Dashboard;
