import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-vault-text">{label}</label>
        )}
        <input
          ref={ref}
          className={`w-full rounded-xl border border-vault-border bg-vault-surface px-4 py-2.5 text-sm text-vault-text outline-none transition-all duration-250 focus:border-vault-accent focus:ring-2 focus:ring-vault-accentSoft ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-vault-danger">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export default Input;
