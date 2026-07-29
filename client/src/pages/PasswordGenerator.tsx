import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, RefreshCw } from "lucide-react";
import Button from "../components/UI/Button";
import { vaultService } from "../services/vaultService";
import { GeneratorOptions, PasswordStrength } from "../types";
import { strengthColor } from "../utils/passwordStrength";

const defaultOptions: GeneratorOptions = {
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeSimilar: false,
};

export default function PasswordGenerator() {
  const [options, setOptions] = useState<GeneratorOptions>(defaultOptions);
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState<PasswordStrength | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const result = await vaultService.generatePassword(options);
      setPassword(result.password);
      setStrength(result.strength);
    } finally {
      setLoading(false);
    }
  };

  const toggle = (key: keyof GeneratorOptions) =>
    setOptions((o) => ({ ...o, [key]: !o[key] }));

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 font-heading text-2xl font-semibold">Password Generator</h1>

      <div className="rounded-2xl border border-vault-border bg-vault-surface p-6">
        <div className="mb-4 flex items-center gap-2">
          <motion.span
            key={password}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 truncate rounded-xl bg-vault-bg px-4 py-3 font-mono text-sm decrypt-reveal"
          >
            {password || "Click generate..."}
          </motion.span>
          <button
            onClick={() => password && navigator.clipboard.writeText(password)}
            className="rounded-xl border border-vault-border p-3 text-vault-muted hover:bg-vault-border/40"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={generate}
            className="rounded-xl border border-vault-border p-3 text-vault-muted hover:bg-vault-border/40"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {strength && (
          <div className="mb-6">
            <div className="mb-1 h-1.5 w-full overflow-hidden rounded-full bg-vault-border">
              <div
                className={`h-full transition-all duration-250 ${strengthColor(strength.label)}`}
                style={{ width: `${(strength.score / 4) * 100}%` }}
              />
            </div>
            <p className="text-xs text-vault-muted">{strength.label}</p>
          </div>
        )}

        <div className="mb-4">
          <label className="mb-2 flex items-center justify-between text-sm">
            Length: <span className="font-medium">{options.length}</span>
          </label>
          <input
            type="range"
            min={6}
            max={64}
            value={options.length}
            onChange={(e) => setOptions((o) => ({ ...o, length: Number(e.target.value) }))}
            className="w-full accent-vault-accent"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <Toggle label="Uppercase (A-Z)" checked={options.uppercase} onChange={() => toggle("uppercase")} />
          <Toggle label="Lowercase (a-z)" checked={options.lowercase} onChange={() => toggle("lowercase")} />
          <Toggle label="Numbers (0-9)" checked={options.numbers} onChange={() => toggle("numbers")} />
          <Toggle label="Symbols (!@#$)" checked={options.symbols} onChange={() => toggle("symbols")} />
          <Toggle
            label="Exclude similar (il1O0)"
            checked={options.excludeSimilar}
            onChange={() => toggle("excludeSimilar")}
          />
        </div>

        <Button onClick={generate} loading={loading} className="mt-6 w-full">
          Generate password
        </Button>
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-vault-border px-3 py-2 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="accent-vault-accent" />
      {label}
    </label>
  );
}
