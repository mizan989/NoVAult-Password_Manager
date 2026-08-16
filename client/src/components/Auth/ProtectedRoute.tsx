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
    <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
      <div className="relative flex flex-col items-center gap-3">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-blue-100 animate-ping opacity-75" />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-blue-200 shadow-card">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          </div>
        </div>
        <p className="text-xs font-semibold text-slate-500 font-mono">Securing Session...</p>
      </div>
    </div>
  );
}
