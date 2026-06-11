"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Settings, Bell, ChevronDown } from "lucide-react";
import { OnboardingProvider } from "@/context/OnboardingContext";
import RoleGate from "@/components/auth/RoleGate";
import logoImage from "@/Assets/consueltudo-logo---.png";
import { useAuth } from "@/context/AuthContext";
import HamburgerMenu from "@/components/auth/HamburgerMenu";
import { useRouter } from "next/navigation";

const NOTIFICATIONS = [
  { id: 1, text: "New order NTD-2024-08471 received",      time: "2m ago",  unread: true  },
  { id: 2, text: "Order NTD-2024-08392 has been shipped",  time: "1h ago",  unread: true  },
  { id: 3, text: "Order NTD-2024-08301 delivered",         time: "3h ago",  unread: false },
];

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [policyMenuOpen, setPolicyMenuOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { profile, signOut } = useAuth();

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "U";

  return (
    <RoleGate allowedRoles={["client", "employee", "admin"]} fallbackHref="/client/login">
      <div className="min-h-screen bg-white flex flex-col font-figtree relative">
        {/* Policies & Certificates slide drawer overlay */}
        <HamburgerMenu isOpen={policyMenuOpen} onClose={() => setPolicyMenuOpen(false)} />

        {/* ── Topbar ── */}
        <header className="bg-white px-6 h-[60px] flex items-center justify-between shrink-0 border-b border-nutado-gray-100">
          {/* Left: hamburger button (opens Policies & Certificates) + logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPolicyMenuOpen(true)}
              className="flex flex-col gap-[5px] p-2 hover:bg-nutado-gray-50 rounded-lg transition-colors cursor-pointer"
              aria-label="Open policies menu"
            >
              <span className="block w-5 h-[2px] bg-[#ec2626]" />
              <span className="block w-4 h-[2px] bg-[#ec2626]" />
              <span className="block w-5 h-[2px] bg-[#ec2626]" />
            </button>
            <Link href={profile?.role === "client" ? "/user-dashboard" : "/dashboard"}>
              <Image src={logoImage} alt="Consuetudo" height={44} className="object-contain" />
            </Link>
          </div>

          {/* Right: preferences + notifications + avatar */}
          <div className="flex items-center gap-4">
            {/* Settings Button */}
            <button
              onClick={() => {
                if (profile?.role === "client") {
                  router.push("/user-dashboard");
                } else {
                  router.push("/dashboard/settings");
                }
              }}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1.5 rounded-lg hover:bg-nutado-gray-50 cursor-pointer"
              title="Settings"
            >
              <Settings size={20} />
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-nutado-gray-100 hover:text-gray-900 transition-colors relative cursor-pointer"
                title="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              {showNotifs && (
                <>
                  {/* Click-away overlay */}
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-nutado-gray-200 shadow-elevated z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-nutado-gray-100 flex items-center justify-between">
                      <span className="font-semibold text-sm text-nutado-gray-900">Notifications</span>
                      <span className="text-xs font-semibold text-nutado-green bg-brand-50 px-2 py-0.5 rounded-full">{unreadCount} new</span>
                    </div>
                    <div className="divide-y divide-nutado-gray-100">
                      {NOTIFICATIONS.map((n) => (
                        <div
                          key={n.id}
                          className={`px-4 py-3 flex items-start gap-3 hover:bg-nutado-gray-50 transition-colors cursor-pointer ${n.unread ? "bg-brand-50/40" : ""}`}
                        >
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? "bg-nutado-green" : "bg-nutado-gray-300"}`} />
                          <div className="min-w-0">
                            <p className="text-sm text-nutado-gray-800">{n.text}</p>
                            <p className="text-xs text-nutado-gray-400 mt-0.5">{n.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 border-t border-nutado-gray-100 text-center">
                      <button className="text-xs font-semibold text-nutado-green hover:text-nutado-green-dark transition-colors">
                        View all notifications
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Avatar / Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-1.5 hover:opacity-90 transition-opacity focus:outline-none cursor-pointer"
                title="Profile Menu"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden bg-amber-400 flex items-center justify-center shrink-0 text-white text-sm font-bold select-none border border-amber-500 shadow-sm">
                  {initials}
                </div>
                <ChevronDown size={14} className="text-gray-500" />
              </button>

              {showProfileMenu && (
                <>
                  {/* Click-away overlay */}
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-nutado-gray-250 shadow-elevated z-50 overflow-hidden animate-slide-up">
                    {/* User Info Header */}
                    <div className="px-4 py-3 bg-nutado-gray-50 border-b border-nutado-gray-100">
                      <p className="text-xs font-bold text-nutado-gray-900 truncate">
                        {profile?.name ?? "User Account"}
                      </p>
                      <p className="text-[10px] text-nutado-gray-400 font-semibold truncate mt-0.5">
                        {profile?.email ?? "Sign in detail"}
                      </p>
                    </div>

                    {/* Dropdown Items */}
                    <div className="p-1.5 space-y-0.5">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          if (profile?.role === "client") {
                            router.push("/user-dashboard");
                          } else {
                            router.push("/dashboard");
                          }
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-nutado-gray-700 hover:text-nutado-green hover:bg-brand-50 rounded-lg transition-colors text-left"
                      >
                        Dashboard
                      </button>
                      {profile?.role !== "client" && (
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            router.push("/dashboard/settings");
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-nutado-gray-700 hover:text-nutado-green hover:bg-brand-50 rounded-lg transition-colors text-left"
                        >
                          Account Settings
                        </button>
                      )}
                      <button
                        onClick={async () => {
                          setShowProfileMenu(false);
                          await signOut();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-650 hover:bg-red-50 rounded-lg transition-colors text-left border-t border-nutado-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* ── Content ── */}
        <main className="flex-1 bg-[#f3f4f6] rounded-t-3xl overflow-y-auto">
          <OnboardingProvider>{children}</OnboardingProvider>
        </main>
      </div>
    </RoleGate>
  );
}
