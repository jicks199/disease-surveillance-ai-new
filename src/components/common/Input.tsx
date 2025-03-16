import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import clsx from 'clsx';

// Define props with proper ref forwarding
interface BaseInputProps {
  label: string;
  error?: string;
  className?: string;
}

interface InputProps extends BaseInputProps, React.InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'password' | 'email' | 'number';
  multiline?: false;
}

interface TextareaProps extends BaseInputProps, React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  type?: never;
  multiline: true;
}

type CombinedInputProps = InputProps | TextareaProps;

// Use forwardRef to pass ref to the input/textarea
const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, CombinedInputProps>(
  (
    {
      label,
      error,
      type = 'text',
      multiline = false,
      className,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputType = type === 'password' && showPassword ? 'text' : type;

    const baseClassName = clsx(
      'w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500',
      error ? 'border-red-500' : 'border-gray-300',
      className
    );

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
          {multiline ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              className={`${baseClassName} min-h-[100px]`}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              type={inputType}
              className={baseClassName}
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          )}
          {type === 'password' && !multiline && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;