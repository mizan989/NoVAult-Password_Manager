import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, AlertCircle } from "lucide-react";
import SpotlightCard from "../components/Animation/SpotlightCard";
import GoogleAuthButton from "../components/Auth/GoogleAuthButton";

export default function Register() {
  const [error, setError] = useState("");

  return (
    <AuthShell
      title="Create Your Vault Account"
      subtitle="Start protecting your passwords with Zero-Knowledge encryption."
    >
      {/* Notice Banner explaining OTP unavailability */}
      <div className="rounded-xl border border-amber-200/90 bg-amber-50/90 p-3.5 mb-4 text-left">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold text-amber-950">
              Email Sign-Up Temporarily Paused
            </h4>
            <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
              Email OTP verification is offline for maintenance. Please use <span className="font-semibold text-amber-950">Google / Gmail</span> below to sign up and access your vault instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Google Auth Action */}
      <div className="my-2">
        <GoogleAuthButton
          text="Sign up with Google / Gmail"
          onError={(msg) => setError(msg)}
        />
      </div>

      {error && (
        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-xs text-amber-800 font-medium text-center">
          {error}
        </div>
      )}

      {/* Security Assurance Features */}
      <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 my-4 space-y-2 text-left">
        <div className="flex items-center gap-2 text-xs text-slate-700">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Zero-Knowledge client-side encryption</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-700">
          <Lock className="h-4 w-4 text-blue-600 shrink-0" />
          <span>Bank-grade AES-256 security</span>
        </div>
      </div>

      {/* Bottom Sign in link */}
      <p className="mt-3 text-center text-xs text-slate-600">
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
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-vault-bg px-4 py-4 sm:py-6 selection:bg-blue-500 selection:text-white">
      {/* Background ambient gradient glow */}
      <div className="pointer-events-none absolute inset-0 bg-mesh-light -z-10" />

      <div className="w-full max-w-md my-auto">
        {/* Brand Header */}
        <div className="text-center mb-4">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="font-heading text-lg font-bold tracking-tight text-slate-900">
              No<span className="text-vault-accent">VA</span>ult
            </span>
          </Link>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="mt-0.5 text-xs text-slate-500 max-w-xs mx-auto">{subtitle}</p>}
        </div>

        {/* Card Shell */}
        <SpotlightCard className="p-5 sm:p-6 bg-white border-slate-200 shadow-card">
          {children}
        </SpotlightCard>

        {/* Security Assurance footer */}
        <p className="mt-3 text-center text-[11px] text-slate-400">
          Encrypted with Argon2id + AES-256-GCM • Zero-Knowledge
        </p>
      </div>
    </div>
  );
}

