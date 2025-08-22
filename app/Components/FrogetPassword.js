"use client";
import { useState } from "react";

export default function ForgotPasswordModal({ isOpen, onClose, API_BASE_URL }) {
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSendOTP = async () => {
    if (!email) return alert("Enter your email");
    if (!/\S+@\S+\.\S+/.test(email)) return alert("Please enter a valid email");
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("✅ OTP sent to your email!");
      setStep(2);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) return alert("Enter OTP");
    if (otp.length !== 6) return alert("OTP must be 6 digits");
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("✅ OTP verified!");
      setStep(3);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 8)
      return alert("Password must be at least 8 characters");
    if (newPassword !== confirmPassword)
      return alert("Passwords do not match");
      
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("✅ Password reset successful! Please login.");
      handleClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    onClose();
  };

  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
      if (step === 2) setOtp("");
      if (step === 3) {
        setNewPassword("");
        setConfirmPassword("");
      }
    }
  };

  if (!isOpen) return null;

  const stepTitles = {
    1: "Reset Password",
    2: "Verify Code",
    3: "New Password"
  };

  const stepDescriptions = {
    1: "Enter your email address and we&apos;ll send you a verification code",
    2: "Enter the 6-digit code sent to your email",
    3: "Create a new secure password for your account"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 w-full max-w-md relative overflow-hidden">
        
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20 "></div>
        
        {/* Content */}
        <div className="relative p-8">
          
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200"
            onClick={handleClose}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Progress indicator */}
          <div className="flex items-center justify-center mb-6">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    stepNumber === step
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : stepNumber < step
                      ? "bg-green-500 text-white"
                      : "bg-white/10 text-white/50"
                  }`}
                >
                  {stepNumber < step ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`w-12 h-0.5 mx-2 transition-all duration-300 ${
                      stepNumber < step ? "bg-green-500" : "bg-white/20"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {stepTitles[step]}
            </h2>
            <p className="text-white/70 text-sm">
              {stepDescriptions[step]}
            </p>
          </div>

          {/* Step 1: Enter Email */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-3 rounded-xl backdrop-blur-sm bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
              <button
                onClick={handleSendOTP}
                disabled={loading || !email}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending Code...
                  </div>
                ) : (
                  "Send Verification Code"
                )}
              </button>
            </div>
          )}

          {/* Step 2: Enter OTP */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Verification Code
                </label>
                <p className="text-xs text-white/60 mb-3">
                  Code sent to: {email}
                </p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-xl backdrop-blur-sm bg-white/5 border border-white/20 text-white placeholder-white/40 text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                <p className="text-xs text-white/50 text-center mt-2">
                  Enter the 6-digit code from your email
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length !== 6}
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </div>
                  ) : (
                    "Verify Code"
                  )}
                </button>
                <button
                  onClick={goToPreviousStep}
                  className="w-full py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white font-medium transition-all duration-300"
                >
                  Back to Email
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pr-12 pl-4 py-3 rounded-xl backdrop-blur-sm bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/70"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-white/50 mt-1">
                  Must be at least 8 characters long
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 rounded-xl backdrop-blur-sm bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div className="space-y-3">
                <button
                  onClick={handleResetPassword}
                  disabled={loading || !newPassword || !confirmPassword}
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Resetting...
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </button>
                <button
                  onClick={goToPreviousStep}
                  className="w-full py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white font-medium transition-all duration-300"
                >
                  Back to Verification
                </button>
              </div>
            </div>
          )}

          {/* Help text */}
          {step === 2 && (
            <div className="mt-6 text-center">
              <p className="text-xs text-white/50">
                Didn&apos;t receive the code?{" "}
                <button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Resend
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}