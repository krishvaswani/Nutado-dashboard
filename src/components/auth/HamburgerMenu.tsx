"use client";

import { X, FileText, Shield, Cookie, Award, BadgeCheck, FileCheck } from "lucide-react";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const policies = [
  { icon: Shield, label: "Privacy Policy", href: "#privacy-policy" },
  { icon: FileText, label: "Terms of Service", href: "#terms-of-service" },
  { icon: Cookie, label: "Cookie Policy", href: "#cookie-policy" },
  { icon: FileCheck, label: "Refund Policy", href: "#refund-policy" },
];

const certificates = [
  { icon: Award, label: "FSSAI Certified", href: "#fssai" },
  { icon: BadgeCheck, label: "ISO 22000:2018", href: "#iso" },
  { icon: BadgeCheck, label: "HACCP Compliant", href: "#haccp" },
];

export default function HamburgerMenu({ isOpen, onClose }: HamburgerMenuProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-[#0a1a0f] z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <span className="text-white font-bold text-lg tracking-wide">Menu</span>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* Policies */}
          <div>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">
              Policies
            </p>
            <ul className="space-y-1">
              {policies.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm"
                  >
                    <Icon size={16} className="text-green-400 shrink-0" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Certificates */}
          <div>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">
              Certificates
            </p>
            <ul className="space-y-1">
              {certificates.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm"
                  >
                    <Icon size={16} className="text-green-400 shrink-0" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-white/10">
          <p className="text-white/30 text-xs text-center">© 2024 Nutado. All rights reserved.</p>
        </div>
      </div>
    </>
  );
}
