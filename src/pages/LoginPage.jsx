import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword } from '../utils/validation';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

// ─── Left Panel — Brand Visual ────────────────────────────────────────────────
function BrandPanel() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between p-10 xl:p-14 bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 overflow-hidden lg:w-[45%] xl:w-[42%] shrink-0">
      {/* Decorative background orbs */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-purple-700/20 blur-3xl pointer-events-none"
      />

      {/* Logo */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            TrustDonate
          </span>
        </div>
        <p className="text-indigo-300 text-xs font-medium tracking-widest uppercase mt-1">
          Donation Transparency Platform
        </p>
      </div>

      {/* Hero message */}
      <div className="relative z-10 my-auto">
        <h2 className="text-white text-3xl xl:text-4xl font-bold leading-snug mb-4">
          Track every donation.
          <br />
          <span className="text-indigo-300">See every milestone.</span>
        </h2>
        <p className="text-indigo-200/80 text-base leading-relaxed max-w-xs">
          Real-time visibility into where your money goes — from donation to
          impact.
        </p>

        {/* Trust stats */}
        <div className="flex gap-6 mt-8">
          <Stat icon={<TrendingUp className="w-4 h-4" />} value="100%" label="Transparent" />
          <Stat icon={<ShieldCheck className="w-4 h-4" />} value="Verified" label="On-chain" />
          <Stat icon={<Users className="w-4 h-4" />} value="Donors" label="Trust us" />
        </div>
      </div>

      {/* Footer tagline */}
      <p className="relative z-10 text-indigo-400/60 text-xs">
        Don't just donate. Know the impact.
      </p>
    </div>
  );
}

function Stat({ icon, value, label }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-indigo-300">
        {icon}
        <span className="text-white font-semibold text-sm">{value}</span>
      </div>
      <span className="text-indigo-400/70 text-xs">{label}</span>
    </div>
  );
}

// ─── Password Visibility Toggle ────────────────────────────────────────────────
function EyeToggle({ show, onToggle, label }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={show ? `Hide ${label}` : `Show ${label}`}
      className="text-slate-400 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md p-0.5 transition-colors"
    >
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );
}

// ─── Login Page ────────────────────────────────────────────────────────────────
function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validate a single field on blur
  const validateField = (name, value) => {
    let result = { isValid: true, message: '' };
    if (name === 'email') result = validateEmail(value);
    if (name === 'password') result = validatePassword(value);
    setErrors((prev) => ({ ...prev, [name]: result.message }));
  };

  const validateAll = () => {
    const emailResult = validateEmail(email);
    const passwordResult = validatePassword(password);
    const newErrors = {
      email: emailResult.message,
      password: passwordResult.message,
    };
    setErrors(newErrors);
    return emailResult.isValid && passwordResult.isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validateAll()) return;

    setLoading(true);

    // Simulate a brief async operation for UX feel
    await new Promise((res) => setTimeout(res, 600));

    const result = login(email, password);

    setLoading(false);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setFormError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* ── Left brand panel (desktop only) — direct flex child so it stretches full height ── */}
      <BrandPanel />

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-20">
        {/* Mobile-only logo */}
        <div className="flex items-center gap-2.5 mb-10 lg:hidden">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-slate-900 text-lg">TrustDonate</span>
        </div>

        <div className="w-full max-w-sm mx-auto lg:mx-0">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1.5">
              Welcome back
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Sign in to continue tracking your donations.
            </p>
          </div>

          {/* Form-level error */}
          {formError && (
            <div
              role="alert"
              className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a.875.875 0 110-1.75.875.875 0 010 1.75z" />
              </svg>
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email */}
            <Input
              id="email"
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => validateField('email', email)}
              error={errors.email}
              disabled={loading}
            />

            {/* Password */}
            <div className="space-y-1">
              <Input
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => validateField('password', password)}
                error={errors.password}
                disabled={loading}
                rightElement={
                  <EyeToggle
                    show={showPassword}
                    onToggle={() => setShowPassword((v) => !v)}
                    label="password"
                  />
                }
              />
              {/* Forgot password */}
              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none focus-visible:underline transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-sm text-slate-600">Remember me</span>
            </label>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              disabled={loading}
              className="mt-2"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>

          {/* Signup link */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors focus:outline-none focus-visible:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
