import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { authService } from "../services/authService";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.register(name, email, password);
      navigate("/verify-otp", { state: { email } });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Create your account">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        {error && <p className="text-xs text-vault-danger">{error}</p>}
        <Button type="submit" loading={loading} className="w-full">
          Continue
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-vault-muted">
        Already have an account?{" "}
        <Link to="/login" className="text-vault-accent">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-vault-bg px-6">
      <div className="w-full max-w-sm rounded-2xl border border-vault-border bg-vault-surface p-8 shadow-soft">
        <h1 className="mb-6 text-center font-heading text-xl font-semibold">{title}</h1>
        {children}
      </div>
    </div>
  );
}
