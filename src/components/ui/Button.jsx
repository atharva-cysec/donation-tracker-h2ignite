import { forwardRef } from 'react';

/**
 * Button — reusable accessible button.
 * Primary accent: #2F7D5B (TrustDonate forest green).
 */
const variants = {
  primary:
    'bg-[#2F7D5B] text-white hover:bg-[#27684C] active:bg-[#1F5239] shadow-sm ' +
    'focus-visible:ring-[#2F7D5B] disabled:opacity-50',
  secondary:
    'bg-white text-[#2F7D5B] border border-[#E4E8E5] hover:bg-[#EAF3EE] ' +
    'focus-visible:ring-[#2F7D5B] disabled:opacity-50 shadow-sm',
  ghost:
    'bg-transparent text-[#68746F] hover:bg-[#F4F6F4] active:bg-[#E4E8E5] ' +
    'focus-visible:ring-[#2F7D5B] disabled:opacity-50',
  danger:
    'bg-red-600 text-white hover:bg-red-700 shadow-sm ' +
    'focus-visible:ring-red-500 disabled:opacity-50',
};

const sizes = {
  sm: 'h-8 px-3.5 text-xs rounded-lg',
  md: 'h-9 px-4 text-sm rounded-lg',
  lg: 'h-10 px-5 text-sm rounded-xl',
};

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    type = 'button',
    onClick,
    className = '',
    ...rest
  },
  ref
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      className={[
        'inline-flex items-center justify-center gap-2 font-medium',
        'transition-all duration-150 cursor-pointer select-none',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
        'disabled:cursor-not-allowed',
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        fullWidth ? 'w-full' : '',
        className,
      ].filter(Boolean).join(' ')}
      {...rest}
    >
      {loading && (
        <svg
          className="animate-spin h-3.5 w-3.5 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
});

export default Button;
