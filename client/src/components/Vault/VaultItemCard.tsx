import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Copy, Star, Trash2, Pencil } from "lucide-react";
import { VaultItem } from "../../types";

interface Props {
  item: VaultItem;
  onDelete: (id: string) => void;
  onEdit: (item: VaultItem) => void;
  onToggleFavourite: (item: VaultItem) => void;
}

export default function VaultItemCard({ item, onDelete, onEdit, onToggleFavourite }: Props) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="group relative rounded-2xl border border-vault-border bg-vault-surface p-4 transition-all duration-250 hover:shadow-soft"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-heading text-sm font-semibold text-vault-text">
            {item.data.title || "Untitled"}
          </h3>
          {item.data.username && (
            <p className="text-xs text-vault-muted">{item.data.username}</p>
          )}
        </div>

        <button onClick={() => onToggleFavourite(item)}>
          <Star
            className={`h-4 w-4 transition-colors duration-250 ${
              item.favourite ? "fill-vault-accent text-vault-accent" : "text-vault-muted"
            }`}
          />
        </button>
      </div>

      {item.type === "password" && item.data.password && (
        <div className="mt-3 flex items-center gap-2">
          <span
            className={`flex-1 truncate rounded-lg bg-vault-bg px-3 py-1.5 font-mono text-xs ${
              revealed ? "decrypt-reveal" : ""
            }`}
          >
            {revealed ? item.data.password : "••••••••••••"}
          </span>
          <button onClick={() => setRevealed((r) => !r)} className="text-vault-muted">
            {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          <button
            onClick={() => copy(item.data.password as string, "password")}
            className="text-vault-muted"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
      )}

      {item.type === "note" && item.data.content && (
        <p className="mt-3 line-clamp-3 text-xs text-vault-muted">{item.data.content}</p>
      )}

      {copied && (
        <span className="absolute -top-2 right-3 rounded-full bg-vault-accent px-2 py-0.5 text-[10px] text-white">
          Copied {copied}
        </span>
      )}

      <div className="mt-3 flex items-center justify-between opacity-0 transition-opacity duration-250 group-hover:opacity-100">
        <span className="rounded-full bg-vault-accentSoft px-2 py-0.5 text-[10px] text-vault-accent">
          {item.category}
        </span>
        <div className="flex gap-2">
          <button onClick={() => onEdit(item)} className="text-vault-muted hover:text-vault-text">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="text-vault-muted hover:text-vault-danger"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
