import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, ArrowRight, Github, Instagram, Linkedin } from "lucide-react";
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
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
              How it Works
            </a>
            <a href="#features" className="hover:text-blue-600 transition-colors">
              Features
            </a>
            <a href="#security" className="hover:text-blue-600 transition-colors">
              Security
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
        <CryptoSimulator />
        <div id="features">
          <BentoFeatures />
        </div>
        <SecurityArchitecture />

        {/* Bottom CTA Banner */}
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white text-center">
          <div className="mx-auto max-w-4xl px-6">
            <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-white p-10 sm:p-14 shadow-card">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-glow">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="font-heading text-2xl sm:text-4xl font-bold text-slate-900 mb-3">
                Secure your digital world today.
              </h2>
              <p className="mx-auto max-w-xl text-sm sm:text-base text-slate-600 mb-8 font-normal">
                Create your free, zero-knowledge vault in seconds. Keep your passwords and private notes safe, organized, and accessible only by you.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/register"
                  className="rounded-xl bg-vault-accent px-8 py-3.5 text-sm font-semibold text-white shadow-glow hover:bg-vault-accentHover transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Create Free Vault
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
      <footer className="border-t border-slate-200 bg-white py-12 px-6 text-slate-500">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-100">
            {/* Brand & Bio */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span className="font-heading text-lg font-bold tracking-tight text-slate-900">
                  No<span className="text-vault-accent">VA</span>ult
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
                Zero-knowledge password manager and private digital vault. Engineered with client-side Argon2id key derivation and AES-256-GCM encryption.
              </p>
              <div className="pt-2 text-xs text-slate-500">
                Crafted by <span className="font-semibold text-slate-800">Md Mizan</span>
              </div>
              {/* Social Links */}
              <div className="flex items-center gap-2.5 pt-1">
                <a
                  href="https://github.com/mizan989"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  title="GitHub"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900 hover:scale-105 active:scale-95"
                >
                  <Github className="h-4 w-4" />
                </a>
                <a
                  href="https://www.instagram.com/mizanmohammadd"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  title="Instagram"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:border-pink-300 hover:bg-pink-50 hover:text-pink-600 hover:scale-105 active:scale-95"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/mizann989/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 hover:scale-105 active:scale-95"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href="https://x.com/mizanmohammadd"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  title="X"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900 hover:scale-105 active:scale-95"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Navigation Column: Product */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-800">
                Product & Tech
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#how-it-works" className="text-slate-600 hover:text-blue-600 transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors">
                    Key Features
                  </a>
                </li>
                <li>
                  <a href="#security" className="text-slate-600 hover:text-blue-600 transition-colors">
                    Security Architecture
                  </a>
                </li>
                <li>
                  <Link to="/register" className="text-slate-600 hover:text-blue-600 transition-colors">
                    Create Free Vault
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-slate-600 hover:text-blue-600 transition-colors">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>

            {/* Navigation Column: Legal & Trust */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-800">
                Legal & Security
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    to="/privacy"
                    className="inline-flex items-center gap-1.5 text-slate-600 hover:text-blue-600 transition-colors font-medium"
                  >
                    <span>Privacy Policy</span>
                    <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600">
                      Zero-Knowledge
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="inline-flex items-center gap-1.5 text-slate-600 hover:text-blue-600 transition-colors font-medium"
                  >
                    <span>Terms & Conditions</span>
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/mizan989/novault"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    Source Code & Audit
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="text-slate-400 text-[11px]">
              © {new Date().getFullYear()} NoVAult. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span>Zero-Knowledge Architecture</span>
              <span>•</span>
              <span>AES-256-GCM + Argon2id</span>
              <span>•</span>
              <Link to="/privacy" className="hover:text-blue-600 transition-colors">
                Privacy
              </Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-blue-600 transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
