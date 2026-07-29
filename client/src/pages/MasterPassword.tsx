import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { authService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { useVaultUnlock } from "../hooks/useVaultUnlock";
import { AuthShell } from "./Register";

export default function MasterPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const { unlock } = useVaultUnlock();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 10) {
      setError("Master password must be at least 10 characters");
      return;
    }
    setLoading(true);
    try {
      await authService.createMasterPassword(password);
      await refreshUser();
      await unlock(password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not create master password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Create your Master Password">
      <p className="mb-4 text-center text-xs text-vault-muted">
        This unlocks your vault. Unlike your account password, we never store it — only you know it.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Master password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          label="Confirm master password"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        {error && <p className="text-xs text-vault-danger">{error}</p>}
        <Button type="submit" loading={loading} className="w-full">
          Create vault
        </Button>
      </form>
    </AuthShell>
  );
}
