import React from "react";
import { Search, LogOut, Lock, Plus, Command } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useVaultUnlock } from "../../hooks/useVaultUnlock";
import { useToast } from "../../hooks/useToast";

interface NavbarProps {
  onOpenCommandPalette?: () => void;
  onOpenAddModal?: () => void;
}

export default function Navbar({ onOpenCommandPalette, onOpenAddModal }: NavbarProps) {
  const { user, logout } = useAuth();
  const { lock } = useVaultUnlock();
  const { showToast } = useToast();

  const handleLock = () => {
    lock();
    showToast({
      title: "Vault Locked",
      description: "Master decryption key cleared from active session",
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
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-vault-border bg-white/90 px-6 py-3.5 backdrop-blur-md shadow-subtle">
      {/* Search Bar / Command Palette Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2.5 rounded-xl border border-vault-border bg-slate-50/90 px-3.5 py-1.5 text-xs text-slate-500 shadow-subtle hover:bg-slate-100 hover:border-slate-300 transition-all duration-200"
        >
          <Search className="h-4 w-4 text-slate-400" />
          <span className="hidden sm:inline">Search vault or commands...</span>
          <span className="inline sm:hidden">Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded bg-white px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500 border border-slate-200">
            <Command className="h-2.5 w-2.5" /> K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {onOpenAddModal && (
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-vault-accent px-3 py-1.5 text-xs font-semibold text-white shadow-soft hover:bg-vault-accentHover transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Add Item</span>
          </button>
        )}

        <div className="h-4 w-px bg-slate-200 mx-1" />

        {/* Lock Vault */}
        <button
          onClick={handleLock}
          title="Lock Vault (Purge Session Key)"
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-subtle hover:bg-slate-50 hover:border-slate-300 transition-colors"
        >
          <Lock className="h-4 w-4 text-amber-600" />
          <span className="hidden lg:inline text-xs font-medium">Lock</span>
        </button>

        {/* Log Out */}
        <button
          onClick={logout}
          title="Log out"
          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 shadow-subtle hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 py-1 px-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 text-[10px] font-bold text-white shadow-xs">
            {initials}
          </div>
          <span className="hidden sm:inline text-xs font-medium text-slate-700 max-w-[120px] truncate">
            {user?.name || "User"}
          </span>
        </div>
      </div>
    </header>
  );
}
