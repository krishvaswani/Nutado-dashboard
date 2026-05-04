import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  emoji?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon: Icon,
  emoji,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 bg-nutado-gray-100 rounded-2xl flex items-center justify-center mb-4">
        {emoji ? (
          <span className="text-3xl">{emoji}</span>
        ) : Icon ? (
          <Icon size={28} className="text-nutado-gray-400" />
        ) : null}
      </div>
      <h3 className="font-display font-semibold text-nutado-gray-900 text-lg mb-2">
        {title}
      </h3>
      <p className="text-sm text-nutado-gray-500 max-w-xs leading-relaxed mb-6">
        {description}
      </p>
      {action}
    </div>
  );
}
