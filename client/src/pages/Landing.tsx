import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, ArrowRight, Github, Heart } from "lucide-react";
import HeroSection from "../components/Landing/HeroSection";
import CryptoSimulator from "../components/Landing/CryptoSimulator";
import BentoFeatures from "../components/Landing/BentoFeatures";
import SecurityArchitecture from "../components/Landing/SecurityArchitecture";

export default function Landing() {
  return (
    <div className="min-h-screen bg-vault-bg text-slate-900 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Top Floating Glass Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="font-heading text-lg font-bold tracking-tight text-slate-900">
              No<span className="text-vault-accent">VA</span>ult
            </span>
          </Link>

          <nav className="hidden sm:flex items-center gap-6 text-xs font-medium text-slate-600">
            <a href="#crypto-simulator" className="hover:text-blue-600 transition-colors">
              Crypto Engine
            </a>
            <a href="#features" className="hover:text-blue-600 transition-colors">
              Features
            </a>
            <Link to="/login" className="hover:text-blue-600 transition-colors">
              Sign in
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:inline-flex rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 rounded-xl bg-vault-accent px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-vault-accentHover transition-colors"
            >
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Landing Page Content */}
      <main className="flex-1">
        <HeroSection />
        <div id="features">
          <BentoFeatures />
        </div>
        <CryptoSimulator />
        <SecurityArchitecture />

        {/* Bottom CTA Banner */}
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white text-center">
          <div className="mx-auto max-w-4xl px-6">
            <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-white p-10 sm:p-14 shadow-card">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-glow">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="font-heading text-2xl sm:text-4xl font-bold text-slate-900 mb-3">
                Secure your digital realm today.
              </h2>
              <p className="mx-auto max-w-xl text-sm sm:text-base text-slate-600 mb-8 font-normal">
                Create your zero-knowledge vault in seconds. Passwords and private notes encrypted locally with Argon2id + AES-256-GCM.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/register"
                  className="rounded-xl bg-vault-accent px-8 py-3.5 text-sm font-semibold text-white shadow-glow hover:bg-vault-accentHover transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Create Master Vault
                </Link>
                <Link
                  to="/login"
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-subtle hover:bg-slate-50 transition-colors"
                >
                  Sign In to Existing
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Light Cyber-Vault Footer */}
      <footer className="border-t border-slate-200 bg-white py-10 px-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-slate-800">NoVAult</span>
            <span>— Zero-Knowledge Digital Security</span>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1">
            Built by <span className="font-semibold text-slate-800">Md Mizan</span> as a portfolio project.
          </div>

          <div className="text-[11px] text-slate-400">
            AES-256-GCM • Argon2id • Client Derivation
          </div>
        </div>
      </footer>
    </div>
  );
}
