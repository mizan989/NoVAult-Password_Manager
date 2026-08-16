import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-vault-accent text-white hover:bg-vault-accentHover active:bg-blue-700 shadow-soft hover:shadow-glow focus:ring-vault-accent",
    secondary:
      "bg-white text-vault-text border border-vault-border hover:bg-slate-50 hover:border-slate-300 shadow-subtle focus:ring-slate-400",
    outline:
      "bg-transparent text-vault-accent border border-vault-accentBorder hover:bg-vault-accentSoft focus:ring-vault-accent",
    ghost:
      "bg-transparent text-vault-text hover:bg-slate-100/80 active:bg-slate-200/80 focus:ring-slate-400",
    danger:
      "bg-vault-danger text-white hover:bg-red-600 active:bg-red-700 shadow-soft focus:ring-vault-danger",
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      whileHover={{ scale: disabled || loading ? 1 : 1.01 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}
