import { useState, useEffect, useRef } from "react";
import {
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  PhoneAuthProvider,
} from "firebase/auth";
import { auth } from "@/integrations/firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/integrations/firebase/config";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Helper: ensure a profile doc exists for the user
  const ensureProfile = async (firebaseUser: User) => {
    const profileRef = doc(db, "profiles", firebaseUser.uid);
    const profileSnap = await getDoc(profileRef);
    if (!profileSnap.exists()) {
      await setDoc(profileRef, {
        user_id: firebaseUser.uid,
        email: firebaseUser.email || "",
        full_name: firebaseUser.displayName || "",
        avatar_url: firebaseUser.photoURL || null,
        phone: firebaseUser.phoneNumber || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = credential.user;

      // Update display name
      if (fullName) {
        await updateProfile(firebaseUser, { displayName: fullName });
      }

      // Send email verification
      await sendEmailVerification(firebaseUser);

      // Create profile document in Firestore
      await ensureProfile(firebaseUser);

      // Sign out so user must verify email first
      await firebaseSignOut(auth);

      return { data: credential, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);

      // Check if email is verified
      if (!credential.user.emailVerified) {
        // Resend verification email
        await sendEmailVerification(credential.user);
        await firebaseSignOut(auth);
        return {
          data: null,
          error: { message: "Email not confirmed" },
        };
      }

      return { data: credential, error: null };
    } catch (err: any) {
      // Map Firebase error codes to user-friendly messages
      if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/invalid-credential"
      ) {
        return { data: null, error: { message: "Invalid login credentials" } };
      }
      return { data: null, error: err };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      await ensureProfile(credential.user);
      return { data: credential, error: null };
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") {
        return { data: null, error: null }; // User cancelled — not an error
      }
      return { data: null, error: err };
    }
  };

  const sendPhoneOtp = async (phoneNumber: string, recaptchaContainerId: string) => {
    try {
      // Create invisible reCAPTCHA verifier
      const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
        size: "invisible",
      });

      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      confirmationResultRef.current = confirmation;
      return { data: true, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  };

  const verifyPhoneOtp = async (otp: string) => {
    try {
      if (!confirmationResultRef.current) {
        return { data: null, error: { message: "No OTP request found. Please request a new code." } };
      }
      const credential = await confirmationResultRef.current.confirm(otp);
      await ensureProfile(credential.user);
      return { data: credential, error: null };
    } catch (err: any) {
      if (err.code === "auth/invalid-verification-code") {
        return { data: null, error: { message: "Invalid OTP code. Please try again." } };
      }
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { data: true, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  };

  return {
    user,
    session: user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    sendPhoneOtp,
    verifyPhoneOtp,
    signOut,
    resetPassword,
  };
};
