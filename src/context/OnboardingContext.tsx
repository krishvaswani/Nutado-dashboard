"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { OnboardingState } from "@/types";

const DEFAULT_STATE: OnboardingState = {
  companyName: "",
  industry: "",
  contactPerson: "",
  clientEmail: "",
  occasions: [],
  categories: [],
  products: [],
  bundleSize: "medium",
  quantity: 50,
  brandName: "",
  tagline: "",
  primaryColor: "#ec2626",
  logoUrl: undefined,
  message: "",
  messageTemplate: "warm-festive",
  logoChoice: "Yes - share logo after submission",
  ribbonTheme: "Gold (Signature)",
};

interface OnboardingContextValue {
  state: OnboardingState;
  update: (patch: Partial<OnboardingState>) => void;
  reset: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OnboardingState>(DEFAULT_STATE);

  const update = useCallback((patch: Partial<OnboardingState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  return (
    <OnboardingContext.Provider value={{ state, update, reset }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}
