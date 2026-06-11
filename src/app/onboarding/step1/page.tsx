"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronRight, ChevronDown } from "lucide-react";
import OnboardingStepper from "@/components/onboarding/OnboardingStepper";
import { useOnboarding } from "@/context/OnboardingContext";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile } from "@/lib/firebase/firestore";
import OnboardingDraftStatus from "@/components/onboarding/OnboardingDraftStatus";

const INDUSTRIES = [
  "Technology",
  "Retail",
  "Food & Beverage",
  "Healthcare",
  "Finance & Banking",
  "Education",
  "Manufacturing",
  "Hospitality",
  "Real Estate",
  "Other",
];

const inputCls =
  "w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-[#ec2626] focus:outline-none focus:ring-1 focus:ring-[#ec2626] transition-colors bg-white";

function OnboardingStep1Content() {
  const { state, update } = useOnboarding();
  const { profile } = useAuth();
  const searchParams = useSearchParams();
  const customerId = searchParams.get("customerId");
  const [industryOpen, setIndustryOpen] = useState(false);

  useEffect(() => {
    if (!profile || profile.role !== "client") return;

    update({
      companyName: state.companyName || profile.company || "",
      contactPerson: state.contactPerson || profile.name || "",
      clientEmail: state.clientEmail || profile.email || "",
    });
  }, [profile, state.clientEmail, state.companyName, state.contactPerson, update]);

  useEffect(() => {
    if (!customerId) return;

    async function fetchCustomerDetails() {
      try {
        const clientProfile = await getUserProfile(customerId as string);
        if (clientProfile) {
          update({
            companyName: clientProfile.company || "",
            contactPerson: clientProfile.name || "",
            clientEmail: clientProfile.email || "",
          });
        }
      } catch (err) {
        console.error("Failed to prefetch client profile for onboarding:", err);
      }
    }
    
    fetchCustomerDetails();
  }, [customerId, update]);

  const homeHref = profile?.role === "client" ? "/user-dashboard" : "/dashboard";
  const needsClientEmail = profile?.role === "employee" || profile?.role === "admin";
  const canProceed =
    state.companyName.trim() &&
    state.contactPerson.trim() &&
    state.quantity > 0 &&
    (!needsClientEmail || state.clientEmail.trim());

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col">
      <div className="max-w-[1400px] w-full mx-auto">
        <OnboardingStepper currentStep={1} />
      </div>

      <div className="flex-1 max-w-[1400px] w-full mx-auto px-8 pb-28 pt-6">
        <div className="text-center mb-10">
          <h1 className="text-[#ec2626] font-bold text-2xl mb-2">
            Tell Us About This Order
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            We’ll use these details to create one shared order record for the client and operations teams.
          </p>
        </div>

        <div className="max-w-[1400px] mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-4 overflow-hidden">
            <div className="px-6 py-5">
              <p className="text-[#ec2626] text-xs font-bold uppercase tracking-widest mb-5">
                Company &amp; Contact
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Company Name<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    value={state.companyName}
                    onChange={(e) => update({ companyName: e.target.value })}
                    placeholder="Acme Pvt. Ltd."
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Industry
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIndustryOpen(!industryOpen)}
                      className={`${inputCls} flex items-center justify-between text-left ${
                        state.industry ? "text-gray-800" : "text-gray-400"
                      } ${industryOpen ? "border-[#ec2626] ring-1 ring-[#ec2626]" : ""}`}
                    >
                      <span>{state.industry || "Select industry"}</span>
                      <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform shrink-0 ${industryOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {industryOpen && (
                      <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                        {INDUSTRIES.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              update({ industry: item });
                              setIndustryOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                              state.industry === item
                                ? "text-[#ec2626] font-semibold bg-red-50"
                                : "text-gray-700"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Contact Person<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    value={state.contactPerson}
                    onChange={(e) => update({ contactPerson: e.target.value })}
                    placeholder="Priya Mehta"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Client Email{needsClientEmail ? <span className="text-red-500 ml-0.5">*</span> : null}
                  </label>
                  <input
                    type="email"
                    value={state.clientEmail}
                    onChange={(e) => update({ clientEmail: e.target.value })}
                    placeholder="client@company.com"
                    className={inputCls}
                    disabled={profile?.role === "client"}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5">
              <p className="text-[#ec2626] text-xs font-bold uppercase tracking-widest mb-5">
                Order Essentials
              </p>

              <div className="w-full md:w-1/2 pr-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  No. of Gift Boxes<span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="number"
                  value={state.quantity}
                  onChange={(e) => update({ quantity: Number(e.target.value) || 0 })}
                  placeholder="e.g. 100"
                  min={1}
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
          <Link
            href={homeHref}
            className="text-sm font-semibold text-[#e05c1a] hover:text-[#c04d10] underline underline-offset-2 transition-colors"
          >
            Cancel
          </Link>
          <OnboardingDraftStatus />
        </div>

        <Link
          href="/onboarding/step2"
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-white transition-all duration-200 ${
            canProceed
              ? "bg-[#b91c1c] hover:bg-[#7c0404]"
              : "bg-[#b91c1c]/60 pointer-events-none"
          }`}
        >
          Next
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}

export default function OnboardingStep1() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full border-4 border-t-[#ec2626] border-gray-200 animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading onboarding details...</p>
        </div>
      </div>
    }>
      <OnboardingStep1Content />
    </Suspense>
  );
}
