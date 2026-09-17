import { forwardRef } from 'react';

/**
 * Button — reusable, accessible button component.
 *
 * Props:
 *   variant  — 'primary' | 'secondary' | 'ghost'
 *   size     — 'sm' | 'md' | 'lg'
 *   loading  — shows a spinner and disables interaction
 *   disabled — disabled state
 *   fullWidth — stretches to container width
 *   children, type, onClick, className
 */
const variantClasses = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 focus-visible:ring-indigo-500 disabled:bg-indigo-300 shadow-sm',
  secondary:
    'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 active:bg-indigo-100 focus-visible:ring-indigo-400 disabled:opacity-50 shadow-sm',
  ghost:
    'bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-slate-400 disabled:opacity-50',
};

const sizeClasses = {
  sm: 'h-9 px-4 text-sm rounded-lg',
  md: 'h-11 px-5 text-sm rounded-xl',
  lg: 'h-12 px-6 text-base rounded-xl',
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
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
});

export default Button;
