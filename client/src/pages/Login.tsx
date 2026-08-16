import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { authService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { AuthShell } from "./Register";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
          } catch {
            setError("Google sign-in failed. Please try again.");
          }
        },
      });
      // @ts-ignore
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "large",
        width: 320,
        shape: "pill",
      });
    }
  }, [navigate, refreshUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { user } = await authService.login(email, password);
      await refreshUser();
      navigate(user.hasMasterPassword ? "/unlock" : "/master-password");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid credentials. Please verify and retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Authenticate to access your encrypted digital vault."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />

        <Input
          label="Account Password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••••••"
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-700"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-600 font-medium">
            {error}
          </div>
        )}

        <Button type="submit" loading={loading} className="w-full mt-1">
          <span>Sign In to Vault</span>
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </form>

      {/* Social Google Divider */}
      <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
        <div className="h-px flex-1 bg-slate-200" />
        <span>OR</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div ref={googleBtnRef} className="flex justify-center" />

      <p className="mt-6 text-center text-xs text-slate-500">
        Don't have a vault yet?{" "}
        <Link to="/register" className="font-semibold text-blue-600 hover:underline">
          Create account
        </Link>
      </p>
    </AuthShell>
  );
}
