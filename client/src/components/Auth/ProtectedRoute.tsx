import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useVaultUnlock } from "../../hooks/useVaultUnlock";

/** Requires a logged-in user; redirects to /login otherwise. */
export function RequireUser({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth();
  if (loading) return <FullScreenLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

/** Requires the vault to be unlocked with the master password this session. */
export function RequireVaultUnlock({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth();
  const { isUnlocked } = useVaultUnlock();

  if (loading) return <FullScreenLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.hasMasterPassword) return <Navigate to="/master-password" replace />;
  if (!isUnlocked) return <Navigate to="/unlock" replace />;
  return children;
}

function FullScreenLoader() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-vault-bg">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-vault-accent border-t-transparent" />
    </div>
  );
}
