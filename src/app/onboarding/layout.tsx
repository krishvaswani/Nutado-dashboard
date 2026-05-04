import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Settings, Bell, ChevronDown } from "lucide-react";
import { OnboardingProvider } from "@/context/OnboardingContext";
import logoImage from "@/Assets/nutado-logo-2.png";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col font-figtree">
      {/* ── Topbar ── */}
      <header className="bg-white px-6 h-[60px] flex items-center justify-between shrink-0">
        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-[5px] p-1">
            <span className="block w-5 h-[2px] bg-[#0a6e3a]" />
            <span className="block w-4 h-[2px] bg-[#0a6e3a]" />
            <span className="block w-5 h-[2px] bg-[#0a6e3a]" />
          </div>
          <Link href="/login">
            <Image src={logoImage} alt="Nutado" height={32} className="object-contain" />
          </Link>
        </div>

        {/* Right: icons + avatar */}
        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-gray-700 transition-colors">
            <Settings size={20} />
          </button>
          <button className="text-gray-500 hover:text-gray-700 transition-colors">
            <Bell size={20} />
          </button>
          <button className="flex items-center gap-1.5">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-amber-400 flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-semibold">P</span>
            </div>
            <ChevronDown size={14} className="text-gray-500" />
          </button>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 bg-[#f3f4f6] rounded-t-3xl">
        <OnboardingProvider>{children}</OnboardingProvider>
      </main>
    </div>
  );
}
