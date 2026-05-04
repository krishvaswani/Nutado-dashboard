"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
}: ModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative bg-white rounded-2xl shadow-elevated w-full ${SIZE_CLASSES[size]} animate-slide-up`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || description) && (
          <div className="px-6 pt-6 pb-4 border-b border-nutado-gray-100">
            {title && (
              <h3 className="font-display font-bold text-lg text-nutado-gray-900 pr-8">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-nutado-gray-500 mt-1">{description}</p>
            )}
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-nutado-gray-400 hover:text-nutado-gray-700 hover:bg-nutado-gray-100 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
