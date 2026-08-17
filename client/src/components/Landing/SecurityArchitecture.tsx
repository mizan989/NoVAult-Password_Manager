import React from "react";
import { motion } from "framer-motion";
import { Shield, KeyRound, Server, Unlock, CheckCircle2, ArrowRight } from "lucide-react";
import SpotlightCard from "../Animation/SpotlightCard";

export default function SecurityArchitecture() {
  const steps = [
    {
      num: "01",
      title: "Create Master Password",
      desc: "You choose a master password. It stays strictly on your device and is never transmitted to or stored on our servers.",
      icon: KeyRound,
    },
    {
      num: "02",
      title: "Encrypted Locally",
      desc: "Your browser encrypts each password and note using AES-256 before anything ever leaves your device.",
      icon: Shield,
    },
    {
      num: "03",
      title: "Zero-Knowledge Cloud",
      desc: "Our database stores only scrambled text. Without your master password, it is completely impossible to decipher.",
      icon: Server,
    },
    {
      num: "04",
      title: "Unlock On Demand",
      desc: "Log in securely from your devices to instantly decrypt and view your passwords directly in memory.",
      icon: Unlock,
    },
  ];

  return (
    <section id="security" className="py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-700 mb-3">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Privacy by Design</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
            How Zero-Knowledge Protects You
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            A simple 4-step workflow that ensures your secrets remain strictly yours at all times.
          </p>
        </motion.div>

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
