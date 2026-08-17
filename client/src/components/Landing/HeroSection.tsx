import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ShieldCheck, Lock, Key } from "lucide-react";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax transformations
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Floating ambient parallax elements
  const float1Y = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const float1Rotate = useTransform(scrollYProgress, [0, 1], [-2, -8]);

  const float2Y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const float2Rotate = useTransform(scrollYProgress, [0, 1], [3, 10]);

  const float3Y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const scrollToContent = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[100dvh] w-full flex flex-col justify-between items-center overflow-hidden px-6 pt-24 pb-8 select-none"
    >
      {/* Background ambient lighting mesh with parallax scale/position */}
      <motion.div
        style={{ scale: bgScale, y: bgY }}
        className="pointer-events-none absolute inset-0 -z-10 bg-mesh-light"
      />
      <motion.div
        style={{ y: bgY }}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-blue-100/50 blur-[130px] -z-10"
      />

      {/* Floating Parallax Elements for Desktop */}
      <motion.div
        style={{ y: float1Y, rotate: float1Rotate }}
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="hidden md:flex absolute top-1/4 left-8 lg:left-16 items-center gap-2.5 rounded-2xl border border-blue-200/70 bg-white/85 px-3.5 py-2 shadow-card backdrop-blur-md text-xs font-medium text-slate-700 pointer-events-none z-10"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div className="text-left">
          <div className="font-semibold text-slate-900 leading-tight">Client-Side Vault</div>
          <div className="text-[10px] text-slate-500 font-mono">100% In-Memory</div>
        </div>
      </motion.div>

      <motion.div
        style={{ y: float2Y, rotate: float2Rotate }}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="hidden md:flex absolute top-1/3 right-8 lg:right-16 items-center gap-2.5 rounded-2xl border border-emerald-200/70 bg-white/85 px-3.5 py-2 shadow-card backdrop-blur-md text-xs font-medium text-slate-700 pointer-events-none z-10"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
          <Lock className="h-4 w-4" />
        </div>
        <div className="text-left">
          <div className="font-semibold text-slate-900 leading-tight">AES-256 Encrypted</div>
          <div className="text-[10px] text-emerald-600 font-mono font-medium">Zero-Knowledge</div>
        </div>
      </motion.div>

      <motion.div
        style={{ y: float3Y }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="hidden lg:flex absolute bottom-28 left-20 items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/80 px-3 py-1.5 shadow-subtle backdrop-blur-md text-xs font-medium text-slate-600 pointer-events-none z-10"
      >
        <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Key className="h-3 w-3" />
        </div>
        <span className="text-[11px] font-mono text-slate-600">Uncrackable Payload</span>
      </motion.div>

      {/* Floating Parallax Micro-Badges for Mobile */}
      <motion.div
        style={{ y: float1Y }}
        className="flex md:hidden absolute top-20 right-4 items-center gap-1.5 rounded-full border border-blue-200/70 bg-white/85 px-2.5 py-1 shadow-subtle backdrop-blur text-[10px] font-medium text-blue-700 pointer-events-none z-10"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Client-Side Locked</span>
      </motion.div>

      <motion.div
        style={{ y: float3Y }}
        className="flex md:hidden absolute bottom-24 left-4 items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/85 px-2.5 py-1 shadow-subtle backdrop-blur text-[10px] font-medium text-slate-700 pointer-events-none z-10"
      >
        <Lock className="h-2.5 w-2.5 text-blue-600" />
        <span>AES-256</span>
      </motion.div>

      {/* Main Hero Content - Vertically Centered in Viewport */}
      <div className="w-full flex-1 flex flex-col justify-center items-center">
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="mx-auto max-w-4xl text-center flex flex-col items-center justify-center"
        >
          {/* Security Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/90 px-4 py-1.5 text-xs font-medium text-blue-700 shadow-subtle backdrop-blur-md mb-6"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Zero-Knowledge Architecture</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">Only You Hold the Key</span>
          </motion.div>

          {/* Original Size Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1]"
          >
            Nothing to see. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
              Everything to protect.
            </span>
          </motion.h1>

          {/* Original Size Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal"
          >
            A secure, zero-knowledge password manager and encrypted notes locker.
            Your credentials and private notes are encrypted directly on your device — our servers
            never see or store your raw master password.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-vault-accent px-8 py-3.5 text-sm font-semibold text-white shadow-glow hover:bg-vault-accentHover transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={scrollToContent}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-subtle hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 backdrop-blur"
            >
              <span>See How it Works</span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Minimalistic Parallax Scroll Indicator at bottom */}
      <motion.div
        style={{ opacity: scrollIndicatorOpacity }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        onClick={scrollToContent}
        className="w-full flex flex-col items-center gap-1.5 cursor-pointer text-slate-400 hover:text-blue-600 transition-colors z-20 group pb-2"
      >
        <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 group-hover:text-blue-600 transition-colors">
          Scroll to explore
        </span>
        <div className="flex h-7 w-4.5 items-start justify-center rounded-full border-2 border-slate-300/80 p-1 group-hover:border-blue-400 transition-colors">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="h-1.5 w-1 rounded-full bg-blue-600"
          />
        </div>
      </motion.div>
    </section>
  );
}



