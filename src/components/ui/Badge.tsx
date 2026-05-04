type BadgeVariant = "green" | "blue" | "purple" | "orange" | "red" | "gray" | "amber";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  green:  "bg-green-50  text-green-700  border-green-200",
  blue:   "bg-blue-50   text-blue-700   border-blue-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
  orange: "bg-orange-50 text-orange-700 border-orange-200",
  red:    "bg-red-50    text-red-700    border-red-200",
  gray:   "bg-nutado-gray-100 text-nutado-gray-600 border-nutado-gray-200",
  amber:  "bg-amber-50  text-amber-700  border-amber-200",
};

const DOT_CLASSES: Record<BadgeVariant, string> = {
  green:  "bg-green-500",
  blue:   "bg-blue-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  red:    "bg-red-500",
  gray:   "bg-nutado-gray-400",
  amber:  "bg-amber-500",
};

export default function Badge({
  children,
  variant = "gray",
  dot = false,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full
        text-xs font-semibold border
        ${VARIANT_CLASSES[variant]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${DOT_CLASSES[variant]}`} />
      )}
      {children}
    </span>
  );
}
