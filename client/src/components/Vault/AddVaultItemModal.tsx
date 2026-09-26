import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, KeyRound, StickyNote, Wand2, Shield, Sparkles, RefreshCw } from "lucide-react";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { VaultItem, VaultItemType } from "../../types";
import { vaultService } from "../../services/vaultService";
import { scorePasswordStrength, strengthColor } from "../../utils/passwordStrength";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (type: VaultItemType, category: string, data: Record<string, unknown>) => Promise<void>;
  initial?: VaultItem | null;
  defaultType?: VaultItemType;
}

const CATEGORIES = ["General", "Personal", "Work", "Finance", "Social", "Development", "Security"];

export default function AddVaultItemModal({
  open,
  onClose,
  onSave,
  initial,
  defaultType = "password",
}: Props) {
  const [type, setType] = useState<VaultItemType>(defaultType);
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (initial) {
      setType(initial.type);
      setTitle(initial.data.title || "");
      setUsername(initial.data.username || "");
      setPassword(initial.data.password || "");
      setUrl(initial.data.url || "");
      setContent(initial.data.content || "");
      setCategory(initial.category || "General");
    } else {
      setType(defaultType);
      setTitle("");
      setUsername("");
      setPassword("");
      setUrl("");
      setContent("");
      setCategory("General");
    }
  }, [initial, defaultType, open]);

  const handleGenerateInline = async () => {
    setGenerating(true);
    try {
      const result = await vaultService.generatePassword({
        length: 20,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        excludeSimilar: false,
      });
      setPassword(result.password);
    } catch {
      // fallback
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*";
      let pwd = "";
      for (let i = 0; i < 18; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setPassword(pwd);
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data =
        type === "password"
          ? { title: title || "Untitled Password", username, password, url }
          : { title: title || "Untitled Note", content };
      await onSave(type, category, data);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const strength = password ? scorePasswordStrength(password) : null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-vault-border bg-white shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-blue-50 p-2 text-blue-600 border border-blue-100">
                  {type === "password" ? <KeyRound className="h-4 w-4" /> : <StickyNote className="h-4 w-4" />}
                </div>
                <div>
                  <h2 className="font-heading text-base font-bold text-slate-900">
                    {initial ? "Edit Vault Item" : type === "password" ? "Add New Password" : "Add Secure Note"}
                  </h2>
                  <p className="text-[11px] text-slate-500">AES-256-GCM Encrypted</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Type Selector Tabs */}
            {!initial && (
              <div className="flex border-b border-slate-100 bg-slate-50/40 p-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType("password")}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition-all ${
                    type === "password"
                      ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  <span>Password</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType("note")}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition-all ${
                    type === "note"
                      ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <StickyNote className="h-3.5 w-3.5" />
                  <span>Secure Note</span>
                </button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              <Input
                label="Title / Service Name"
                placeholder={type === "password" ? "e.g. GitHub, Google, AWS" : "e.g. Server Recovery Keys"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
              />

              {type === "password" ? (
                <>
                  <Input
                    label="Username / Email"
                    placeholder="name@example.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={handleGenerateInline}
                        disabled={generating}
                        className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <RefreshCw className={`h-3 w-3 ${generating ? "animate-spin" : ""}`} />
                        <span>Generate Strong</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter or generate password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full rounded-xl border border-vault-border bg-white px-3.5 py-2.5 font-mono text-sm text-slate-900 placeholder-vault-subtle shadow-subtle outline-none focus:border-vault-accent focus:ring-2 focus:ring-vault-accentSoft"
                    />

                    {strength && (
                      <div className="mt-2">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full transition-all duration-300 ${strengthColor(strength.label)}`}
                            style={{ width: `${(strength.score / 4) * 100}%` }}
                          />
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                          <span>Entropy Strength: {strength.label}</span>
                          <span>{strength.score}/4 criteria met</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <Input
                    label="Website URL"
                    placeholder="https://..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </>
              ) : (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Encrypted Content
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={5}
                    placeholder="Enter confidential notes, recovery seed phrases, or private keys..."
                    required
                    className="w-full rounded-xl border border-vault-border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-vault-subtle shadow-subtle outline-none focus:border-vault-accent focus:ring-2 focus:ring-vault-accentSoft font-mono"
                  />
                </div>
              )}

              {/* Category Picker */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Category
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                        category === cat
                          ? "bg-blue-600 text-white font-semibold shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
                  Cancel
                </Button>
                <Button type="submit" loading={saving}>
                  {initial ? "Save Changes" : "Save to Vault"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
