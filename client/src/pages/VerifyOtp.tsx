import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, CheckCircle, ArrowRight, RefreshCw } from "lucide-react";
import Button from "../components/UI/Button";
import { authService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { AuthShell } from "./Register";

export default function VerifyOtp() {
  const location = useLocation();
  const email = (location.state as { email?: string })?.email || "";
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    const char = value.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    // If character entered, advance focus
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim().slice(0, 6);
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);
    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < 6) {
      setError("Please enter all 6 digits of the verification code");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await authService.verifyOtp(email, code);
      await refreshUser();
      navigate("/master-password");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Verification code is invalid or expired");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Verify Your Email"
      subtitle={`We sent a 6-digit code to ${email || "your email address"}`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* 6 Digit Input Boxes */}
        <div className="flex justify-between gap-2 sm:gap-2.5 my-2" onPaste={handlePaste}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl border-2 border-slate-200 bg-slate-50 text-center font-mono text-xl font-bold text-slate-900 shadow-subtle outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          ))}
        </div>

        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-600 font-medium text-center">
            {error}
          </div>
        )}

        <Button type="submit" loading={loading} className="w-full">
          <span>Verify & Continue</span>
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        Didn't receive the email? Check your spam folder or console logs.
      </p>
    </AuthShell>
  );
}
