import { forwardRef } from 'react';

/**
 * Input — accessible form field with label, error message, and optional right element.
 *
 * Props:
 *   id          — links label to input (required)
 *   label       — visible label text
 *   error       — error string (falsy = no error shown)
 *   rightElement — node rendered inside the right side of the input (e.g., show/hide button)
 *   All standard <input> props are forwarded
 */
const Input = forwardRef(function Input(
  {
    id,
    label,
    error,
    rightElement,
    className = '',
    type = 'text',
    ...rest
  },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-slate-700 select-none"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={type}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={[
            'w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900',
            'placeholder:text-slate-400',
            'transition-all duration-150 outline-none',
            'focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 focus:border-indigo-500',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50',
            error
              ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
              : 'border-slate-200 hover:border-slate-300',
            rightElement ? 'pr-11' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />

        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs text-red-500 font-medium flex items-center gap-1"
        >
          <svg
            className="h-3.5 w-3.5 shrink-0"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a.875.875 0 110-1.75.875.875 0 010 1.75z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
