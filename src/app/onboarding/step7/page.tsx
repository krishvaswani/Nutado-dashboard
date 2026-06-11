"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OnboardingStepper from "@/components/onboarding/OnboardingStepper";
import { useOnboarding } from "@/context/OnboardingContext";
import { useAuth } from "@/context/AuthContext";
import { createOrder, getUserProfileByEmail, subscribeProducts, upsertUserProfile } from "@/lib/firebase/firestore";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import OnboardingDraftStatus from "@/components/onboarding/OnboardingDraftStatus";

// Import Box Presets
import box1 from "@/Assets/Slide3/box1.png";
import box2 from "@/Assets/Slide3/box 2.png";
import box3 from "@/Assets/Slide3/box3.png";
import box4 from "@/Assets/Slide3/box4.png";
import box5 from "@/Assets/Slide3/box5.png";
import box6 from "@/Assets/Slide3/box6.png";
import box7 from "@/Assets/Slide3/box7.png";
import box8 from "@/Assets/Slide3/box8.png";

const BOX_IMAGES: Record<number, any> = {
  1: box1,
  2: box2,
  3: box3,
  4: box4,
  5: box5,
  6: box6,
  7: box7,
  8: box8,
};

export default function OnboardingStep7() {
  const router = useRouter();
  const { state, update, reset } = useOnboarding();
  const { profile } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [productsList, setProductsList] = useState<any[]>(MOCK_PRODUCTS);

  useEffect(() => {
    const unsub = subscribeProducts((data) => {
      setProductsList(data);
    });
    return () => unsub();
  }, []);

  const selectedProducts = productsList.filter((product) =>
    state.products.some((id) => String(id) === String(product.id))
  );

  const unitPrice =
    state.boxType === "signature"
      ? 699
      : Math.max(
          449,
          selectedProducts.reduce((sum, product) => sum + product.price, 0),
        );
  const subtotal = unitPrice * state.quantity;
  const packaging = 1500;
  const gst = Math.round((subtotal + packaging) * 0.18);
  const total = subtotal + packaging + gst;

  async function handleConfirm() {
    if (!profile) return;

    setSubmitting(true);
    setError("");

    try {
      let linkedClient =
        profile.role === "client"
          ? profile
          : await getUserProfileByEmail(state.clientEmail.trim().toLowerCase());

      if (!linkedClient) {
        // Automatically create a client profile in Firestore for this new email!
        const newClientId = "client_" + Math.random().toString(36).substring(2, 11);
        const newClientProfile = {
          uid: newClientId,
          email: state.clientEmail.trim().toLowerCase(),
          name: state.contactPerson || state.clientEmail.split("@")[0],
          company: state.companyName || "Individual",
          phone: "",
          role: "client" as const,
          createdAt: new Date().toISOString(),
          status: "active",
          password: "password123", // default password
        };
        try {
          await upsertUserProfile(newClientProfile);
        } catch (dbErr) {
          console.warn("Firestore rules restricted profile upsert. Proceeding with order creation.", dbErr);
        }
        linkedClient = newClientProfile;
      }

      const order = await createOrder({
        customer: state.contactPerson || linkedClient.name,
        company: state.companyName || linkedClient.company,
        quantity: state.quantity,
        occasion: state.occasions[0] || "Corporate Gifting",
        total,
        items: state.boxType === "custom" ? selectedProducts.length : 1,
        createdByUid: profile.uid,
        createdByRole: profile.role,
        customerId: linkedClient.uid,
        boxType: state.boxType,
        signatureBoxId: state.signatureBoxId,
        products: selectedProducts.map((product) => ({
          id: product.id,
          name: product.name,
          brand: product.brand,
        })),
        industry: state.industry,
        message: state.message,
        messageTemplate: state.messageTemplate,
        logoChoice: state.logoChoice,
        ribbonTheme: state.ribbonTheme,
      });

      update({ orderReference: order.orderNumber });
      reset();
      router.push(`/onboarding/step8?order=${order.id}&reference=${order.orderNumber}`);
    } catch (err) {
      if (err instanceof Error && err.message.toLowerCase().includes("permission")) {
        setError("Missing database permissions. Please contact your system administrator to ensure your employee role has write access.");
      } else {
        setError(err instanceof Error ? err.message : "Unable to create order.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const activeBoxImage = BOX_IMAGES[Number(state.signatureBoxId) || 1] || box1;
  const activeBoxLabel = state.boxType === "custom" ? "CUSTOM BOX" : `BOX NO ${state.signatureBoxId ?? 1}`;
  const firstOccasion = state.occasions[0] || "Corporate Gifting";
  const homeHref = profile?.role === "client" ? "/user-dashboard" : "/dashboard";

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col font-figtree">
      <div className="max-w-[1400px] w-full mx-auto shrink-0">
        <OnboardingStepper currentStep={7} />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-[1400px] w-full mx-auto px-8 pt-3 pb-24">
          {/* Title block */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[#ec2626] mb-2">
              Almost There — Review &amp; Confirm
            </h1>
            <p className="text-gray-500 text-sm">
              Take a final look at your gifting brief. Once confirmed, our team gets to work immediately.
            </p>
          </div>

          <div className="space-y-6">
            {/* Enquiry Summary Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-[#ec2626] font-bold text-xs uppercase tracking-wider">
                  ENQUIRY SUMMARY — CONSUETUDO CORPORATE GIFTING
                </h2>
              </div>

              <div className="divide-y divide-gray-150">
                {/* Occasion Row */}
                <div className="px-6 py-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-500">Occasion</span>
                  <span className="text-sm font-bold text-[#ec2626] capitalize">{firstOccasion}</span>
                </div>

                {/* Box Type Row */}
                <div className="px-6 py-4 flex flex-col gap-2.5">
                  <span className="text-sm font-semibold text-gray-500">Box Type</span>
                  <div className="flex items-center gap-3.5 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 w-fit shrink-0">
                    <div className="w-14 h-14 relative rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-white border border-gray-150">
                      <Image src={activeBoxImage} alt={activeBoxLabel} fill className="object-contain p-1" />
                    </div>
                    <span className="text-sm font-extrabold text-gray-800 tracking-wide uppercase">
                      {activeBoxLabel}
                    </span>
                  </div>
                </div>

                {/* Box Capacity Row */}
                <div className="px-6 py-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-500">Box Capacity</span>
                  <span className="text-sm font-bold text-[#ec2626]">{selectedProducts.length || 8} products</span>
                </div>

                {/* Selected Products Grid Row */}
                {selectedProducts.length > 0 && (
                  <div className="px-6 py-4 flex flex-col gap-3">
                    <span className="text-sm font-semibold text-gray-500">Products</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-3 px-3 py-2 border border-gray-100 rounded-xl bg-white shadow-xs"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-50 relative flex items-center justify-center border border-gray-100">
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-lg">🍪</span>
                            )}
                          </div>
                          <span className="text-[10px] font-bold text-gray-700 tracking-tight leading-snug uppercase truncate">
                            {product.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Row */}
                <div className="px-6 py-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-500">Quantity</span>
                  <span className="text-sm font-bold text-[#ec2626]">{state.quantity} boxes</span>
                </div>

                {/* Gift Card Row */}
                <div className="px-6 py-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-500">Gift Card</span>
                  <span className="text-sm font-bold text-[#ec2626] capitalize">{state.messageTemplate === "gift-card" ? "Festive Crimson" : state.messageTemplate || "Festive Crimson"}</span>
                </div>

                {/* Message Row */}
                <div className="px-6 py-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-500">Message</span>
                  <span className="text-sm font-medium text-[#ec2626] italic truncate max-w-[280px] md:max-w-md">
                    &ldquo;{state.message || "Wishing you joy and abundance this festive season. With heartfelt gratitude..."}&rdquo;
                  </span>
                </div>

                {/* Packaging Row */}
                <div className="px-6 py-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-500">Packaging</span>
                  <span className="text-sm font-bold text-[#ec2626]">{state.ribbonTheme || "Gold (Signature)"}</span>
                </div>
              </div>
            </div>

            {/* Gift Card Showcase Summary Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-[#ec2626] font-bold text-xs uppercase tracking-wider">
                  ENQUIRY SUMMARY — CONSUETUDO CORPORATE GIFTING
                </h2>
              </div>

              {/* Content area */}
              <div className="p-6 flex flex-col sm:flex-row items-center gap-5">
                {/* Horizontal Premium CSS Gift Card */}
                <div className="w-[180px] h-[100px] rounded-2xl relative overflow-hidden bg-[#1a1a1a] border border-gray-800 p-3 shadow-md flex flex-col justify-between text-white shrink-0">
                  {/* Crossed red ribbon */}
                  <div className="absolute top-0 bottom-0 left-[72%] w-[14px] bg-[#c0392b]" />
                  <div className="absolute left-0 right-0 top-[42%] h-[14px] bg-[#c0392b]" />
                  
                  {/* Ribbon Bow SVG overlay */}
                  <svg className="absolute top-[22%] left-[64%] w-9 h-9 drop-shadow-md text-[#e74c3c]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 9c.5 0 1-.2 1.4-.6.6-.6 1-1.5 1-2.4 0-1.8-1.4-3-3.2-3-.7 0-1.4.3-1.8.8-.4-.5-1.1-.8-1.8-.8-1.8 0-3.2 1.2-3.2 3 0 1 .4 1.8 1 2.4.4.4.9.6 1.4.6.4 0 .8-.1 1.2-.3L12 9zm-1.8-4.6c.3-.3.7-.4 1-.4.8 0 1.4.6 1.4 1.4 0 .4-.2.8-.5 1.1-.3.3-.7.5-1.1.5-.1 0-.2 0-.3-.1l-1.3-1.3c.3-.5.5-.9.8-1.2zm-.8 2.5c-.4-.3-.6-.7-.6-1.1 0-.8.6-1.4 1.4-1.4.3 0 .7.1 1 .4.3.3.5.7.8 1.2L10.7 7.3c-.1.1-.2.1-.3.1-.4 0-.8-.2-1.2-.5zm3.6 5.1L12 11l-1 .8c-.6.5-1 .8-1.5 1.1-.5.3-1.1.5-1.7.5-.9 0-1.8-.4-2.4-1-.6-.6-1-1.5-1-2.4 0-1.8 1.4-3.2 3.2-3.2.7 0 1.4.3 1.8.8.4-.5 1.1-.8 1.8-.8 1.8 0 3.2 1.4 3.2 3.2 0 1-.4 1.8-1 2.4-.6.6-1.5 1-2.4 1-.6 0-1.2-.2-1.7-.5-.5-.3-.9-.6-1.5-1.1z" />
                  </svg>

                  <div className="z-10 text-[8px] font-bold tracking-widest text-white/40">GIFT CARD</div>
                  <div className="z-10">
                    <div className="text-[10px] font-bold text-white/90">Consuetudo Premium</div>
                    <div className="text-[7px] text-white/50 tracking-wider">CORPORATE GIFTING</div>
                  </div>
                </div>

                {/* Showcase text stack */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-base font-bold text-gray-800 leading-snug mb-1">
                    {state.messageTemplate === "gift-card" ? "Festive Crimson" : state.messageTemplate || "Festive Crimson"} — Auto-matched for {firstOccasion}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium">
                    Selected based on your {firstOccasion} occasion
                  </p>
                </div>
              </div>
            </div>

            {error ? <p className="text-sm text-red-600 px-1">{error}</p> : null}
          </div>
        </div>
      </div>

      {/* Bottom wizard footer */}
      <div className="bg-white border-t border-gray-200 shrink-0">
        <div className="max-w-[1400px] mx-auto px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={homeHref}
              className="text-sm font-semibold text-[#e05c1a] hover:text-[#c04d10] underline underline-offset-2 transition-colors"
            >
              Cancel
            </Link>
            <OnboardingDraftStatus />
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/onboarding/step6"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold text-sm text-gray-800 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Back
            </Link>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm text-white bg-[#b91c1c] hover:bg-[#7c0404] transition-all disabled:opacity-70 cursor-pointer shadow-sm"
            >
              {submitting ? "Submitting Inquiry..." : "Submit Inquiry"}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
