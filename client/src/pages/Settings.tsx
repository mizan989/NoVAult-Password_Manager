import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";

export default function Settings() {
  const { user, logout, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      await authService.updateName(name);
      await refreshUser();
      setEditing(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not update name");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 font-heading text-2xl font-semibold">Settings</h1>

      <div className="rounded-2xl border border-vault-border bg-vault-surface p-6">
        <div className="mb-4 flex items-center justify-between text-sm">
          <span className="text-vault-muted">Name</span>
          {editing ? (
            <div className="flex items-center gap-2">
              <Input value={name} onChange={(e) => setName(e.target.value)} className="w-40" />
            </div>
          ) : (
            <span>{user?.name}</span>
          )}
        </div>

        {editing && (
          <div className="mb-4 flex justify-end gap-2">
            {error && <p className="mr-auto text-xs text-vault-danger">{error}</p>}
            <Button
              variant="ghost"
              onClick={() => {
                setEditing(false);
                setName(user?.name || "");
                setError("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving}>
              Save
            </Button>
          </div>
        )}

        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="mb-4 text-xs text-vault-accent"
          >
            Edit name
          </button>
        )}

        <div className="mb-4 flex justify-between text-sm">
          <span className="text-vault-muted">Email</span>
          <span>{user?.email}</span>
        </div>
        <div className="mb-4 flex justify-between text-sm">
          <span className="text-vault-muted">Sign-in method</span>
          <span className="capitalize">{user?.provider}</span>
        </div>

        <button
          onClick={logout}
          className="mt-4 w-full rounded-xl border border-vault-danger/30 py-2.5 text-sm text-vault-danger transition-colors duration-250 hover:bg-vault-danger/5"
        >
          Log out
        </button>
      </div>
    </div>
  );
}