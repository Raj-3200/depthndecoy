import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2, Mail, Phone, Chrome } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Auth = () => {
  const [mode, setMode] = useState<"choose" | "login" | "signup" | "forgot" | "phone">("choose");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Phone auth state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const { signIn, signUp, resetPassword, signInWithGoogle, sendPhoneOtp, verifyPhoneOtp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const clearErrors = () => {
    setError(null);
    setSuccess(null);
    setFieldErrors({});
  };

  const handleGoogleSignIn = async () => {
    clearErrors();
    setLoading(true);
    const { error } = await signInWithGoogle();
    setLoading(false);
    if (error) {
      setError(error.message || "Failed to sign in with Google.");
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!phoneNumber || phoneNumber.length < 10) {
      setFieldErrors({ phone: "Please enter a valid phone number with country code (e.g. +1234567890)" });
      return;
    }

    setLoading(true);
    const { error } = await sendPhoneOtp(phoneNumber, "recaptcha-container");
    setLoading(false);

    if (error) {
      setError(error.message || "Failed to send OTP. Please try again.");
    } else {
      setOtpSent(true);
      setSuccess("OTP sent! Check your phone for the verification code.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!otp || otp.length < 6) {
      setFieldErrors({ otp: "Please enter the 6-digit code" });
      return;
    }

    setLoading(true);
    const { error } = await verifyPhoneOtp(otp);
    setLoading(false);

    if (error) {
      setError(error.message || "Invalid code. Please try again.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please try again.");
      } else if (error.message.includes("Email not confirmed")) {
        setError("Please confirm your email first. Check your inbox for a message from Depth & Decoy.");
      } else {
        setError(error.message);
      }
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    const result = signupSchema.safeParse({ fullName, email, password, confirmPassword });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);

    if (error) {
      if (error.message.includes("already registered") || error.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please log in instead.");
      } else {
        setError(error.message);
      }
    } else {
      setSuccess("Welcome to Depth & Decoy. Check your email to confirm your account and enter the depth.");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!email || !z.string().email().safeParse(email).success) {
      setFieldErrors({ email: "Please enter a valid email address" });
      return;
    }

    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Password reset link sent. Check your email to set a new password.");
    }
  };

  return (
    <Layout>
      <section className="pt-32 pb-20 md:pt-40 min-h-[80vh] flex items-center">
        <div className="container-premium max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-card border border-border p-8 md:p-12"
          >
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-subhead text-foreground mb-2">
                {mode === "choose" && "Continue to Depth & Decoy"}
                {mode === "login" && "Welcome Back"}
                {mode === "signup" && "Create Account"}
                {mode === "forgot" && "Reset Password"}
                {mode === "phone" && "Phone Sign In"}
              </h1>
              <p className="text-body text-muted-foreground">
                {mode === "choose" && "Choose how you'd like to sign in"}
                {mode === "login" && "Enter your credentials to continue"}
                {mode === "signup" && "Join the inner circle"}
                {mode === "forgot" && "Enter your email to reset your password"}
                {mode === "phone" && (otpSent ? "Enter the code sent to your phone" : "Enter your phone number")}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-accent/20 border border-accent/40 text-foreground text-sm"
              >
                {success}
              </motion.div>
            )}

            {/* Choose Method */}
            {mode === "choose" && (
              <div className="space-y-4">
                {/* Google */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center gap-4 p-4 border border-border hover:border-muted-foreground text-foreground transition-colors"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  )}
                  <span className="text-body">Continue with Google</span>
                </button>

                {/* Email */}
                <button
                  onClick={() => { setMode("login"); clearErrors(); }}
                  className="w-full flex items-center gap-4 p-4 border border-border hover:border-muted-foreground text-foreground transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span className="text-body">Continue with Email</span>
                </button>

                {/* Phone */}
                <button
                  onClick={() => { setMode("phone"); clearErrors(); }}
                  className="w-full flex items-center gap-4 p-4 border border-border hover:border-muted-foreground text-foreground transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span className="text-body">Continue with Phone</span>
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-card px-4 text-caption text-muted-foreground">
                      or
                    </span>
                  </div>
                </div>

                <p className="text-center text-body text-muted-foreground">
                  New here?{" "}
                  <button
                    type="button"
                    onClick={() => { setMode("signup"); clearErrors(); }}
                    className="text-foreground hover:underline"
                  >
                    Create an account
                  </button>
                </p>
              </div>
            )}

            {/* Phone Auth */}
            {mode === "phone" && (
              <>
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-6">
                    <div>
                      <label className="text-caption text-muted-foreground block mb-2">
                        PHONE NUMBER
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-input border border-border px-4 py-3 text-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-muted-foreground transition-colors"
                        placeholder="+1 234 567 8900"
                      />
                      {fieldErrors.phone && (
                        <p className="text-destructive text-xs mt-1">{fieldErrors.phone}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-primary flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Send OTP
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-body text-muted-foreground">
                      <button
                        type="button"
                        onClick={() => { setMode("choose"); clearErrors(); setOtpSent(false); }}
                        className="text-foreground hover:underline"
                      >
                        Back to options
                      </button>
                    </p>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div>
                      <label className="text-caption text-muted-foreground block mb-2">
                        VERIFICATION CODE
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="w-full bg-input border border-border px-4 py-3 text-body text-foreground text-center tracking-[0.5em] placeholder:text-muted-foreground placeholder:tracking-normal focus:outline-none focus:border-muted-foreground transition-colors"
                        placeholder="000000"
                        maxLength={6}
                      />
                      {fieldErrors.otp && (
                        <p className="text-destructive text-xs mt-1">{fieldErrors.otp}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-primary flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Verify & Sign In
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-body text-muted-foreground">
                      Didn't receive code?{" "}
                      <button
                        type="button"
                        onClick={() => { setOtpSent(false); clearErrors(); }}
                        className="text-foreground hover:underline"
                      >
                        Try again
                      </button>
                    </p>
                  </form>
                )}
              </>
            )}

            {/* Login Form */}
            {mode === "login" && (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="text-caption text-muted-foreground block mb-2">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-input border border-border px-4 py-3 text-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-muted-foreground transition-colors"
                    placeholder="you@example.com"
                  />
                  {fieldErrors.email && (
                    <p className="text-destructive text-xs mt-1">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-caption text-muted-foreground block mb-2">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-input border border-border px-4 py-3 pr-12 text-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-muted-foreground transition-colors"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-destructive text-xs mt-1">{fieldErrors.password}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setMode("forgot"); clearErrors(); }}
                    className="text-caption text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-body text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => { setMode("signup"); clearErrors(); }}
                    className="text-foreground hover:underline"
                  >
                    Create one
                  </button>
                  {" · "}
                  <button
                    type="button"
                    onClick={() => { setMode("choose"); clearErrors(); }}
                    className="text-foreground hover:underline"
                  >
                    All options
                  </button>
                </p>
              </form>
            )}

            {/* Signup Form */}
            {mode === "signup" && (
              <form onSubmit={handleSignup} className="space-y-6">
                <div>
                  <label className="text-caption text-muted-foreground block mb-2">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-input border border-border px-4 py-3 text-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-muted-foreground transition-colors"
                    placeholder="John Doe"
                  />
                  {fieldErrors.fullName && (
                    <p className="text-destructive text-xs mt-1">{fieldErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="text-caption text-muted-foreground block mb-2">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-input border border-border px-4 py-3 text-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-muted-foreground transition-colors"
                    placeholder="you@example.com"
                  />
                  {fieldErrors.email && (
                    <p className="text-destructive text-xs mt-1">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-caption text-muted-foreground block mb-2">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-input border border-border px-4 py-3 pr-12 text-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-muted-foreground transition-colors"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-destructive text-xs mt-1">{fieldErrors.password}</p>
                  )}
                </div>

                <div>
                  <label className="text-caption text-muted-foreground block mb-2">
                    CONFIRM PASSWORD
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-input border border-border px-4 py-3 text-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-muted-foreground transition-colors"
                    placeholder="••••••••"
                  />
                  {fieldErrors.confirmPassword && (
                    <p className="text-destructive text-xs mt-1">{fieldErrors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-body text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => { setMode("login"); clearErrors(); }}
                    className="text-foreground hover:underline"
                  >
                    Sign in
                  </button>
                  {" · "}
                  <button
                    type="button"
                    onClick={() => { setMode("choose"); clearErrors(); }}
                    className="text-foreground hover:underline"
                  >
                    All options
                  </button>
                </p>
              </form>
            )}

            {/* Forgot Password Form */}
            {mode === "forgot" && (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <label className="text-caption text-muted-foreground block mb-2">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-input border border-border px-4 py-3 text-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-muted-foreground transition-colors"
                    placeholder="you@example.com"
                  />
                  {fieldErrors.email && (
                    <p className="text-destructive text-xs mt-1">{fieldErrors.email}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-body text-muted-foreground">
                  Remember your password?{" "}
                  <button
                    type="button"
                    onClick={() => { setMode("login"); clearErrors(); }}
                    className="text-foreground hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            )}

            {/* Invisible reCAPTCHA container for phone auth */}
            <div id="recaptcha-container" />
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Auth;
