import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, KeyRound, StickyNote, ArrowUpDown } from "lucide-react";
import Button from "../components/UI/Button";
import VaultItemCard from "../components/Vault/VaultItemCard";
import AddVaultItemModal from "../components/Vault/AddVaultItemModal";
import { vaultService } from "../services/vaultService";
import { VaultItem, VaultItemType } from "../types";
import { useToast } from "../hooks/useToast";

const CATEGORIES = ["All", "General", "Personal", "Work", "Finance", "Social", "Development"];
type SortOption = "updated" | "title" | "favourite";

export default function VaultPage({ type = "password" }: { type?: VaultItemType }) {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<VaultItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("updated");
  const { showToast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await vaultService.list(type));
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    load();
    window.addEventListener("vault-items-updated", load);
    return () => window.removeEventListener("vault-items-updated", load);
  }, [load]);

  const handleSave = async (itemType: VaultItemType, category: string, data: Record<string, unknown>) => {
    if (editing) {
      await vaultService.update(editing.id, { category, data });
      showToast({ title: "Item Updated", description: "Changes saved to vault", type: "success" });
    } else {
      await vaultService.create(itemType, category, false, data);
      showToast({ title: "Item Created", description: "Encrypted and stored in vault", type: "success" });
    }
    setEditing(null);
    await load();
  };

  const handleDelete = async (id: string) => {
    await vaultService.remove(id);
    showToast({ title: "Item Deleted", description: "Record permanently purged", type: "info" });
    await load();
  };

  const handleToggleFavourite = async (item: VaultItem) => {
    await vaultService.update(item.id, { favourite: !item.favourite });
    await load();
  };

  // Filter and Sort Pipeline
  const filteredAndSortedItems = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const isCatAll = selectedCategory === "All";
    const catLower = selectedCategory.toLowerCase();

    return items
      .filter((item) => {
        const matchesCategory = isCatAll || item.category?.toLowerCase() === catLower;
        if (!matchesCategory) return false;
        if (!q) return true;

        return (
          (item.data.title || "").toLowerCase().includes(q) ||
          (item.data.username || "").toLowerCase().includes(q) ||
          (item.data.url || "").toLowerCase().includes(q) ||
          (item.category || "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === "favourite") {
          if (a.favourite === b.favourite) return b.updatedAt.localeCompare(a.updatedAt);
          return a.favourite ? -1 : 1;
        }
        if (sortBy === "title") {
          return (a.data.title || "").localeCompare(b.data.title || "");
        }
        return b.updatedAt.localeCompare(a.updatedAt);
      });
  }, [items, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
            {type === "password" ? (
              <KeyRound className="h-6 w-6 text-blue-600" />
            ) : (
              <StickyNote className="h-6 w-6 text-indigo-600" />
            )}
            <span>{type === "password" ? "Passwords Vault" : "Secure Notes"}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {items.length} {type === "password" ? "passwords" : "notes"} secured with AES-256-GCM
          </p>
        </div>

        <Button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add {type === "password" ? "Password" : "Note"}</span>
        </Button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-2xl border border-vault-border bg-white p-3.5 shadow-card">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            aria-label={`Filter ${type === "password" ? "passwords" : "notes"}`}
            placeholder={`Filter ${type === "password" ? "passwords" : "notes"}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-9 pr-4 py-2 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white transition-colors"
          />
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 px-2.5 py-1.5 text-xs text-slate-600">
          <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
          <select
            aria-label="Sort items"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option value="updated">Recently Modified</option>
            <option value="title">Alphabetical (A-Z)</option>
            <option value="favourite">Favourites First</option>
          </select>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div
        role="tablist"
        aria-label="Category filters"
        className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none"
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? "bg-vault-accent text-white shadow-soft"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Main Grid / List of Items */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-44 rounded-2xl bg-slate-100 animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : filteredAndSortedItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-subtle">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3 border border-blue-100">
            {type === "password" ? <KeyRound className="h-6 w-6" /> : <StickyNote className="h-6 w-6" />}
          </div>
          <h3 className="font-heading text-base font-semibold text-slate-900">
            No items matched your filters
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No ${type} items match "${searchQuery}". Try adjusting your search query.`
              : `You don't have any items in the "${selectedCategory}" category yet.`}
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {filteredAndSortedItems.map((item) => (
              <VaultItemCard
                key={item.id}
                item={item}
                onDelete={handleDelete}
                onEdit={(i) => {
                  setEditing(i);
                  setModalOpen(true);
                }}
                onToggleFavourite={handleToggleFavourite}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Add / Edit Modal */}
      <AddVaultItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editing}
        defaultType={type}
      />
    </div>
  );
}
