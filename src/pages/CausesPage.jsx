import MainLayout from '../components/layout/MainLayout';
import { Heart } from 'lucide-react';

function CausesPage() {
  return (
    <MainLayout title="Causes">
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 sm:p-14 text-center max-w-lg mx-auto mt-8">
        <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-4">
          <Heart className="w-6 h-6 text-purple-500" />
        </div>
        <h2 className="text-lg font-bold text-slate-800 mb-2">Causes — Coming Soon</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Browse and donate to verified causes. This section will be built in a later phase.
        </p>
      </div>
    </MainLayout>
  );
}

export default CausesPage;
