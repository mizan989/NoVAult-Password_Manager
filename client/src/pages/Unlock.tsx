import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { useVaultUnlock } from "../hooks/useVaultUnlock";
import { AuthShell } from "./Register";

export default function Unlock() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { unlock } = useVaultUnlock();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await unlock(password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Incorrect master password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Unlock your vault">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Master password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          required
        />
        {error && <p className="text-xs text-vault-danger">{error}</p>}
        <Button type="submit" loading={loading} className="w-full">
          Unlock
        </Button>
      </form>
    </AuthShell>
  );
}
