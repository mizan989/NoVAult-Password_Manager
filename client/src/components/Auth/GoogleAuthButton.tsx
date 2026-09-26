import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";

interface GoogleAuthButtonProps {
  text?: string;
  onError?: (msg: string) => void;
}

export default function GoogleAuthButton({
  text = "Continue with Google",
  onError,
}: GoogleAuthButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const handleCredentialResponse = async (response: any) => {
      setLoading(true);
      try {
        const { user } = await authService.googleAuth(response.credential);
        await refreshUser();
        navigate(user.hasMasterPassword ? "/unlock" : "/master-password");
      } catch (err: any) {
        onError?.(err?.response?.data?.message || "Google authentication failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const initGoogle = () => {
      // @ts-ignore
      if (window.google?.accounts?.id && containerRef.current) {
        try {
          const containerWidth = containerRef.current.parentElement?.clientWidth || 360;
          // @ts-ignore
          window.google.accounts.id.initialize({
            client_id:
              import.meta.env.VITE_GOOGLE_CLIENT_ID ||
              "11614769758-dmuucdojirtgphb45qs6gjq0q000megg.apps.googleusercontent.com",
            callback: handleCredentialResponse,
          });

          // @ts-ignore
          window.google.accounts.id.renderButton(containerRef.current, {
            theme: "outline",
            size: "large",
            width: Math.min(Math.max(containerWidth, 240), 400),
            text: "continue_with",
            shape: "rectangular",
            logo_alignment: "left",
          });
          setRendered(true);
          return true;
        } catch {
          return false;
        }
      }
      return false;
    };

    if (!initGoogle()) {
      const interval = setInterval(() => {
        if (initGoogle()) clearInterval(interval);
      }, 200);
      const timer = setTimeout(() => clearInterval(interval), 5000);
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [navigate, refreshUser, onError]);

  const handleManualPrompt = () => {
    // @ts-ignore
    if (window.google?.accounts?.id) {
      // @ts-ignore
      window.google.accounts.id.prompt();
    } else {
      onError?.("Google authentication is initializing. Please wait a moment or verify your connection.");
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      {/* 1. Visually rendered minimalist button: always displays "Continue with Google", never personalizes */}
      <div
        className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors select-none cursor-pointer shadow-none"
      >
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>{loading ? "Authenticating with Google..." : text}</span>
      </div>

      {/* 2. Google GSI container overlay: captures click and triggers native Google login */}
      <div
        ref={containerRef}
        onClick={handleManualPrompt}
        className="absolute inset-0 z-10 flex items-center justify-center opacity-[0.001] cursor-pointer [&>div]:!w-full [&>div]:!h-full [&_iframe]:!w-full [&_iframe]:!h-full [&_iframe]:!scale-125"
      />
    </div>
  );
}
