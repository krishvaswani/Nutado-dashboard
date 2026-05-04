import type { LucideIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  onRightIconClick?: () => void;
}

export default function Input({
  label,
  hint,
  error,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onRightIconClick,
  className = "",
  id,
  ...rest
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-nutado-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {LeftIcon && (
          <LeftIcon
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-nutado-gray-400 pointer-events-none"
          />
        )}
        <input
          id={inputId}
          className={`
            w-full rounded-lg border text-sm text-nutado-gray-900 placeholder-nutado-gray-400
            transition-colors duration-150 focus:outline-none focus:ring-1
            ${error
              ? "border-red-400 focus:border-red-500 focus:ring-red-400"
              : "border-nutado-gray-300 focus:border-nutado-green focus:ring-nutado-green"
            }
            ${LeftIcon ? "pl-9" : "pl-4"}
            ${RightIcon ? "pr-10" : "pr-4"}
            py-2.5
            disabled:bg-nutado-gray-50 disabled:text-nutado-gray-400
            ${className}
          `}
          {...rest}
        />
        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-nutado-gray-400 hover:text-nutado-gray-700 transition-colors"
          >
            <RightIcon size={15} />
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 font-medium">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-nutado-gray-400">{hint}</p>
      )}
    </div>
  );
}
