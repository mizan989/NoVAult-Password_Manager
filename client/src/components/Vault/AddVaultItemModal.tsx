import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { VaultItem, VaultItemType } from "../../types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (type: VaultItemType, category: string, data: Record<string, unknown>) => Promise<void>;
  initial?: VaultItem | null;
  defaultType?: VaultItemType;
}

export default function AddVaultItemModal({ open, onClose, onSave, initial, defaultType = "password" }: Props) {
  const [type, setType] = useState<VaultItemType>(defaultType);
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setType(initial.type);
      setTitle(initial.data.title || "");
      setUsername(initial.data.username || "");
      setPassword(initial.data.password || "");
      setUrl(initial.data.url || "");
      setContent(initial.data.content || "");
      setCategory(initial.category);
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

  const handleSave = async () => {
    setSaving(true);
    try {
      const data =
        type === "password"
          ? { title, username, password, url }
          : { title, content };
      await onSave(type, category, data);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-vault-border bg-vault-surface p-6 shadow-soft"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold">
                {initial ? "Edit item" : type === "password" ? "Add password" : "Add note"}
              </h2>
              <button onClick={onClose}>
                <X className="h-5 w-5 text-vault-muted" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

              {type === "password" ? (
                <>
                  <Input label="Username / Email" value={username} onChange={(e) => setUsername(e.target.value)} />
                  <Input label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <Input label="Website URL" value={url} onChange={(e) => setUrl(e.target.value)} />
                </>
              ) : (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-vault-text">Content</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-vault-border bg-vault-surface px-4 py-2.5 text-sm outline-none focus:border-vault-accent focus:ring-2 focus:ring-vault-accentSoft"
                  />
                </div>
              )}

              <Input label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave} loading={saving}>
                Save
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
