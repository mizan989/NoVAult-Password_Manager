import React from "react";
import { motion } from "framer-motion";
import { Shield, KeyRound, Server, Unlock, CheckCircle2, ArrowRight } from "lucide-react";
import SpotlightCard from "../Animation/SpotlightCard";

export default function SecurityArchitecture() {
  const steps = [
    {
      num: "01",
      title: "Master Password Creation",
      desc: "You set a secret Master Password that is strictly never transmitted to or stored on our servers.",
      icon: KeyRound,
    },
    {
      num: "02",
      title: "In-Memory Key Derivation",
      desc: "Argon2id derives a unique 256-bit symmetric AES key using per-user cryptographic salts.",
      icon: Shield,
    },
    {
      num: "03",
      title: "AES-256-GCM Ciphertext",
      desc: "Each item is encrypted with a distinct random IV and 128-bit MAC before leaving your machine.",
      icon: Server,
    },
    {
      num: "04",
      title: "Zero-Knowledge Storage",
      desc: "The database stores only unintelligible ciphertext. No plaintext or decryption key is ever recorded.",
      icon: Unlock,
    },
  ];

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-700 mb-3">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Cryptographic Workflow</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
            How Zero-Knowledge is Maintained
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Every step is designed to guarantee that confidentiality is preserved under all failure and breach scenarios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <SpotlightCard className="h-full p-6 bg-white border-slate-200 shadow-card flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-2xl font-bold text-slate-300">
                        {step.num}
                      </span>
                      <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 border border-blue-100">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="font-heading text-base font-semibold text-slate-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {step.desc}
                    </p>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
