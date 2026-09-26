import React, { createContext, useContext, useState, useCallback } from "react";
import { authService } from "../services/authService";
import { deriveMasterKey, deriveAuthHash, setActiveCryptoKey } from "../utils/crypto";

interface VaultUnlockContextValue {
  isUnlocked: boolean;
  unlock: (masterPassword: string) => Promise<void>;
  lock: () => void;
}

const VaultUnlockContext = createContext<VaultUnlockContextValue | undefined>(undefined);

/**
 * Holds the derived non-extractable CryptoKey in memory only for the current browser session.
 * Raw master password is never stored or transmitted over network.
 * Closing the tab or calling lock() purges the key immediately.
 */
export function VaultUnlockProvider({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const unlock = useCallback(async (masterPassword: string) => {
    const user = await authService.me();
    if (!user.salt) {
      throw new Error("Unable to retrieve vault salt. Please log in again.");
    }

    const authHash = await deriveAuthHash(masterPassword, user.salt);
    await authService.verifyMasterPassword(authHash);

    const masterKey = await deriveMasterKey(masterPassword, user.salt);
    setActiveCryptoKey(masterKey);
    setIsUnlocked(true);
  }, []);

  const lock = useCallback(() => {
    setActiveCryptoKey(null);
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
