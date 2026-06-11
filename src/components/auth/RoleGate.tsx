"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import type { AppRole } from "@/types";

interface RoleGateProps {
  allowedRoles: AppRole[];
  fallbackHref: string;
  children: React.ReactNode;
}

export default function RoleGate({
  allowedRoles,
  fallbackHref,
  children,
}: RoleGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { loading, profile } = useAuth();

  const allowedRolesStr = allowedRoles.join(",");

  useEffect(() => {
    console.log("🔒 [RoleGate] State Diagnostics:", { 
      loading, 
      profile: profile ? { name: profile.name, email: profile.email, role: profile.role } : null,
      allowedRoles
    });

    if (loading) return;

    if (!profile) {
      console.warn("🔒 [RoleGate] No active profile found. Redirecting to login fallback:", fallbackHref);
      router.replace(fallbackHref);
      return;
    }

    if (!allowedRoles.includes(profile.role)) {
      const destination = profile.role === "client" ? "/user-dashboard" : "/dashboard";
      console.warn(`🔒 [RoleGate] Profile role '${profile.role}' is not allowed in this area. Re-routing to appropriate home:`, destination);
      router.replace(destination);
    }
  }, [allowedRolesStr, fallbackHref, loading, profile, router]);

  if (loading || !profile || !allowedRoles.includes(profile.role)) {
    return <LoadingScreen message="Loading your workspace..." />;
  }

  return <>{children}</>;
}
