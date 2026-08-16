import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, KeyRound, ArrowRight, Eye, EyeOff, ShieldAlert } from "lucide-react";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { useVaultUnlock } from "../hooks/useVaultUnlock";
import { AuthShell } from "./Register";

export default function Unlock() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const { unlock } = useVaultUnlock();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await unlock(password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Incorrect master password. Please verify.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Unlock Your Vault"
      subtitle="Enter your Master Password to derive your AES-256 decryption key."
    >
      <motion.div
        animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 border border-blue-100 shadow-soft">
          <Lock className="h-8 w-8" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Master Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••••••••••"
            leftIcon={<KeyRound className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
          />

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-600 font-medium">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full mt-1">
            <span>Unlock Vault</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </form>

        <p className="mt-6 text-center text-[11px] text-slate-400">
          Decryption key derived in browser memory • Purged on session lock
        </p>
      </motion.div>
    </AuthShell>
  );
}
