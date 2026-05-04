"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import HamburgerMenu from "@/components/auth/HamburgerMenu";
import bgImage from "@/Assets/Login-signup/login-signup-BG.png";
import logoImage from "@/Assets/nutado-logo.png";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden font-figtree">
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* ── Left Panel ── */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-black shrink-0">
        <Image src={bgImage} alt="Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/35" />
        {/* Dashed green border */}
        <div className="absolute inset-3 border-2 border-dashed border-green-500/55 pointer-events-none z-10" />

        {/* Hamburger + Logo */}
        <div className="absolute top-0 left-0 right-0 flex items-center gap-3 px-7 py-6 z-20">
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col gap-[5px] p-1 group shrink-0"
            aria-label="Open menu"
          >
            <span className="block w-6 h-[2px] bg-white group-hover:bg-green-400 transition-colors" />
            <span className="block w-5 h-[2px] bg-white group-hover:bg-green-400 transition-colors" />
            <span className="block w-6 h-[2px] bg-white group-hover:bg-green-400 transition-colors" />
          </button>
          <Image src={logoImage} alt="Nutado" height={34} className="object-contain" />
        </div>

        {/* Bottom tagline */}
        <div className="absolute bottom-0 left-0 right-0 px-10 pb-10 z-20">
          <h1 className="text-white font-bold text-4xl leading-snug mb-3">
            Every Home Deserves Better<br />Snacking
          </h1>
          <p className="text-white/55 text-[13px] leading-relaxed max-w-sm">
            Enim lobortis scelerisque fermentum dui faucibus. Sodales ut etiam sit amet nisl.
            Semper feugiat nibh sed pulvinar proin gravida facilisi morbi tempus iaculis
            pharetra convallis posuere morbi leo urna.
          </p>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex flex-col bg-white h-screen">
        {/* Mobile header */}
        <div className="flex items-center gap-3 px-6 py-4 lg:hidden">
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col gap-[5px] p-1"
          >
            <span className="block w-6 h-[2px] bg-gray-800" />
            <span className="block w-5 h-[2px] bg-gray-800" />
            <span className="block w-6 h-[2px] bg-gray-800" />
          </button>
          <Image src={logoImage} alt="Nutado" height={26} className="object-contain" />
        </div>

        {/* Centered form */}
        <div className="flex-1 flex flex-col items-center justify-center px-10 xl:px-16">
          <div className="w-full max-w-[440px]">
            {/* Title */}
            <h2 className="text-[#111827] font-extrabold text-5xl leading-[1.15] mb-9">
              Login To Your<br />Account
            </h2>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              {/* Work Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Work Email<span className="text-gray-700">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ethan.brown@example.com"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-11 text-sm text-gray-900 placeholder-gray-400 focus:border-[#0a6e3a] focus:outline-none focus:ring-1 focus:ring-[#0a6e3a] transition-colors"
                    required
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={17} />
                  </span>
                </div>
              </div>

              {/* Password */}
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
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-11 text-sm text-gray-900 placeholder-gray-400 focus:border-[#0a6e3a] focus:outline-none focus:ring-1 focus:ring-[#0a6e3a] transition-colors"
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

              {/* Remember me + Forgot */}
              <div className="flex items-center justify-between">
                <label
                  className="flex items-center gap-2 cursor-pointer select-none"
                  onClick={() => setRememberMe(!rememberMe)}
                >
                  <div
                    className={`w-[17px] h-[17px] rounded border-[1.5px] flex items-center justify-center transition-colors shrink-0 ${
                      rememberMe ? "bg-[#0a6e3a] border-[#0a6e3a]" : "border-gray-400 bg-white"
                    }`}
                  >
                    {rememberMe && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-gray-700">Remember me</span>
                </label>
                <Link href="#" className="text-sm text-gray-600 hover:text-[#0a6e3a] transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Sign In */}
              <button
                type="submit"
                className="w-full bg-[#1b5e38] hover:bg-[#134529] text-white font-semibold text-base py-[14px] rounded-lg transition-colors duration-200"
              >
                Sign In
              </button>
            </form>

            {/* Sign up link */}
            <p className="mt-7 text-center text-sm text-gray-500">
              New user?{" "}
              <Link href="/signup" className="font-semibold text-[#0a6e3a] hover:text-[#064d28] transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
