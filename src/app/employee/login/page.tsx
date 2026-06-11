"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import HamburgerMenu from "@/components/auth/HamburgerMenu";
import { useAuth } from "@/context/AuthContext";
import bgImage from "@/Assets/Login-signup/login-signup-BG.png";
import logoImage from "@/Assets/consueltudo-logo---.png";

export default function EmployeeLoginPage() {
  const router = useRouter();
  const { signIn, firebaseUser, profile, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading || !firebaseUser) return;
    if (profile?.role === "client") {
      router.replace("/user-dashboard");
      return;
    }
    router.replace("/dashboard");
  }, [firebaseUser, loading, profile?.role, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await signIn(email, password, "employee");
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="h-screen flex overflow-hidden font-figtree">
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-black shrink-0">
        <Image src={bgImage} alt="Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-3 border-2 border-dashed border-[#ec2626]/55 pointer-events-none z-10" />

        <div className="absolute top-0 left-0 right-0 flex items-center gap-3 px-7 py-6 z-20">
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col gap-[5px] p-1 group shrink-0"
            aria-label="Open menu"
          >
            <span className="block w-6 h-[2px] bg-white group-hover:bg-[#ec2626] transition-colors" />
            <span className="block w-5 h-[2px] bg-white group-hover:bg-[#ec2626] transition-colors" />
            <span className="block w-6 h-[2px] bg-white group-hover:bg-[#ec2626] transition-colors" />
          </button>
          <Image src={logoImage} alt="Consuetudo" height={55} className="object-contain" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-10 pb-10 z-20">
          <h1 className="text-white font-bold text-4xl leading-snug mb-3">
            Employee Control Room
          </h1>
          <p className="text-white/55 text-[13px] leading-relaxed max-w-sm">
            Use your employee account to manage orders, maintain product listings, build gift box bundles, and place orders for clients.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white h-screen">
        <div className="flex items-center gap-3 px-6 py-4 lg:hidden">
          <button onClick={() => setMenuOpen(true)} className="flex flex-col gap-[5px] p-1">
            <span className="block w-6 h-[2px] bg-gray-800" />
            <span className="block w-5 h-[2px] bg-gray-800" />
            <span className="block w-6 h-[2px] bg-gray-800" />
          </button>
          <Image src={logoImage} alt="Consuetudo" height={45} className="object-contain" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-10 xl:px-16">
          <div className="w-full max-w-[440px]">
            <div className="flex items-center justify-between mb-9">
              <h2 className="text-[#111827] font-extrabold text-3xl leading-[1.15]">
                Employee Login
              </h2>
              <Link href="/client/login" className="text-sm font-semibold text-[#ec2626]">
                Client login
              </Link>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Employee Email<span className="text-gray-700">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ops@nutado.com"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-11 text-sm text-gray-900 placeholder-gray-400 focus:border-[#ec2626] focus:outline-none focus:ring-1 focus:ring-[#ec2626] transition-colors"
                    required
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={17} />
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-11 text-sm text-gray-900 placeholder-gray-400 focus:border-[#ec2626] focus:outline-none focus:ring-1 focus:ring-[#ec2626] transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
              </div>

              <div>
                {error ? <p className="text-sm text-red-600">{error}</p> : null}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#b91c1c] hover:bg-[#7c0404] disabled:opacity-70 text-white font-semibold text-base py-[14px] rounded-lg transition-colors duration-200"
              >
                {submitting ? "Signing in..." : "Sign In"}
              </button>
            </form>
            
            <div className="mt-8 rounded-2xl bg-[#fff5f5] border border-[#ffe1e1] p-4">
              <p className="text-sm font-semibold text-[#ec2626]">
                Employee accounts should already exist in Firebase.
              </p>
              <p className="mt-1 text-sm text-gray-600">
                If a new team member needs access, create their auth account and user profile with role `employee` or `admin`.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
