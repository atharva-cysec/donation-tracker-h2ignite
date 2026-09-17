import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  validateEmail,
  validatePassword,
  validateRequired,
  validatePasswordMatch,
} from '../utils/validation';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

// ─── Left Panel — Brand Visual (shared style with Login) ─────────────────────
function BrandPanel() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between p-10 xl:p-14 bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 overflow-hidden">
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
          Your donation,
          <br />
          <span className="text-indigo-300">fully accounted for.</span>
        </h2>
        <p className="text-indigo-200/80 text-base leading-relaxed max-w-xs">
          Create an account and start tracking every rupee from your heart to its
          destination.
        </p>

        <div className="flex gap-6 mt-8">
          <Stat icon={<TrendingUp className="w-4 h-4" />} value="100%" label="Transparent" />
          <Stat icon={<ShieldCheck className="w-4 h-4" />} value="Verified" label="On-chain" />
          <Stat icon={<Users className="w-4 h-4" />} value="Donors" label="Trust us" />
        </div>
      </div>

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

// ─── Password Strength Indicator ───────────────────────────────────────────────
function PasswordStrength({ password }) {
  if (!password) return null;

  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = [
    '',
    'bg-red-400',
    'bg-amber-400',
    'bg-emerald-400',
    'bg-emerald-500',
  ];
  const textColors = [
    '',
    'text-red-500',
    'text-amber-500',
    'text-emerald-600',
    'text-emerald-600',
  ];

  return (
    <div className="mt-1.5">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= strength ? colors[strength] : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
      {strength > 0 && (
        <p className={`text-xs font-medium ${textColors[strength]}`}>
          {labels[strength]}
        </p>
      )}
    </div>
  );
}

// ─── Signup Page ───────────────────────────────────────────────────────────────
function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateField = (fieldName, value) => {
    let result = { isValid: true, message: '' };
    if (fieldName === 'name') result = validateRequired(value, 'Full name');
    if (fieldName === 'email') result = validateEmail(value);
    if (fieldName === 'password') result = validatePassword(value);
    if (fieldName === 'confirmPassword')
      result = validatePasswordMatch(password, value);
    setErrors((prev) => ({ ...prev, [fieldName]: result.message }));
  };

  const validateAll = () => {
    const nameResult = validateRequired(name, 'Full name');
    const emailResult = validateEmail(email);
    const passwordResult = validatePassword(password);
    const confirmResult = validatePasswordMatch(password, confirmPassword);

    const newErrors = {
      name: nameResult.message,
      email: emailResult.message,
      password: passwordResult.message,
      confirmPassword: confirmResult.message,
    };
    setErrors(newErrors);

    return (
      nameResult.isValid &&
      emailResult.isValid &&
      passwordResult.isValid &&
      confirmResult.isValid
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validateAll()) return;

    setLoading(true);
    await new Promise((res) => setTimeout(res, 700));

    const result = signup(name, email, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setFormError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* ── Left brand panel (desktop only) ── */}
      <div className="lg:w-[45%] xl:w-[42%] shrink-0">
        <BrandPanel />
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-20 overflow-y-auto">
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
              Create your account
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Start tracking your donations with full transparency.
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
            {/* Full Name */}
            <Input
              id="name"
              label="Full name"
              type="text"
              autoComplete="name"
              placeholder="Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => validateField('name', name)}
              error={errors.name}
              disabled={loading}
            />

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
            <div>
              <Input
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="At least 8 characters"
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
              <PasswordStrength password={password} />
            </div>

            {/* Confirm Password */}
            <Input
              id="confirmPassword"
              label="Confirm password"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => validateField('confirmPassword', confirmPassword)}
              error={errors.confirmPassword}
              disabled={loading}
              rightElement={
                <EyeToggle
                  show={showConfirm}
                  onToggle={() => setShowConfirm((v) => !v)}
                  label="confirm password"
                />
              }
            />

            {/* Privacy note */}
            <p className="text-xs text-slate-400 leading-relaxed">
              By creating an account, you agree to our{' '}
              <button
                type="button"
                className="text-indigo-500 hover:underline focus:outline-none focus-visible:underline"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                className="text-indigo-500 hover:underline focus:outline-none focus-visible:underline"
              >
                Privacy Policy
              </button>
              .
            </p>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors focus:outline-none focus-visible:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
