import MainLayout from '../components/layout/MainLayout';
import { Settings } from 'lucide-react';

function SettingsPage() {
  return (
    <MainLayout title="Settings">
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 sm:p-14 text-center max-w-lg mx-auto mt-8">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <Settings className="w-6 h-6 text-slate-500" />
        </div>
        <h2 className="text-lg font-bold text-slate-800 mb-2">Settings — Coming Soon</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Profile settings, notification preferences, and account management. Available in a later phase.
        </p>
      </div>
    </MainLayout>
  );
}

export default SettingsPage;
