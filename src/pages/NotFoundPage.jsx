import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col items-center justify-center p-6 text-center">
      {/* Brand icon */}
      <div className="w-12 h-12 rounded-xl bg-[#2F7D5B] flex items-center justify-center text-white shadow-xs mb-6">
        <ShieldCheck className="w-6 h-6" strokeWidth={2.5} />
      </div>

      <span className="text-xs font-bold uppercase tracking-wider text-[#2F7D5B] bg-[#EAF3EE] px-3 py-1 rounded-full mb-3">
        404 · Error
      </span>

      <h1 className="text-3xl sm:text-4xl font-bold text-[#1D2925] tracking-tight">
        Page Not Found
      </h1>

      <p className="text-sm text-[#68746F] mt-2 max-w-sm leading-relaxed">
        The page you are looking for doesn't exist, was removed, or is temporarily unavailable.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/dashboard')}
          className="shadow-xs"
        >
          Back to Dashboard
        </Button>
        <Button
          variant="secondary"
          size="md"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Go Back
        </Button>
      </div>

      <p className="text-xs text-[#9BAB9E] mt-12">
        TrustDonate · Give. Track. Trust.
      </p>
    </div>
  );
}
