import MainLayout from '../components/layout/MainLayout';
import { Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function SettingsPage() {
  const { user } = useAuth();

  return (
    <MainLayout title="Settings">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#2F7D5B]">
            Account Management
          </span>
          <h2 className="text-2xl font-bold text-[#1D2925] mt-1">
            Profile & Settings
          </h2>
          <p className="text-xs text-[#68746F] mt-0.5">
            Manage your account preferences and transparent donor credentials.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-[#E4E8E5] p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#1D2925] pb-3 border-b border-[#E4E8E5]">
            User Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-[#68746F] mb-1">Full Name</p>
              <p className="font-semibold text-[#1D2925] bg-[#FAFAF7] p-2.5 rounded-lg border border-[#E4E8E5]">
                {user?.name || 'Not provided'}
              </p>
            </div>
            <div>
              <p className="text-[#68746F] mb-1">Email Address</p>
              <p className="font-semibold text-[#1D2925] bg-[#FAFAF7] p-2.5 rounded-lg border border-[#E4E8E5]">
                {user?.email || 'Not provided'}
              </p>
            </div>
          </div>
        </div>

        {/* Placeholder settings info */}
        <div className="bg-[#FAFAF7] rounded-xl border border-dashed border-[#E4E8E5] p-6 text-center">
          <Settings className="w-6 h-6 text-[#9BAB9E] mx-auto mb-2" />
          <p className="text-xs font-medium text-[#68746F]">
            Additional security, email notifications, and NGO receipt settings will be available in future releases.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}

export default SettingsPage;
