"use client";

import { useEffect, useState, useRef } from "react";
import { useOnboarding } from "@/context/OnboardingContext";
import { Check, Copy } from "lucide-react";

export default function OnboardingDraftStatus() {
  const { state, update } = useOnboarding();
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [savedText, setSavedText] = useState("just now");
  const [copied, setCopied] = useState(false);
  const isInitialMount = useRef(true);

  // Auto-save local draft & update timestamp when state changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setLastSaved(new Date());
    setSavedText("just now");

    try {
      localStorage.setItem("nutado_onboarding_draft", JSON.stringify(state));
    } catch (e) {
      console.error("Failed to auto-save local draft:", e);
    }
  }, [state]);

  // Update dynamic time text relative to last save timestamp
  useEffect(() => {
    const timer = setInterval(() => {
      const seconds = Math.floor((new Date().getTime() - lastSaved.getTime()) / 1000);
      if (seconds < 10) {
        setSavedText("just now");
      } else if (seconds < 60) {
        setSavedText(`${seconds} seconds ago`);
      } else {
        const minutes = Math.floor(seconds / 60);
        setSavedText(`${minutes} minute${minutes > 1 ? "s" : ""} ago`);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [lastSaved]);

  // Restore draft state from URL parameters or localStorage on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const draftParam = params.get("draft");
      if (draftParam) {
        const binaryString = atob(decodeURIComponent(draftParam));
        const utf8Bytes = Uint8Array.from(binaryString, char => char.charCodeAt(0));
        const decodedStr = new TextDecoder().decode(utf8Bytes);
        const decoded = JSON.parse(decodedStr);
        if (decoded && typeof decoded === "object") {
          update(decoded);
          return;
        }
      }

      // Fallback to localStorage if no URL query param exists
      const saved = localStorage.getItem("nutado_onboarding_draft");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          update(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to restore onboarding draft state:", e);
    }
  }, [update]);

  const copyToClipboardFallback = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; // Keep it offscreen
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    let success = false;
    try {
      success = document.execCommand("copy");
    } catch (err) {
      console.error("Fallback clipboard copying failed:", err);
    }
    document.body.removeChild(textArea);
    return success;
  };

  const handleCopyLink = async () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const customerId = searchParams.get("customerId") || "";

      // Secure Unicode encoding to base64
      const jsonStr = JSON.stringify(state);
      const utf8Bytes = new TextEncoder().encode(jsonStr);
      const binaryString = Array.from(utf8Bytes, byte => String.fromCharCode(byte)).join('');
      const serialized = encodeURIComponent(btoa(binaryString));
      const shareUrl = `${window.location.origin}${window.location.pathname}?customerId=${customerId}&draft=${serialized}`;

      let copySuccess = false;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(shareUrl);
          copySuccess = true;
        } catch (clipErr) {
          copySuccess = copyToClipboardFallback(shareUrl);
        }
      } else {
        copySuccess = copyToClipboardFallback(shareUrl);
      }

      if (copySuccess) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.error("Failed to copy shareable link to clipboard:", err);
    }
  };

  return (
    <div className="flex items-center gap-2.5 select-none">
      <button
        type="button"
        onClick={handleCopyLink}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold shadow-sm transition-all cursor-pointer ${
          copied
            ? "bg-[#ebfef2] border-green-300 text-green-700 scale-102"
            : "bg-white hover:bg-gray-50 border-gray-200 text-gray-700 active:scale-98"
        }`}
        title="Click to copy shareable checkout draft link"
      >
        {copied ? (
          <>
            <Check size={12} className="text-green-600 animate-bounce shrink-0" />
            <span>Draft Copied!</span>
          </>
        ) : (
          <>
            <Copy size={11} className="text-gray-400 shrink-0" />
            <span>Copy Shareable Link</span>
          </>
        )}
      </button>
      <span className="text-xs text-gray-400 font-medium">
        saved {savedText}
      </span>
    </div>
  );
}
