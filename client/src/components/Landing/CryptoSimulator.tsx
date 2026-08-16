import React, { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Lock, Key, ShieldCheck, Database, ArrowDown, RefreshCw, Layers } from "lucide-react";
import SpotlightCard from "../Animation/SpotlightCard";

export default function CryptoSimulator() {
  const [plainInput, setPlainInput] = useState("Quantum#Secure2026!");
  const [masterPassword, setMasterPassword] = useState("MasterSecret@Vault99");

  // Pseudo-cryptographic hashing simulations for live interactive demonstration
  const generateSimulatedCrypto = (secret: string, master: string) => {
    // Generate deterministic hex strings based on input lengths & char codes
    let hashNum = 0;
    for (let i = 0; i < (secret + master).length; i++) {
      hashNum = (hashNum * 31 + (secret + master).charCodeAt(i)) & 0xffffffff;
    }
    const salt = "e4f8a92b" + Math.abs(hashNum).toString(16).padStart(8, "0") + "c1d37b92";
    const derivedKey = "7a" + Math.abs(hashNum * 17).toString(16).padStart(8, "0") + "f8c2e91a54b38d014c5e";
    const iv = "9b4f2c" + Math.abs(hashNum * 23).toString(16).padStart(6, "0");
    const ciphertext = "aes_gcm_" + Array.from(secret)
      .map((c) => (c.charCodeAt(0) ^ 0x5a).toString(16).padStart(2, "0"))
      .join("") + "_e7a9c3";
    const authTag = "tag_" + Math.abs(hashNum * 37).toString(16).padStart(8, "0");

    return { salt, derivedKey, iv, ciphertext, authTag };
  };

  const cryptoData = generateSimulatedCrypto(plainInput, masterPassword);

  return (
    <section id="crypto-simulator" className="py-20 bg-slate-100/60 border-y border-slate-200/80">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 mb-3">
            <Cpu className="h-3.5 w-3.5" />
            <span>Interactive Zero-Knowledge Simulator</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
            How the Crypto Pipeline Works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Type below to see the cryptographic transformations in real time. Notice how the server only ever receives and stores the uncrackable ciphertext.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Input Controls Panel */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <SpotlightCard className="p-6 bg-white border-slate-200 shadow-card">
              <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600 border border-blue-100">
                  <Key className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-semibold text-slate-900">
                    Client-Side Plaintext Input
                  </h4>
                  <p className="text-xs text-slate-500">Exists only in browser RAM</p>
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
                    Never sent to or stored on server in reversible form.
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
                    Passwords, seeds, private notes, API keys.
                  </p>
                </div>
              </div>
            </SpotlightCard>

            {/* Zero Knowledge Guarantee Card */}
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-5 backdrop-blur">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-emerald-900">
                    Zero-Knowledge Guarantee
                  </h4>
                  <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                    Even if the database server is compromised, attackers only get random-looking IVs and ciphertexts — totally mathematically useless without each user's unique master password.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pipeline Visualizer Output */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            {/* Step 1 */}
            <motion.div
              key={cryptoData.salt}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-subtle"
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">1</span>
                  Argon2id Key Derivation
                </span>
                <span className="font-mono text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  memory: 64MB • iter: 3
                </span>
              </div>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-500">Per-User Salt:</span>
                  <span className="text-slate-800 font-medium truncate max-w-[240px] sm:max-w-none">{cryptoData.salt}</span>
                </div>
                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-500">Derived 256-bit Key:</span>
                  <span className="text-indigo-600 font-medium truncate max-w-[240px] sm:max-w-none">{cryptoData.derivedKey}</span>
                </div>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              key={cryptoData.iv}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-subtle"
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">2</span>
                  Fresh Random IV (Initialization Vector)
                </span>
                <span className="font-mono text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  96-bit Nonce per Write
                </span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-xs font-mono flex items-center justify-between">
                <span className="text-slate-500">Random IV:</span>
                <span className="text-slate-800 font-medium">{cryptoData.iv}</span>
              </div>
            </motion.div>

            {/* Step 3 - What reaches the server */}
            <motion.div
              key={cryptoData.ciphertext}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/40 via-white to-blue-50/30 p-4 shadow-soft"
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">3</span>
                  Stored Server Payload (MongoDB)
                </span>
                <span className="font-mono text-[10px] text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-200 font-semibold flex items-center gap-1">
                  <Database className="h-3 w-3" /> Encrypted at Rest
                </span>
              </div>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between bg-white/90 p-2.5 rounded-lg border border-emerald-100 shadow-subtle">
                  <span className="text-slate-500">Ciphertext:</span>
                  <span className="text-emerald-700 font-bold truncate max-w-[240px] sm:max-w-none">{cryptoData.ciphertext}</span>
                </div>
                <div className="flex items-center justify-between bg-white/90 p-2.5 rounded-lg border border-emerald-100 shadow-subtle">
                  <span className="text-slate-500">128-bit Auth Tag:</span>
                  <span className="text-slate-800 font-medium">{cryptoData.authTag}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
