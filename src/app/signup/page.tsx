"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import HamburgerMenu from "@/components/auth/HamburgerMenu";
import bgImage from "@/Assets/Login-signup/login-signup-BG.png";
import logoImage from "@/Assets/nutado-logo.png";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const inputCls =
    "w-full rounded-lg border border-gray-300 px-3.5 py-2 text-[13px] text-gray-900 placeholder-gray-400 focus:border-[#0a6e3a] focus:outline-none focus:ring-1 focus:ring-[#0a6e3a] transition-colors";

  return (
    <div className="h-screen flex overflow-hidden font-figtree">
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* ── Left Panel ── */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-black shrink-0">
        <Image src={bgImage} alt="Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/35" />
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
      <div className="flex-1 flex flex-col bg-white h-screen overflow-hidden">
        {/* Mobile header */}
        <div className="flex items-center gap-3 px-6 py-3 lg:hidden shrink-0">
          <button onClick={() => setMenuOpen(true)} className="flex flex-col gap-[5px] p-1">
            <span className="block w-6 h-[2px] bg-gray-800" />
            <span className="block w-5 h-[2px] bg-gray-800" />
            <span className="block w-6 h-[2px] bg-gray-800" />
          </button>
          <Image src={logoImage} alt="Nutado" height={24} className="object-contain" />
        </div>

        {/* Centered form — no scroll */}
        <div className="flex-1 flex flex-col items-center justify-center px-10 xl:px-16 py-4">
          <div className="w-full max-w-[440px]">
            {/* Title */}
            <h2 className="text-[#111827] font-extrabold text-4xl leading-tight mb-6">
              Create Your Account
            </h2>

            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    First Name<span className="text-gray-700">*</span>
                  </label>
                  <input type="text" placeholder="John" className={inputCls} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name</label>
                  <input type="text" placeholder="Doe" className={inputCls} />
                </div>
              </div>

              {/* Work Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Work Email<span className="text-gray-700">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="ethan.brown@example.com"
                    className={`${inputCls} pr-10`}
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={15} />
                  </span>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                <input type="tel" placeholder="+91 98765 43210" className={inputCls} />
              </div>

              {/* Company */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Company Name</label>
                <input type="text" placeholder="Your Company Pvt. Ltd." className={inputCls} />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password<span className="text-gray-700">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    className={`${inputCls} pr-10`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Confirm Password<span className="text-gray-700">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter password"
                    className={`${inputCls} pr-10`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirm ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2">
                <div
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                  className={`mt-0.5 w-4 h-4 rounded border-[1.5px] flex items-center justify-center cursor-pointer shrink-0 transition-colors ${
                    agreedToTerms ? "bg-[#0a6e3a] border-[#0a6e3a]" : "border-gray-400 bg-white"
                  }`}
                >
                  {agreedToTerms && (
                    <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-xs text-gray-600">
                  I agree to the{" "}
                  <Link href="#" className="text-[#0a6e3a] font-semibold hover:underline">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="#" className="text-[#0a6e3a] font-semibold hover:underline">Privacy Policy</Link>
                </span>
              </div>

              {/* Create Account */}
              <button
                type="submit"
                className="w-full bg-[#1b5e38] hover:bg-[#134529] text-white font-semibold text-sm py-[13px] rounded-lg transition-colors duration-200"
              >
                Create Account
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[#0a6e3a] hover:text-[#064d28] transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
