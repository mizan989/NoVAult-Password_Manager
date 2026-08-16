import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, ArrowRight, Lock, Mail, User as UserIcon, Eye, EyeOff } from "lucide-react";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import SpotlightCard from "../components/Animation/SpotlightCard";
import { authService } from "../services/authService";
import { scorePasswordStrength, strengthColor } from "../utils/passwordStrength";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.register(name, email, password);
      navigate("/verify-otp", { state: { email } });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const strength = password ? scorePasswordStrength(password) : null;

  return (
    <AuthShell
      title="Create Your Vault Account"
      subtitle="Start protecting your digital assets with Zero-Knowledge encryption."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Full Name"
          placeholder="e.g. Satoshi Nakamoto"
          leftIcon={<UserIcon className="h-4 w-4" />}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div>
          <Input
            label="Account Password"
            type={showPassword ? "text" : "password"}
            placeholder="Minimum 8 characters"
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
            minLength={8}
          />

          {strength && (
            <div className="mt-2">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full transition-all duration-300 ${strengthColor(strength.label)}`}
                  style={{ width: `${(strength.score / 4) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Password Strength: <span className="font-semibold text-slate-700">{strength.label}</span>
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-600 font-medium">
            {error}
          </div>
        )}

        <Button type="submit" loading={loading} className="w-full mt-2">
          <span>Create Account</span>
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        Already have a vault?{" "}
        <Link to="/login" className="font-semibold text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-vault-bg px-4 py-12 selection:bg-blue-500 selection:text-white">
      {/* Background ambient gradient glow */}
      <div className="pointer-events-none absolute inset-0 bg-mesh-light -z-10" />

      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight text-slate-900">
              No<span className="text-vault-accent">VA</span>ult
            </span>
          </Link>
          <h1 className="font-heading text-2xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">{subtitle}</p>}
        </div>

        {/* Card Shell */}
        <SpotlightCard className="p-8 bg-white border-slate-200 shadow-card">
          {children}
        </SpotlightCard>

        {/* Security Assurance footer */}
        <p className="mt-6 text-center text-[11px] text-slate-400">
          Encrypted with Argon2id + AES-256-GCM • Zero-Knowledge
        </p>
      </div>
    </div>
  );
}
