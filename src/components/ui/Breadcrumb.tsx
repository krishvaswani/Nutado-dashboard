import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm flex-wrap">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center gap-1.5">
            {index > 0 && (
              <ChevronRight size={13} className="text-nutado-gray-300 flex-shrink-0" />
            )}
            {isLast || !item.href ? (
              <span className={`font-medium ${isLast ? "text-nutado-gray-900" : "text-nutado-gray-500"}`}>
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-nutado-gray-500 hover:text-nutado-green transition-colors font-medium"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
