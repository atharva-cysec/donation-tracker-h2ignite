import { Link } from 'react-router-dom';

/**
 * Footer — Minimal, understated brand footer for TrustDonate.
 * Focuses on the core ethos: "Give. Track. Trust."
 */
export default function Footer() {
  return (
    <footer className="mt-auto pt-10 pb-8 border-t border-[#E4E8E5] text-center">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-sm font-semibold tracking-wider text-[#1D2925] uppercase">
          Give. Track. Trust.
        </p>
        <div className="flex items-center justify-center gap-3 mt-1.5 text-xs text-[#68746F]">
          <span>© 2026 TrustDonate</span>
          <span>·</span>
          <Link
            to="/support"
            className="hover:text-[#2F7D5B] transition-colors underline-offset-2 hover:underline"
          >
            Help & Support
          </Link>
        </div>
      </div>
    </footer>
  );
}
