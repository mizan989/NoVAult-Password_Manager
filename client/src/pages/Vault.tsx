import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Button from "../components/UI/Button";
import VaultItemCard from "../components/Vault/VaultItemCard";
import AddVaultItemModal from "../components/Vault/AddVaultItemModal";
import { vaultService } from "../services/vaultService";
import { VaultItem, VaultItemType } from "../types";

export default function VaultPage({ type = "password" }: { type?: VaultItemType }) {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<VaultItem | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await vaultService.list(type);
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handleSave = async (itemType: VaultItemType, category: string, data: Record<string, unknown>) => {
    if (editing) {
      await vaultService.update(editing.id, { category, data });
    } else {
      await vaultService.create(itemType, category, false, data);
    }
    setEditing(null);
    await load();
  };

  const handleDelete = async (id: string) => {
    await vaultService.remove(id);
    await load();
  };

  const handleToggleFavourite = async (item: VaultItem) => {
    await vaultService.update(item.id, { favourite: !item.favourite });
    await load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold">
          {type === "password" ? "Passwords" : "Secure Notes"}
        </h1>
        <Button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> Add {type === "password" ? "password" : "note"}
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-vault-muted">Decrypting vault...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-vault-muted">Nothing here yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
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
        </div>
      )}

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
