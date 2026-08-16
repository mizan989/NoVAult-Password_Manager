import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User as UserIcon,
  Shield,
  Lock,
  LogOut,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Mail,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useVaultUnlock } from "../hooks/useVaultUnlock";
import { authService } from "../services/authService";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import SpotlightCard from "../components/Animation/SpotlightCard";
import ConfirmModal from "../components/UI/ConfirmModal";
import { useToast } from "../hooks/useToast";

export default function Settings() {
  const { user, logout, refreshUser } = useAuth();
  const { lock } = useVaultUnlock();
  const { showToast } = useToast();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

  const handleSaveName = async () => {
    setError("");
    setSaving(true);
    try {
      await authService.updateName(name);
      await refreshUser();
      setEditing(false);
      showToast({
        title: "Name Updated",
        description: "Your display name has been updated",
        type: "success",
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not update name");
    } finally {
      setSaving(false);
    }
  };

  const handleLockSession = () => {
    lock();
    showToast({
      title: "Vault Locked",
      description: "Master decryption key cleared from RAM",
      type: "info",
    });
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
          <Shield className="h-6 w-6 text-blue-600" />
          <span>Settings & Security</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your account profile and verify zero-knowledge cryptographic parameters.
        </p>
      </div>

      {/* Profile & Account Details Card */}
      <SpotlightCard className="p-6 sm:p-8 bg-white border-slate-200 shadow-card">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-heading text-lg font-bold text-white shadow-soft">
            {initials}
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900">{user?.name}</h3>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          {/* Display Name Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-slate-100">
            <span className="font-semibold text-slate-700">Display Name</span>
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-lg border border-blue-300 px-3 py-1.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
                />
                <button
                  onClick={handleSaveName}
                  disabled={saving}
                  className="rounded-lg bg-blue-600 p-1.5 text-white hover:bg-blue-700"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setName(user?.name || "");
                    setError("");
                  }}
                  className="rounded-lg bg-slate-100 p-1.5 text-slate-600 hover:bg-slate-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="font-medium text-slate-900">{user?.name}</span>
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                >
                  <Edit2 className="h-3 w-3" />
                  <span>Edit</span>
                </button>
              </div>
            )}
          </div>
          {error && <p className="text-xs text-rose-500">{error}</p>}

          {/* Email Row */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="font-semibold text-slate-700">Email Address</span>
            <span className="font-medium text-slate-900">{user?.email}</span>
          </div>

          {/* Auth Method */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="font-semibold text-slate-700">Authentication Method</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-semibold text-slate-700 capitalize">
              {user?.provider || "Email & Password"}
            </span>
          </div>

          {/* Master Password Status */}
          <div className="flex items-center justify-between py-2">
            <span className="font-semibold text-slate-700">Master Password Protection</span>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 font-semibold text-emerald-700">
              <CheckCircle2 className="h-3 w-3" />
              Configured & Active
            </span>
          </div>
        </div>
      </SpotlightCard>

      {/* Cryptographic Architecture Specifications Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 border border-indigo-100">
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-heading text-sm font-bold text-slate-900">
              Zero-Knowledge Crypto Specifications
            </h3>
            <p className="text-xs text-slate-500">Industry-leading cryptographic primitives</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
            <span className="text-slate-500 block mb-0.5 font-medium">Key Derivation Function:</span>
            <span className="font-mono font-bold text-slate-900">Argon2id (m=64MB, t=3, p=1)</span>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
            <span className="text-slate-500 block mb-0.5 font-medium">Symmetric Encryption:</span>
            <span className="font-mono font-bold text-slate-900">AES-256-GCM (Authenticated)</span>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
            <span className="text-slate-500 block mb-0.5 font-medium">Initialization Vector:</span>
            <span className="font-mono font-bold text-slate-900">96-bit Unique Nonce per Record</span>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
            <span className="text-slate-500 block mb-0.5 font-medium">Tamper Resistance:</span>
            <span className="font-mono font-bold text-slate-900">128-bit MAC Auth Tag</span>
          </div>
        </div>
      </div>

      {/* Session Actions Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h3 className="font-heading text-sm font-bold text-slate-900 mb-4">
          Session & Account Actions
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="secondary"
            onClick={handleLockSession}
            className="flex-1"
          >
            <Lock className="h-4 w-4 text-amber-600" />
            <span>Lock Session (Clear RAM Key)</span>
          </Button>

          <Button
            variant="danger"
            onClick={() => setConfirmLogoutOpen(true)}
            className="flex-1"
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out Account</span>
          </Button>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmModal
        open={confirmLogoutOpen}
        title="Sign Out of NoVAult?"
        message="Logging out will safely terminate your active authenticated session and wipe the master password from memory."
        confirmText="Log Out"
        onConfirm={logout}
        onCancel={() => setConfirmLogoutOpen(false)}
      />
    </div>
  );
}