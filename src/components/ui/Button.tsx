import { Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize    = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-nutado-green text-white hover:bg-nutado-green-dark focus:ring-nutado-green",
  secondary:
    "border border-nutado-gray-300 bg-white text-nutado-gray-700 hover:bg-nutado-gray-50 focus:ring-nutado-green",
  ghost:
    "text-nutado-gray-600 hover:bg-nutado-gray-100 focus:ring-nutado-gray-400",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-5 py-2.5 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  children,
  disabled,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-semibold rounded-lg
        transition-all duration-200 active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:pointer-events-none
        ${VARIANT_CLASSES[variant]}
        ${SIZE_CLASSES[size]}
        ${className}
      `}
      {...rest}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : LeftIcon ? (
        <LeftIcon size={size === "sm" ? 13 : 15} />
      ) : null}
      {children}
      {!loading && RightIcon && <RightIcon size={size === "sm" ? 13 : 15} />}
    </button>
  );
}
