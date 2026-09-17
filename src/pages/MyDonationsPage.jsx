import MainLayout from '../components/layout/MainLayout';
import { ClipboardList } from 'lucide-react';

function MyDonationsPage() {
  return (
    <MainLayout title="My Donations">
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 sm:p-14 text-center max-w-lg mx-auto mt-8">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
          <ClipboardList className="w-6 h-6 text-amber-500" />
        </div>
        <h2 className="text-lg font-bold text-slate-800 mb-2">My Donations — Coming Soon</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          A full history of your donations with filtering and search. Available in a later phase.
        </p>
      </div>
    </MainLayout>
  );
}

export default MyDonationsPage;
