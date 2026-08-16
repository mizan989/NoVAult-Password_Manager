import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  KeyRound,
  StickyNote,
  Wand2,
  Settings,
  LayoutGrid,
  Lock,
  Plus,
  ArrowRight,
  Shield,
  Command,
} from "lucide-react";
import { vaultService } from "../../services/vaultService";
import { VaultItem } from "../../types";
import { useVaultUnlock } from "../../hooks/useVaultUnlock";
import { useToast } from "../../hooks/useToast";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onOpenAddModal?: () => void;
}

export default function CommandPalette({ open, onClose, onOpenAddModal }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<VaultItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { lock } = useVaultUnlock();
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      vaultService.list().then(setItems).catch(() => setItems([]));
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Global shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const navActions = [
    { id: "dash", label: "Dashboard", category: "Navigation", icon: LayoutGrid, action: () => navigate("/dashboard") },
    { id: "vault", label: "Passwords Vault", category: "Navigation", icon: KeyRound, action: () => navigate("/vault") },
    { id: "notes", label: "Secure Notes", category: "Navigation", icon: StickyNote, action: () => navigate("/notes") },
    { id: "gen", label: "Password Generator", category: "Navigation", icon: Wand2, action: () => navigate("/generator") },
    { id: "set", label: "Settings & Security", category: "Navigation", icon: Settings, action: () => navigate("/settings") },
    {
      id: "add",
      label: "Add New Vault Item",
      category: "Action",
      icon: Plus,
      action: () => {
        onClose();
        onOpenAddModal?.();
      },
    },
    {
      id: "lock",
      label: "Lock Vault Session",
      category: "Action",
      icon: Lock,
      action: () => {
        lock();
        onClose();
        showToast({ title: "Vault Locked", description: "Master key purged from session memory", type: "info" });
      },
    },
  ];

  const filteredVaultItems = items.filter((item) => {
    const title = (item.data.title || "").toLowerCase();
    const username = (item.data.username || "").toLowerCase();
    const category = (item.category || "").toLowerCase();
    const q = query.toLowerCase();
    return title.includes(q) || username.includes(q) || category.includes(q);
  });

  const filteredNavActions = navActions.filter((action) =>
    action.label.toLowerCase().includes(query.toLowerCase())
  );

  const combinedList = [
    ...filteredNavActions.map((a) => ({ type: "action" as const, data: a })),
    ...filteredVaultItems.map((i) => ({ type: "item" as const, data: i })),
  ];

  const handleSelect = (index: number) => {
    const item = combinedList[index];
    if (!item) return;

    if (item.type === "action") {
      item.data.action();
      onClose();
    } else {
      if (item.data.type === "note") {
        navigate("/notes");
      } else {
        navigate("/vault");
      }
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, combinedList.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + combinedList.length) % Math.max(1, combinedList.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(selectedIndex);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/30 backdrop-blur-sm pt-[15vh] px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-vault-border bg-vault-surface shadow-2xl"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 border-b border-vault-border px-4 py-3.5 bg-white">
              <Search className="h-5 w-5 text-vault-muted shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type a command or search vault items..."
                className="w-full bg-transparent text-sm text-vault-text placeholder-vault-subtle outline-none"
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-medium text-vault-muted border border-vault-border">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2">
              {combinedList.length === 0 ? (
                <div className="p-8 text-center text-sm text-vault-muted">
                  No commands or vault items found for "{query}".
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {combinedList.map((entry, idx) => {
                    const isSelected = idx === selectedIndex;

                    if (entry.type === "action") {
                      const Icon = entry.data.icon;
                      return (
                        <button
                          key={entry.data.id}
                          onClick={() => handleSelect(idx)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                            isSelected
                              ? "bg-vault-accentSoft text-vault-accent font-medium"
                              : "text-vault-text hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`rounded-lg p-1.5 ${
                                isSelected ? "bg-blue-100 text-vault-accent" : "bg-slate-100 text-vault-muted"
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <span>{entry.data.label}</span>
                          </div>
                          <span className="text-[11px] text-vault-muted font-normal">
                            {entry.data.category}
                          </span>
                        </button>
                      );
                    }

                    // Vault Item Result
                    const item = entry.data;
                    const isPassword = item.type === "password";

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(idx)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                          isSelected
                            ? "bg-vault-accentSoft text-vault-accent font-medium"
                            : "text-vault-text hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`rounded-lg p-1.5 ${
                              isSelected ? "bg-blue-100 text-vault-accent" : "bg-slate-100 text-vault-muted"
                            }`}
                          >
                            {isPassword ? <KeyRound className="h-4 w-4" /> : <StickyNote className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{item.data.title || "Untitled"}</p>
                            {item.data.username && (
                              <p className="text-xs text-vault-muted font-normal">{item.data.username}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-vault-muted">
                            {item.category}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 text-vault-muted" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer guide */}
            <div className="flex items-center justify-between border-t border-vault-border bg-slate-50/80 px-4 py-2 text-[11px] text-vault-muted">
              <div className="flex items-center gap-3">
                <span>
                  <kbd className="rounded bg-white px-1.5 py-0.5 border border-vault-border">↑</kbd>{" "}
                  <kbd className="rounded bg-white px-1.5 py-0.5 border border-vault-border">↓</kbd> to navigate
                </span>
                <span>
                  <kbd className="rounded bg-white px-1.5 py-0.5 border border-vault-border">↵</kbd> to select
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-vault-accent font-medium">
                <Shield className="h-3 w-3" /> Zero-Knowledge
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
