import React, { useState } from "react";
import { Search, LogOut, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { useVaultUnlock } from "../../hooks/useVaultUnlock";

export default function Navbar({ onSearch }: { onSearch?: (q: string) => void }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { user, logout } = useAuth();
  const { lock } = useVaultUnlock();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-vault-border bg-vault-bg/80 px-6 py-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <AnimatePresence initial={false}>
          {searchOpen ? (
            <motion.input
              key="search-input"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                onSearch?.(e.target.value);
              }}
              onBlur={() => !query && setSearchOpen(false)}
              placeholder="Search vault..."
              className="rounded-full border border-vault-border bg-vault-surface px-4 py-2 text-sm outline-none"
            />
          ) : (
            <motion.button
              key="search-icon"
              onClick={() => setSearchOpen(true)}
              className="rounded-full p-2 text-vault-muted hover:bg-vault-border/50"
            >
              <Search className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden text-sm text-vault-muted sm:inline">{user?.name}</span>
        <button
          onClick={lock}
          title="Lock vault"
          className="rounded-full p-2 text-vault-muted hover:bg-vault-border/50 transition-colors duration-250"
        >
          <Lock className="h-5 w-5" />
        </button>
        <button
          onClick={logout}
          title="Log out"
          className="rounded-full p-2 text-vault-muted hover:bg-vault-border/50 transition-colors duration-250"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
