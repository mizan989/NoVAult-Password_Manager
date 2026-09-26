import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ShieldCheck, Check, X, ArrowRight, Eye, EyeOff, AlertTriangle } from "lucide-react";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { authService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { useVaultUnlock } from "../hooks/useVaultUnlock";
import { AuthShell } from "./Register";
import { scorePasswordStrength, strengthColor } from "../utils/passwordStrength";
import { triggerConfetti } from "../components/Animation/Confetti";

export default function MasterPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const { unlock } = useVaultUnlock();

  const requirements = [
    { label: "At least 10 characters", valid: password.length >= 10 },
    { label: "Contains uppercase & lowercase", valid: /[A-Z]/.test(password) && /[a-z]/.test(password) },
    { label: "Contains at least one number", valid: /\d/.test(password) },
    { label: "Contains a special symbol (!@#$)", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const allValid = requirements.every((r) => r.valid);
  const strength = password ? scorePasswordStrength(password) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Master passwords do not match");
      return;
    }
    if (password.length < 10) {
      setError("Master password must be at least 10 characters");
      return;
    }

    setLoading(true);
    try {
      await authService.createMasterPassword(password);
      await refreshUser();
      await unlock(password);
      triggerConfetti();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not set master password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create Your Master Key"
      subtitle="This password derives your AES-256 encryption key. It is never stored on any server."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Security Warning Notice */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-800">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-semibold">Zero-Knowledge Notice:</span> If you forget this master password, nobody (including NoVAult) can recover your encrypted data.
            </p>
          </div>
        </div>

        <div>
          <Input
            label="Master Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter a strong passphrase"
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
          />

          {strength && (
            <div className="mt-2">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full transition-all duration-300 ${strengthColor(strength.label)}`}
                  style={{ width: `${(strength.score / 4) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <Input
          label="Confirm Master Password"
          type={showPassword ? "text" : "password"}
          placeholder="Re-enter to confirm"
          leftIcon={<Lock className="h-4 w-4" />}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        {/* Requirements Checklist */}
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-1.5 text-xs">
          {requirements.map((req) => (
            <div
              key={req.label}
              className={`flex items-center gap-2 transition-colors ${
                req.valid ? "text-emerald-700 font-medium" : "text-slate-500"
              }`}
            >
              {req.valid ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <div className="h-3.5 w-3.5 rounded-full border border-slate-300" />
              )}
              <span>{req.label}</span>
            </div>
          ))}
        </div>

        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-600 font-medium">
            {error}
          </div>
        )}

        <Button type="submit" loading={loading} className="w-full mt-1">
          <span>Initialize Encrypted Vault</span>
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </form>
    </AuthShell>
  );
}
