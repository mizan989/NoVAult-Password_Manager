import React, { createContext, useContext, useState, useCallback } from "react";
import { setVaultUnlockHeader } from "../services/api";
import { authService } from "../services/authService";

interface VaultUnlockContextValue {
  isUnlocked: boolean;
  unlock: (masterPassword: string) => Promise<void>;
  lock: () => void;
}

const VaultUnlockContext = createContext<VaultUnlockContextValue | undefined>(undefined);

/**
 * Holds the master password in memory only (React state), for the current
 * browser session. Never written to localStorage/sessionStorage/cookies.
 * Closing the tab or calling lock() clears it immediately.
 */
export function VaultUnlockProvider({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const unlock = useCallback(async (masterPassword: string) => {
    await authService.verifyMasterPassword(masterPassword);
    setVaultUnlockHeader(masterPassword);
    setIsUnlocked(true);
  }, []);

  const lock = useCallback(() => {
    setVaultUnlockHeader(null);
    setIsUnlocked(false);
  }, []);

  return (
    <VaultUnlockContext.Provider value={{ isUnlocked, unlock, lock }}>
      {children}
    </VaultUnlockContext.Provider>
  );
}

export function useVaultUnlock() {
  const ctx = useContext(VaultUnlockContext);
  if (!ctx) throw new Error("useVaultUnlock must be used within VaultUnlockProvider");
  return ctx;
}
