import { forwardRef } from 'react';

/**
 * Input — accessible form field with label, inline error, and right-element slot.
 * Focus ring uses TrustDonate green (#2F7D5B).
 */
const Input = forwardRef(function Input(
  { id, label, error, rightElement, className = '', type = 'text', ...rest },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-[#1D2925] select-none"
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
            'w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#1D2925]',
            'placeholder:text-[#9BAB9E]',
            'transition-all duration-150 outline-none',
            'focus:ring-2 focus:ring-[#2F7D5B]/40 focus:ring-offset-0 focus:border-[#2F7D5B]',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#F4F6F4]',
            error
              ? 'border-red-400 focus:ring-red-300 focus:border-red-400'
              : 'border-[#E4E8E5] hover:border-[#9BAB9E]',
            rightElement ? 'pr-11' : '',
            className,
          ].filter(Boolean).join(' ')}
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
          className="text-xs font-medium flex items-center gap-1"
          style={{ color: 'var(--td-error-text)' }}
        >
          <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a.875.875 0 110-1.75.875.875 0 010 1.75z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
