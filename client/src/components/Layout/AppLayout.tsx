import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";
import ToastContainer from "../UI/Toast";
import CommandPalette from "../UI/CommandPalette";
import AddVaultItemModal from "../Vault/AddVaultItemModal";
import { vaultService } from "../../services/vaultService";
import { VaultItemType } from "../../types";
import { useToast } from "../../hooks/useToast";

export default function AppLayout() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const { showToast } = useToast();
  const location = useLocation();

  const handleSaveItem = async (type: VaultItemType, category: string, data: Record<string, unknown>) => {
    await vaultService.create(type, category, false, data);
    showToast({
      title: "Item Saved",
      description: `Saved ${data.title || "new item"} to vault`,
      type: "success",
    });
    // Trigger window custom event so Vault & Dashboard pages refresh automatically
    window.dispatchEvent(new CustomEvent("vault-items-updated"));
  };

  return (
    <div className="flex min-h-screen bg-vault-bg text-slate-900 selection:bg-blue-500 selection:text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onOpenAddModal={() => setAddModalOpen(true)}
        />
        <main className="flex-1 p-5 sm:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
          <Outlet />
        </main>
        <footer className="border-t border-vault-border bg-white px-6 py-4 text-center text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-6xl mx-auto">
            <span>
              Built by <span className="font-semibold text-slate-800">Md Mizan</span> as a portfolio project.
            </span>
            <span className="text-[11px] text-slate-400">
              Zero-Knowledge AES-256-GCM + Argon2id Client Engine
            </span>
          </div>
        </footer>
        <MobileNav />
      </div>

      {/* Global Command Palette (⌘K) */}
      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenAddModal={() => setAddModalOpen(true)}
      />

      {/* Global Add Item Modal */}
      <AddVaultItemModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleSaveItem}
      />
    </div>
  );
}
