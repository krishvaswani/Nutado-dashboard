"use client";

import {
  ConfirmationResult,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signOut as firebaseSignOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { auth, hasFirebaseEnv } from "@/lib/firebase/client";
import { getUserProfile, upsertUserProfile, getUserProfileByEmail } from "@/lib/firebase/firestore";
import type { AppRole, AuthProfile } from "@/types";

interface SignUpClientInput {
  firstName: string;
  lastName?: string;
  company: string;
  phone?: string;
  email: string;
  password: string;
}

interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  profile: AuthProfile | null;
  loading: boolean;
  signIn: (email: string, password: string, expectedRole?: AppRole) => Promise<void>;
  requestPhoneOtp: (
    phoneNumber: string,
    recaptchaContainerId: string,
  ) => Promise<void>;
  verifyPhoneOtp: (code: string, expectedRole?: AppRole) => Promise<void>;
  signUpClient: (input: SignUpClientInput) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function buildName(firstName: string, lastName?: string) {
  return [firstName, lastName].filter(Boolean).join(" ").trim();
}

function buildFallbackProfile(user: FirebaseUser): AuthProfile {
  return {
    uid: user.uid,
    email: user.email ?? "",
    name: user.displayName ?? "Client User",
    company: "",
    role: "client",
    createdAt: new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);
  const phoneConfirmationRef = useRef<ConfirmationResult | null>(null);

  useEffect(() => {
    // 4-second safety fallback to prevent permanent loading UI on blocked/slow Firebase connections
    const timer = setTimeout(() => {
      setLoading((curr) => {
        if (curr) {
          console.warn("Firebase Auth initialization timed out. Invoking fallback loading resolution.");
          return false;
        }
        return curr;
      });
    }, 4000);

    if (!auth || !hasFirebaseEnv) {
      setLoading(false);
      clearTimeout(timer);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      console.log("🔑 [AuthContext] Firebase auth state changed. User:", nextUser ? { uid: nextUser.uid, email: nextUser.email } : "Logged Out");
      try {
        setFirebaseUser(nextUser);

        if (!nextUser) {
          setProfile(null);
          setLoading(false);
          clearTimeout(timer);
          return;
        }

        const nextProfile = await getUserProfile(nextUser.uid);
        console.log("🔑 [AuthContext] Firestore profile fetched:", nextProfile);
        setProfile(nextProfile ?? buildFallbackProfile(nextUser));
      } catch (err) {
        console.error("🔑 [AuthContext] Error loading user profile, using fallback profile:", err);
        if (nextUser) {
          setProfile(buildFallbackProfile(nextUser));
        } else {
          setProfile(null);
        }
      } finally {
        setLoading(false);
        clearTimeout(timer);
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      firebaseUser,
      profile,
      loading,
      async signIn(email, password, expectedRole) {
        try {
          const profileByEmail = await getUserProfileByEmail(email.trim().toLowerCase());
          if (profileByEmail && (profileByEmail as any).password === password) {
            if (expectedRole && profileByEmail.role !== expectedRole && profileByEmail.role !== "admin") {
              throw new Error(`This login is only available for ${expectedRole} accounts.`);
            }
            setProfile(profileByEmail);
            return;
          }
        } catch (e) {
          console.warn("Direct credentials lookup skipped:", e);
        }

        if (!auth || !hasFirebaseEnv) {
          throw new Error("Firebase environment variables are missing.");
        }

        const credential = await signInWithEmailAndPassword(auth, email, password);
        const nextProfile = await getUserProfile(credential.user.uid);

        if (!nextProfile) {
          if (expectedRole === "client") {
            setProfile(buildFallbackProfile(credential.user));
            return;
          }

          await firebaseSignOut(auth);
          throw new Error(
            "Your employee profile was not found in Firestore. Ask admin to create it.",
          );
        }

        if (expectedRole && nextProfile.role !== expectedRole && nextProfile.role !== "admin") {
          await firebaseSignOut(auth);
          throw new Error(`This login is only available for ${expectedRole} accounts.`);
        }

        setProfile(nextProfile);
      },
      async requestPhoneOtp(phoneNumber, recaptchaContainerId) {
        if (!auth || !hasFirebaseEnv) {
          throw new Error("Firebase environment variables are missing.");
        }

        let normalizedPhone = phoneNumber.trim();
        if (normalizedPhone.startsWith("+")) {
          // Clean non-digit characters except the leading "+"
          normalizedPhone = "+" + normalizedPhone.substring(1).replace(/\D/g, "");
        } else {
          let digits = normalizedPhone.replace(/\D/g, "");
          // Remove leading zero if they typed it (e.g. 09876543210 -> 9876543210)
          if (digits.startsWith("0")) {
            digits = digits.substring(1);
          }
          
          if (digits.length === 10) {
            // Default to India country code
            normalizedPhone = "+91" + digits;
          } else if (digits.length === 12 && digits.startsWith("91")) {
            normalizedPhone = "+" + digits;
          } else {
            // Fallback: prepend +91 to whatever digits they input
            normalizedPhone = "+91" + digits;
          }
        }

        if (recaptchaRef.current) {
          recaptchaRef.current.clear();
          recaptchaRef.current = null;
        }

        recaptchaRef.current = new RecaptchaVerifier(auth, recaptchaContainerId, {
          size: "invisible",
        });

        phoneConfirmationRef.current = await signInWithPhoneNumber(
          auth,
          normalizedPhone,
          recaptchaRef.current,
        );
      },
      async verifyPhoneOtp(code, expectedRole) {
        if (!auth || !hasFirebaseEnv) {
          throw new Error("Firebase environment variables are missing.");
        }

        const confirmation = phoneConfirmationRef.current;
        if (!confirmation) {
          throw new Error("Request OTP first.");
        }

        const credential = await confirmation.confirm(code.trim());
        const nextProfile = await getUserProfile(credential.user.uid);

        if (!nextProfile) {
          if (expectedRole === "client") {
            setProfile(buildFallbackProfile(credential.user));
            return;
          }

          await firebaseSignOut(auth);
          throw new Error(
            "Your employee profile was not found in Firestore. Ask admin to create it.",
          );
        }

        if (expectedRole && nextProfile.role !== expectedRole && nextProfile.role !== "admin") {
          await firebaseSignOut(auth);
          throw new Error(`This login is only available for ${expectedRole} accounts.`);
        }

        setProfile(nextProfile);
      },
      async signUpClient(input) {
        if (!auth || !hasFirebaseEnv) {
          throw new Error("Firebase environment variables are missing.");
        }

        const credential = await createUserWithEmailAndPassword(
          auth,
          input.email,
          input.password,
        );

        const fullName = buildName(input.firstName, input.lastName);
        await updateProfile(credential.user, { displayName: fullName });

        const nextProfile: AuthProfile = {
          uid: credential.user.uid,
          email: credential.user.email ?? input.email,
          name: fullName,
          company: input.company,
          phone: input.phone,
          role: "client",
          createdAt: new Date().toISOString(),
        };

        try {
          await upsertUserProfile(nextProfile);
        } catch {
          // Proceed with in-memory client profile; Firestore rule can be fixed later.
          setProfile(nextProfile);
          return;
        }

        setProfile(nextProfile);
      },
      async signOut() {
        if (!auth) return;
        await firebaseSignOut(auth);
        setProfile(null);
        phoneConfirmationRef.current = null;
        if (recaptchaRef.current) {
          recaptchaRef.current.clear();
          recaptchaRef.current = null;
        }
      },
    }),
    [firebaseUser, loading, profile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}
