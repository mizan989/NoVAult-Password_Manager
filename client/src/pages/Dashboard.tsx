import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  KeyRound,
  StickyNote,
  Star,
  ShieldCheck,
  Plus,
  Wand2,
  Lock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { vaultService } from "../services/vaultService";
import { VaultItem } from "../types";
import { useAuth } from "../hooks/useAuth";
import SpotlightCard from "../components/Animation/SpotlightCard";
import VaultItemCard from "../components/Vault/VaultItemCard";
import AddVaultItemModal from "../components/Vault/AddVaultItemModal";
import { scorePasswordStrength } from "../utils/passwordStrength";

export default function Dashboard() {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null);
  const { user } = useAuth();

  const loadData = async () => {
    try {
      const data = await vaultService.list();
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Listen for updates triggered by AppLayout or other modals
    const handleUpdate = () => loadData();
    window.addEventListener("vault-items-updated", handleUpdate);
    return () => window.removeEventListener("vault-items-updated", handleUpdate);
  }, []);

  const passwordItems = items.filter((i) => i.type === "password");
  const noteItems = items.filter((i) => i.type === "note");
  const favouriteItems = items.filter((i) => i.favourite);
  const recent = [...items]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 4);

  // Calculate vault health rating based on password strength
  let strongCount = 0;
  passwordItems.forEach((item) => {
    if (item.data.password) {
      const s = scorePasswordStrength(item.data.password as string);
      if (s.score >= 3) strongCount++;
    }
  });

  const healthScore =
    passwordItems.length > 0
      ? Math.round((strongCount / passwordItems.length) * 100)
      : 100;

  const handleDelete = async (id: string) => {
    await vaultService.remove(id);
    await loadData();
  };

  const handleToggleFavourite = async (item: VaultItem) => {
    await vaultService.update(item.id, { favourite: !item.favourite });
    await loadData();
  };

  const handleSaveItem = async (type: any, category: string, data: Record<string, unknown>) => {
    if (editingItem) {
      await vaultService.update(editingItem.id, { category, data });
    } else {
      await vaultService.create(type, category, false, data);
    }
    setEditingItem(null);
    await loadData();
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner with Security Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-2xl sm:text-3xl font-bold text-slate-900"
          >
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </motion.h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Your Zero-Knowledge vault is unlocked and active in session memory.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-vault-accent px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-glow hover:bg-vault-accentHover transition-all duration-200 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Vault Item</span>
        </button>
      </div>

      {/* Security Health & Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Health Score Gauge Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:col-span-4"
        >
          <SpotlightCard className="h-full p-6 bg-white border-slate-200 shadow-card flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Vault Health Rating
              </span>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                Protected
              </span>
            </div>

            <div className="my-4 flex items-center gap-5">
              {/* Circular Gauge */}
              <div className="relative flex h-20 w-20 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500 transition-all duration-1000 ease-out"
                    strokeDasharray={`${healthScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute font-heading text-lg font-bold text-slate-900">
                  {healthScore}%
                </span>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  {strongCount} of {passwordItems.length} Strong
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  AES-256-GCM encrypted records
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Master Key:</span>
              <span className="font-mono text-emerald-600 font-medium">Argon2id (Active)</span>
            </div>
          </SpotlightCard>
        </motion.div>

        {/* 3 Quick Stat Bento Cards */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatBox
            icon={KeyRound}
            label="Passwords"
            count={passwordItems.length}
            sub="Stored securely"
            linkTo="/vault"
            accent="blue"
          />
          <StatBox
            icon={StickyNote}
            label="Secure Notes"
            count={noteItems.length}
            sub="Encrypted texts"
            linkTo="/notes"
            accent="indigo"
          />
          <StatBox
            icon={Star}
            label="Favourites"
            count={favouriteItems.length}
            sub="Starred records"
            linkTo="/vault"
            accent="amber"
          />
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-sm font-bold text-slate-900">
            Quick Actions & Tools
          </h2>
          <span className="text-xs text-slate-400">Shortcuts</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/generator"
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors shadow-xs"
          >
            <div className="rounded-lg bg-blue-100 text-blue-700 p-2">
              <Wand2 className="h-4 w-4" />
            </div>
            <span>Password Studio</span>
          </Link>

          <button
            onClick={() => {
              setEditingItem(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-colors shadow-xs text-left"
          >
            <div className="rounded-lg bg-emerald-100 text-emerald-700 p-2">
              <KeyRound className="h-4 w-4" />
            </div>
            <span>New Password</span>
          </button>

          <Link
            to="/notes"
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-colors shadow-xs"
          >
            <div className="rounded-lg bg-indigo-100 text-indigo-700 p-2">
              <StickyNote className="h-4 w-4" />
            </div>
            <span>Encrypted Note</span>
          </Link>

          <Link
            to="/settings"
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-xs"
          >
            <div className="rounded-lg bg-slate-200 text-slate-700 p-2">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span>Security Settings</span>
          </Link>
        </div>
      </div>

      {/* Recent Items Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-base font-bold text-slate-900">
            Recent Vault Items
          </h2>
          <Link
            to="/vault"
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            <span>View all items</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-36 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3">
              <KeyRound className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-sm font-semibold text-slate-800">
              No items in your vault yet
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Add your first encrypted password or private note to start securing your digital secrets.
            </p>
            <button
              onClick={() => {
                setEditingItem(null);
                setModalOpen(true);
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-vault-accent px-4 py-2 text-xs font-semibold text-white shadow-soft"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add First Item</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recent.map((item) => (
              <VaultItemCard
                key={item.id}
                item={item}
                onDelete={handleDelete}
                onEdit={(i) => {
                  setEditingItem(i);
                  setModalOpen(true);
                }}
                onToggleFavourite={handleToggleFavourite}
              />
            ))}
          </div>
        )}
      </div>

      <AddVaultItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveItem}
        initial={editingItem}
      />
    </div>
  );
}

function StatBox({
  icon: Icon,
  label,
  count,
  sub,
  linkTo,
  accent,
}: {
  icon: any;
  label: string;
  count: number;
  sub: string;
  linkTo: string;
  accent: "blue" | "indigo" | "amber";
}) {
  const styles = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <Link to={linkTo}>
      <SpotlightCard className="h-full p-5 bg-white border-slate-200 shadow-card hover:border-blue-200 transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className={`rounded-xl p-2.5 ${styles[accent]} border`}>
            <Icon className="h-5 w-5" />
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-blue-500" />
        </div>
        <p className="font-heading text-2xl font-bold text-slate-900">{count}</p>
        <p className="text-xs font-medium text-slate-700 mt-0.5">{label}</p>
        <p className="text-[11px] text-slate-400">{sub}</p>
      </SpotlightCard>
    </Link>
  );
}
