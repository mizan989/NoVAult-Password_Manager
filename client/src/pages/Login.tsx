import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { authService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { AuthShell } from "./Register";
import { useEffect, useRef } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const googleBtnRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  // @ts-ignore
  if (window.google && googleBtnRef.current) {
    // @ts-ignore
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response: any) => {
        try {
          const { user } = await authService.googleAuth(response.credential);
          await refreshUser();
          navigate(user.hasMasterPassword ? "/unlock" : "/master-password");
        } catch (err) {
          setError("Google sign-in failed");
        }
      },
    });
    // @ts-ignore
    window.google.accounts.id.renderButton(googleBtnRef.current, {
      theme: "outline",
      size: "large",
      width: 320,
    });
  }
}, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { user } = await authService.login(email, password);
      await refreshUser();
      navigate(user.hasMasterPassword ? "/unlock" : "/master-password");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-xs text-vault-danger">{error}</p>}
        <Button type="submit" loading={loading} className="w-full">
          Log in
        </Button>
      </form>
      <div className="my-4 flex items-center gap-2 text-xs text-vault-muted">
      <div className="h-px flex-1 bg-vault-border" /> OR <div className="h-px flex-1 bg-vault-border" />
      </div>
      <div ref={googleBtnRef} className="flex justify-center" />

      <p className="mt-4 text-center text-sm text-vault-muted">
        Don't have an account?{" "}
        <Link to="/register" className="text-vault-accent">
          Sign up
        </Link>
      </p>
    </AuthShell>
  );
}
