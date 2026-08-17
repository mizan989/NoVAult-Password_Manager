import React, { useState } from "react";
import { motion } from "framer-motion";
import { Key, ShieldCheck, Database, Lock, Laptop, ArrowRight } from "lucide-react";
import SpotlightCard from "../Animation/SpotlightCard";

export default function CryptoSimulator() {
  const [plainInput, setPlainInput] = useState("MySecurePassword123!");
  const [masterPassword, setMasterPassword] = useState("MasterSecret@Vault");

  // Live client-side simulated ciphertext generation
  const generateSimulatedCiphertext = (secret: string) => {
    if (!secret) return "••••••••••••••••••••";
    return (
      "aes256_enc_" +
      Array.from(secret)
        .map((c) => (c.charCodeAt(0) ^ 0x4f).toString(16).padStart(2, "0"))
        .join("") +
      "_x9z"
    );
  };

  const ciphertext = generateSimulatedCiphertext(plainInput);

  return (
    <section id="how-it-works" className="py-20 bg-slate-100/60 border-y border-slate-200/80">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-700 mb-3">
            <Lock className="h-3.5 w-3.5" />
            <span>Interactive Privacy Demo</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
            How Your Data Stays 100% Private
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Type below to see how zero-knowledge works in real time. Your device locks your data before sending anything to our servers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Input Controls Panel - Client-Side Plaintext Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 flex flex-col gap-4"
          >
            <SpotlightCard className="p-6 bg-white border-slate-200 shadow-card">
              <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600 border border-blue-100">
                  <Key className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-semibold text-slate-900">
                    Client-Side Plaintext Input
                  </h4>
                  <p className="text-xs text-slate-500">Exists only in your browser memory</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Your Master Password
                  </label>
                  <input
                    type="text"
                    value={masterPassword}
                    onChange={(e) => setMasterPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-mono text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Known only to you. Never sent to or saved on any server.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Secret Data to Encrypt
                  </label>
                  <input
                    type="text"
                    value={plainInput}
                    onChange={(e) => setPlainInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-mono text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Try typing any password, PIN, or confidential note.
                  </p>
                </div>
              </div>
            </SpotlightCard>

            {/* Zero Knowledge Guarantee Card */}
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-5 backdrop-blur">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-emerald-900">
                    Zero-Knowledge Guarantee
                  </h4>
                  <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                    Even if the database server is ever compromised, attackers only get scrambled characters. Without your unique master password, the data is impossible to read.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Clean Visual Comparison */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 flex flex-col gap-4"
          >
            {/* Box 1: On Your Device */}
            <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-card">
              <div className="flex items-center justify-between text-xs mb-3 pb-2 border-b border-slate-100">
                <span className="font-semibold text-slate-800 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Laptop className="h-3.5 w-3.5" />
                  </div>
                  On Your Device (Your Browser)
                </span>
                <span className="text-[11px] font-medium text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Readable Only by You
                </span>
              </div>

              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/70">
                <div className="text-[11px] text-slate-500 mb-1 font-medium">Decrypted Plaintext:</div>
                <div className="font-mono text-sm font-semibold text-slate-900 break-all">
                  {plainInput || <span className="text-slate-400 font-normal">Empty secret</span>}
                </div>
              </div>
              <p className="mt-2.5 text-xs text-slate-500">
                This plaintext data stays in your browser's private memory and is never uploaded anywhere unencrypted.
              </p>
            </div>

            {/* Downward Arrow Indicator */}
            <div className="flex justify-center -my-1">
              <div className="flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1 shadow-xs text-[11px] font-medium text-slate-600">
                <span>Encrypted locally before sending</span>
                <ArrowRight className="h-3 w-3 text-blue-600 rotate-90 sm:rotate-0" />
              </div>
            </div>

            {/* Box 2: What Cloud/Server Stores */}
            <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/40 via-white to-emerald-50/20 p-5 shadow-card">
              <div className="flex items-center justify-between text-xs mb-3 pb-2 border-b border-emerald-100">
                <span className="font-semibold text-emerald-950 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <Database className="h-3.5 w-3.5" />
                  </div>
                  What NoVAult Server & Database Stores
                </span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  🔒 Zero-Knowledge Scrambled
                </span>
              </div>

              <div className="bg-white rounded-xl p-3.5 border border-emerald-200/80 shadow-subtle">
                <div className="text-[11px] text-emerald-700 mb-1 font-medium">Encrypted Ciphertext:</div>
                <div className="font-mono text-xs sm:text-sm font-bold text-emerald-800 break-all">
                  {ciphertext}
                </div>
              </div>
              <p className="mt-2.5 text-xs text-slate-600">
                This scrambled text is all the database ever sees. Even NoVAult administrators cannot decrypt your passwords.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

