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

export default function ClientSignupPage() {
  const router = useRouter();
  const { signUpClient, firebaseUser, profile, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    password: "",
    confirmPassword: "",
  });
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

  const inputCls =
    "w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#ec2626] focus:outline-none focus:ring-1 focus:ring-[#ec2626] transition-colors";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreedToTerms) {
      setError("Please accept the terms to continue.");
      return;
    }

    setSubmitting(true);

    try {
      await signUpClient(form);
      router.replace("/user-dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account.");
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
            Build Better
            <br />
            Gifting Workflows
          </h1>
          <p className="text-white/55 text-[13px] leading-relaxed max-w-sm">
            Create your client workspace once and use it to place orders, approve details, and keep your team aligned.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white h-screen overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-3 lg:hidden shrink-0">
          <button onClick={() => setMenuOpen(true)} className="flex flex-col gap-[5px] p-1">
            <span className="block w-6 h-[2px] bg-gray-800" />
            <span className="block w-5 h-[2px] bg-gray-800" />
            <span className="block w-6 h-[2px] bg-gray-800" />
          </button>
          <Image src={logoImage} alt="Consuetudo" height={45} className="object-contain" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-10 xl:px-16 py-4">
          <div className="w-full max-w-[500px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#111827] font-extrabold text-3xl leading-[1.15]">
                Create Client Account
              </h2>
              <Link href="/employee/login" className="text-sm font-semibold text-[#ec2626]">
                Employee login
              </Link>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    First Name<span className="text-gray-700">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    className={inputCls}
                    value={form.firstName}
                    onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className={inputCls}
                    value={form.lastName}
                    onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Work Email<span className="text-gray-700">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="ethan.brown@example.com"
                    className={`${inputCls} pr-10`}
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={15} />
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  className={inputCls}
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Company Name</label>
                <input
                  type="text"
                  placeholder="Your Company Pvt. Ltd."
                  className={inputCls}
                  value={form.company}
                  onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password<span className="text-gray-700">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    className={`${inputCls} pr-10`}
                    value={form.password}
                    onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Confirm Password<span className="text-gray-700">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter password"
                    className={`${inputCls} pr-10`}
                    value={form.confirmPassword}
                    onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
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

              <div className="flex items-start gap-2">
                <div
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                  className={`mt-0.5 w-4 h-4 rounded border-[1.5px] flex items-center justify-center cursor-pointer shrink-0 transition-colors ${
                    agreedToTerms ? "bg-[#ec2626] border-[#ec2626]" : "border-gray-400 bg-white"
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
                  <span className="text-[#ec2626] font-semibold">Terms of Service</span>
                  {" "}and{" "}
                  <span className="text-[#ec2626] font-semibold">Privacy Policy</span>
                </span>
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#b91c1c] hover:bg-[#7c0404] disabled:opacity-70 text-white font-semibold text-base py-[14px] rounded-lg transition-colors duration-200"
              >
                {submitting ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-gray-500">
              Already have an account?{" "}
              <Link href="/client/login" className="font-semibold text-[#ec2626] hover:text-[#c81010] transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
