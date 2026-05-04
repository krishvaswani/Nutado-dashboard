import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
  hint?: string;
}

export default function Select({
  options,
  label,
  hint,
  className = "",
  ...rest
}: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-nutado-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`
            w-full appearance-none rounded-lg border border-nutado-gray-300 bg-white
            px-4 py-2.5 pr-10 text-sm text-nutado-gray-900
            focus:border-nutado-green focus:outline-none focus:ring-1 focus:ring-nutado-green
            transition-colors duration-150
            disabled:bg-nutado-gray-50 disabled:text-nutado-gray-400
            ${className}
          `}
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={15}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-nutado-gray-400 pointer-events-none"
        />
      </div>
      {hint && (
        <p className="text-xs text-nutado-gray-400">{hint}</p>
      )}
    </div>
  );
}
