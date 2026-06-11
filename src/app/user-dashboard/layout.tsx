"use client";

import { useEffect, useState } from "react";
import RoleGate from "@/components/auth/RoleGate";
import UserSidebar from "@/components/layout/UserSidebar";
import Topbar from "@/components/layout/Topbar";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const title = usePageTitle();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <RoleGate allowedRoles={["client"]} fallbackHref="/client/login">
      <div className="flex h-screen bg-nutado-gray-50 overflow-hidden">
        <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar onMenuClick={() => setSidebarOpen(true)} title={title} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </RoleGate>
  );
}
