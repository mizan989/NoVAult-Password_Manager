import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-vault-bg px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <ShieldCheck className="mx-auto mb-6 h-10 w-10 text-vault-accent" />
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          No<span className="text-vault-accent">VA</span>ult
        </h1>
        <p className="mx-auto mt-4 max-w-md text-vault-muted">
          Nothing to see. Everything to protect.
        </p>

        <div className="mt-10 flex justify-center gap-3">
          <Link
            to="/register"
            className="rounded-xl bg-vault-accent px-6 py-3 text-sm font-medium text-white shadow-soft transition-transform duration-250 hover:scale-[1.02]"
          >
            Enter Vault
          </Link>
          <Link
            to="/login"
            className="rounded-xl border border-vault-border px-6 py-3 text-sm font-medium text-vault-text transition-colors duration-250 hover:bg-vault-border/40"
          >
            Log in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
