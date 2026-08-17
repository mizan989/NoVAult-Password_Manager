import React from "react";
import { motion } from "framer-motion";
import { Lock, Shield, Cpu, Wand2, Eye, KeyRound, Sparkles, Fingerprint } from "lucide-react";
import SpotlightCard from "../Animation/SpotlightCard";

export default function BentoFeatures() {
  const features = [
    {
      icon: Lock,
      title: "Zero-Knowledge Privacy",
      description:
        "Only you hold the key to your vault. Your master password is never sent to or stored on any server, ensuring complete digital confidentiality.",
      badge: "100% Private",
      tagColor: "bg-blue-50 text-blue-700 border-blue-200",
      iconColor: "text-blue-600 bg-blue-50",
    },
    {
      icon: Shield,
      title: "Bank-Grade Encryption",
      description:
        "Every credential and private note is locked with industry-standard AES-256 encryption right on your device before syncing to the cloud.",
      badge: "Bank-Grade Security",
      tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      iconColor: "text-emerald-600 bg-emerald-50",
    },
    {
      icon: Eye,
      title: "Instant Decrypt & Masking",
      description:
        "Passwords remain safely hidden on screen until you choose to reveal them. Quickly copy secrets with auto-clearing clipboard protection.",
      badge: "Peeking Protection",
      tagColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
      iconColor: "text-indigo-600 bg-indigo-50",
    },
    {
      icon: Wand2,
      title: "Smart Password Generator",
      description:
        "Generate unbreakable passwords or easy-to-remember multi-word passphrases with real-time strength and entropy feedback.",
      badge: "Built-in Tool",
      tagColor: "bg-amber-50 text-amber-700 border-amber-200",
      iconColor: "text-amber-600 bg-amber-50",
    },
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/70 px-3.5 py-1 text-xs font-semibold text-blue-700 mb-3">
            <Fingerprint className="h-3.5 w-3.5" />
            <span>Built for Everyone</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
            Security That Puts You in Full Control
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            NoVAult is designed so that even our engineers cannot see or decrypt your passwords under any circumstances.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <SpotlightCard className="h-full p-8 border-slate-200 bg-white hover:border-blue-200 shadow-card">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`rounded-xl p-3 ${f.iconColor} border border-slate-100`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${f.tagColor}`}
                    >
                      {f.badge}
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-semibold text-slate-900 mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {f.description}
                  </p>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
