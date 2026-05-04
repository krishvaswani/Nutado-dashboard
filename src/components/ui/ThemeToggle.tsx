"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme, type Theme } from "@/hooks/useTheme";

const OPTIONS: { value: Theme; icon: typeof Sun; label: string }[] = [
  { value: "light",  icon: Sun,     label: "Light"  },
  { value: "dark",   icon: Moon,    label: "Dark"   },
  { value: "system", icon: Monitor, label: "System" },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 bg-nutado-gray-100 rounded-lg p-1">
      {OPTIONS.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          title={label}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
            theme === value
              ? "bg-white text-nutado-green shadow-sm"
              : "text-nutado-gray-500 hover:text-nutado-gray-700"
          }`}
        >
          <Icon size={13} />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
