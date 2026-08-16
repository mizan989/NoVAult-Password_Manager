import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Copy,
  Star,
  Trash2,
  Pencil,
  Check,
  Globe,
  KeyRound,
  StickyNote,
  ExternalLink,
} from "lucide-react";
import { VaultItem } from "../../types";
import DecryptText from "../Animation/DecryptText";
import { useToast } from "../../hooks/useToast";

interface Props {
  item: VaultItem;
  onDelete: (id: string) => void;
  onEdit: (item: VaultItem) => void;
  onToggleFavourite: (item: VaultItem) => void;
}

export default function VaultItemCard({ item, onDelete, onEdit, onToggleFavourite }: Props) {
  const [revealed, setRevealed] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { showToast } = useToast();

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast({
      title: `${label} Copied`,
      description: "Copied to clipboard safely",
      type: "success",
    });
    setTimeout(() => setCopiedField(null), 1800);
  };

  const title = item.data.title || "Untitled";
  const initial = title.charAt(0).toUpperCase() || "V";

  // Color generator for avatar based on title
  const getGradient = (str: string) => {
    const gradients = [
      "from-blue-500 to-indigo-600",
      "from-emerald-500 to-teal-600",
      "from-violet-500 to-purple-600",
      "from-amber-500 to-orange-600",
      "from-rose-500 to-pink-600",
      "from-cyan-500 to-blue-600",
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col justify-between rounded-2xl border border-vault-border bg-white p-5 shadow-card hover:border-blue-200 hover:shadow-glow transition-all duration-200"
    >
      <div>
        {/* Header: Icon, Title, Username, Favourite Star */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr ${getGradient(
                title
              )} text-sm font-bold text-white shadow-xs`}
            >
              {initial}
            </div>
            <div>
              <h3 className="font-heading text-sm font-semibold text-slate-900 line-clamp-1">
                {title}
              </h3>
              {item.data.username ? (
                <p className="text-xs text-slate-500 line-clamp-1">{item.data.username}</p>
              ) : item.data.url ? (
                <a
                  href={item.data.url.startsWith("http") ? item.data.url : `https://${item.data.url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[11px] text-blue-600 hover:underline line-clamp-1"
                >
                  <span>{item.data.url.replace(/^https?:\/\//, "")}</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              ) : (
                <span className="text-[11px] text-slate-400">Encrypted record</span>
              )}
            </div>
          </div>

          <button
            onClick={() => onToggleFavourite(item)}
            className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
          >
            <Star
              className={`h-4 w-4 transition-transform duration-200 active:scale-125 ${
                item.favourite ? "fill-amber-400 text-amber-500" : "hover:text-amber-400"
              }`}
            />
          </button>
        </div>

        {/* Content Body: Password or Note */}
        {item.type === "password" && item.data.password && (
          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 p-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 overflow-hidden font-mono text-xs text-slate-900">
                {revealed ? (
                  <DecryptText text={item.data.password as string} speed={20} />
                ) : (
                  <span className="tracking-widest text-slate-400 select-none">••••••••••••••</span>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setRevealed(!revealed)}
                  title={revealed ? "Mask password" : "Reveal decrypted password"}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-white hover:text-slate-900 shadow-xs transition-colors"
                >
                  {revealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => copy(item.data.password as string, "Password")}
                  title="Copy password"
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-white hover:text-slate-900 shadow-xs transition-colors"
                >
                  {copiedField === "Password" ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {item.type === "note" && item.data.content && (
          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
            <p className="line-clamp-3 font-sans text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {item.data.content as string}
            </p>
          </div>
        )}
      </div>

      {/* Footer: Category Tag & Actions */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
          {item.category || "General"}
        </span>

        <div className="flex items-center gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          {item.data.username && (
            <button
              onClick={() => copy(item.data.username as string, "Username")}
              title="Copy username"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <span className="text-[10px] font-mono font-semibold">USER</span>
            </button>
          )}
          <button
            onClick={() => onEdit(item)}
            title="Edit item"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            title="Delete item"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
