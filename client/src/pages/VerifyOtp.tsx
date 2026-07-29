import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { authService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { AuthShell } from "./Register";

export default function VerifyOtp() {
  const location = useLocation();
  const email = (location.state as { email?: string })?.email || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.verifyOtp(email, code);
      await refreshUser();
      navigate("/master-password");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Verify your email">
      <p className="mb-4 text-center text-sm text-vault-muted">
        We sent a 6-digit code to <span className="text-vault-text">{email}</span>
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Verification code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
          required
        />
        {error && <p className="text-xs text-vault-danger">{error}</p>}
        <Button type="submit" loading={loading} className="w-full">
          Verify
        </Button>
      </form>
    </AuthShell>
  );
}
