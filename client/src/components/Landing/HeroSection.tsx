import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, Lock, Eye, EyeOff, Sparkles, Key, Check } from "lucide-react";
import DecryptText from "../Animation/DecryptText";
import SpotlightCard from "../Animation/SpotlightCard";

export default function HeroSection() {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const samplePassword = "kX9#mP$7vQ!2wL@9zR";

  const handleCopy = () => {
    navigator.clipboard.writeText(samplePassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28">
      {/* Background ambient lighting mesh */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-mesh-light" />
      <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 h-[450px] w-[700px] rounded-full bg-blue-100/40 blur-[100px] -z-10" />

      <div className="mx-auto max-w-6xl px-6 text-center">
        {/* Security Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/90 px-4 py-1.5 text-xs font-medium text-blue-700 shadow-subtle backdrop-blur-md mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Zero-Knowledge Architecture</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500">Argon2id + AES-256-GCM</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1]"
        >
          Nothing to see. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
            Everything to protect.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal"
        >
          A zero-knowledge password vault and encrypted notes locker. Keys are derived
          locally in memory via Argon2id from your master password — a secret the server never sees,
          stores, or can ever decrypt.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-vault-accent px-7 py-3.5 text-sm font-semibold text-white shadow-glow hover:bg-vault-accentHover transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Enter Vault</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#crypto-simulator"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-subtle hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 backdrop-blur"
          >
            <Sparkles className="h-4 w-4 text-indigo-500" />
            <span>Try Crypto Simulator</span>
          </a>
        </motion.div>

        {/* Interactive Live Vault Demo Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 max-w-2xl mx-auto"
        >
          <SpotlightCard
            className="border-slate-200/90 bg-white/95 p-6 sm:p-8 shadow-card text-left backdrop-blur-xl"
            spotlightColor="rgba(59, 130, 246, 0.12)"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-semibold text-slate-900">
                    Production Infrastructure Key
                  </h3>
                  <p className="text-xs text-slate-500">aws.amazon.com • Primary Region</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 text-[11px] font-medium text-emerald-700 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                AES-256-GCM
              </span>
            </div>

            {/* Interactive Decrypt Box */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-medium">Encrypted Secret Field</span>
                <span className="text-[11px] text-blue-600 font-mono">
                  {revealed ? "State: DECRYPTED" : "State: CIPHERTEXT LOCKED"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 overflow-hidden rounded-lg bg-white border border-slate-200 px-3.5 py-2.5 font-mono text-sm text-slate-900 shadow-sm">
                  {revealed ? (
                    <DecryptText text={samplePassword} speed={25} />
                  ) : (
                    <span className="text-slate-400 select-none tracking-wider font-mono">
                      ••••••••••••••••••••
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setRevealed(!revealed)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                >
                  {revealed ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5 text-slate-500" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5 text-blue-600" />
                      <span className="text-blue-600 font-medium">Decrypt</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2.5 text-xs font-medium text-white shadow-sm hover:bg-slate-800 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Key className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="mt-4 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Try clicking "Decrypt" to preview the client-side matrix unscramble.</span>
              <span className="font-mono text-[10px] text-slate-400">IV: 96-bit Random</span>
            </p>
          </SpotlightCard>
        </motion.div>
      </div>
    </section>
  );
}
