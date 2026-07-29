import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, StickyNote, Star } from "lucide-react";
import { vaultService } from "../services/vaultService";
import { VaultItem } from "../types";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const [items, setItems] = useState<VaultItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    vaultService.list().then(setItems).catch(() => setItems([]));
  }, []);

  const passwordCount = items.filter((i) => i.type === "password").length;
  const noteCount = items.filter((i) => i.type === "note").length;
  const favouriteCount = items.filter((i) => i.favourite).length;
  const recent = [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-1 font-heading text-2xl font-semibold"
      >
        Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
      </motion.h1>
      <p className="mb-8 text-sm text-vault-muted">Here's what's in your vault.</p>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={KeyRound} label="Passwords" value={passwordCount} />
        <StatCard icon={StickyNote} label="Secure Notes" value={noteCount} />
        <StatCard icon={Star} label="Favourites" value={favouriteCount} />
      </div>

      <h2 className="mb-3 font-heading text-sm font-semibold text-vault-muted">Recent items</h2>
      <div className="flex flex-col gap-2">
        {recent.length === 0 && (
          <p className="text-sm text-vault-muted">Nothing here yet. Add your first item.</p>
        )}
        {recent.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-xl border border-vault-border bg-vault-surface px-4 py-3 text-sm transition-colors duration-250 hover:bg-vault-accentSoft/40"
          >
            <span>{item.data.title || "Untitled"}</span>
            <span className="text-xs text-vault-muted">{item.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-vault-border bg-vault-surface p-5"
    >
      <Icon className="mb-3 h-5 w-5 text-vault-accent" />
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs text-vault-muted">{label}</p>
    </motion.div>
  );
}
