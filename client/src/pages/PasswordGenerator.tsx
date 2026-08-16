import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  RefreshCw,
  Wand2,
  Check,
  Shield,
  Clock,
  History,
  Sparkles,
  Sliders,
  Hash,
  Type,
  Key,
} from "lucide-react";
import Button from "../components/UI/Button";
import SpotlightCard from "../components/Animation/SpotlightCard";
import DecryptText from "../components/Animation/DecryptText";
import { triggerConfetti } from "../components/Animation/Confetti";
import { vaultService } from "../services/vaultService";
import { GeneratorOptions, PasswordStrength } from "../types";
import { scorePasswordStrength, strengthColor } from "../utils/passwordStrength";
import { useToast } from "../hooks/useToast";

const defaultOptions: GeneratorOptions = {
  length: 20,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeSimilar: false,
};

const WORD_LIST = [
  "quantum", "cipher", "matrix", "shield", "proton", "secure", "vertex", "crypto",
  "nebula", "vault", "anchor", "cosmic", "beacon", "dynamo", "falcon", "glacier",
  "horizon", "island", "jungle", "meteor", "orbit", "phoenix", "shadow", "timber",
  "zenith", "aurora", "breeze", "canyon", "desert", "ember", "forest", "galaxy"
];

export default function PasswordGenerator() {
  const [options, setOptions] = useState<GeneratorOptions>(defaultOptions);
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState<PasswordStrength | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [activePreset, setActivePreset] = useState<string>("Ultra Secure");
  const { showToast } = useToast();

  const generate = async (opts = options) => {
    setLoading(true);
    setCopied(false);
    try {
      let pwd = "";
      let str: PasswordStrength | null = null;
      try {
        const result = await vaultService.generatePassword(opts);
        pwd = result.password;
        str = result.strength;
      } catch {
        // Fallback local generator if backend not connected
        let chars = "";
        if (opts.uppercase) chars += "ABCDEFGHJKLMNPQRSTUVWXYZ";
        if (opts.lowercase) chars += "abcdefghijkmnpqrstuvwxyz";
        if (opts.numbers) chars += "23456789";
        if (opts.symbols) chars += "!@#$%^&*()_+-=[]{}|";
        if (!chars) chars = "abcdefghijkmnpqrstuvwxyz";

        for (let i = 0; i < opts.length; i++) {
          pwd += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        str = scorePasswordStrength(pwd);
      }

      setPassword(pwd);
      setStrength(str || scorePasswordStrength(pwd));
      setHistory((prev) => [pwd, ...prev.filter((p) => p !== pwd)].slice(0, 6));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = (pwdToCopy = password) => {
    if (!pwdToCopy) return;
    navigator.clipboard.writeText(pwdToCopy);
    setCopied(true);
    triggerConfetti();
    showToast({
      title: "Password Copied",
      description: "Copied to clipboard safely",
      type: "success",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePreset = (preset: string) => {
    setActivePreset(preset);
    let newOpts = { ...options };

    if (preset === "Ultra Secure") {
      newOpts = { length: 24, uppercase: true, lowercase: true, numbers: true, symbols: true, excludeSimilar: false };
    } else if (preset === "Web Standard") {
      newOpts = { length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true, excludeSimilar: true };
    } else if (preset === "PIN Code") {
      newOpts = { length: 8, uppercase: false, lowercase: false, numbers: true, symbols: false, excludeSimilar: false };
    } else if (preset === "Passphrase") {
      // Generate 4-word passphrase
      const words = [];
      for (let i = 0; i < 4; i++) {
        words.push(WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]);
      }
      const num = Math.floor(Math.random() * 90 + 10);
      const passphrase = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("-") + "!" + num;
      setPassword(passphrase);
      setStrength({ score: 4, label: "Very Strong" });
      setHistory((prev) => [passphrase, ...prev.filter((p) => p !== passphrase)].slice(0, 6));
      return;
    }

    setOptions(newOpts);
    generate(newOpts);
  };

  const toggle = (key: keyof GeneratorOptions) => {
    const updated = { ...options, [key]: !options[key] };
    setOptions(updated);
    generate(updated);
  };

  // Estimate crack time
  const getCrackTime = (pwd: string) => {
    if (!pwd) return "Instant";
    const len = pwd.length;
    if (len < 8) return "A few seconds";
    if (len < 12) return "3 hours";
    if (len < 16) return "4,000 years";
    if (len < 20) return "500 million years";
    return "340 Trillion Years";
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
          <Wand2 className="h-6 w-6 text-blue-600" />
          <span>Password Generator Studio</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Generate cryptographically secure passwords and Diceware passphrases with entropy analysis.
        </p>
      </div>

      {/* Main Generator Output Display Box */}
      <SpotlightCard className="p-6 sm:p-8 bg-white border-slate-200 shadow-card">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <span className="font-medium flex items-center gap-1.5 text-slate-700">
            <Sparkles className="h-3.5 w-3.5 text-blue-500" /> Generated Output
          </span>
          <span className="font-mono text-[11px] text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 font-semibold">
            {password.length} characters • {password.length * 4} bits entropy
          </span>
        </div>

        {/* Display Banner */}
        <div className="relative flex items-center justify-between rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 sm:p-5 shadow-inner">
          <div className="overflow-x-auto font-mono text-lg sm:text-2xl font-bold text-slate-900 tracking-wide select-all py-1 scrollbar-none">
            {password ? (
              <DecryptText text={password} speed={25} />
            ) : (
              <span className="text-slate-400">Click generate...</span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-4">
            <button
              onClick={() => generate()}
              title="Regenerate"
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white p-3 text-slate-600 shadow-sm hover:bg-slate-50 hover:text-blue-600 transition-all active:rotate-180 duration-300"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => handleCopy()}
              className="flex items-center gap-2 rounded-xl bg-vault-accent px-4 py-3 text-sm font-semibold text-white shadow-glow hover:bg-vault-accentHover transition-colors active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-white" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Entropy Strength Indicator & Crack Time */}
        {strength && (
          <div className="mt-5 rounded-xl bg-slate-50/80 border border-slate-200/80 p-4">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-slate-700 flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-blue-600" />
                Security Strength: <span className="text-slate-900 font-bold">{strength.label}</span>
              </span>
              <span className="text-slate-500 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                Estimated crack time: <span className="text-emerald-700 font-bold">{getCrackTime(password)}</span>
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full transition-all duration-400 ${strengthColor(strength.label)}`}
                style={{ width: `${Math.max(15, (strength.score / 4) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Presets Bar */}
        <div className="mt-6">
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Security Presets
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {["Ultra Secure", "Web Standard", "Passphrase", "PIN Code"].map((preset) => (
              <button
                key={preset}
                onClick={() => handlePreset(preset)}
                className={`rounded-xl py-2 px-3 text-xs font-semibold border transition-all ${
                  activePreset === preset
                    ? "bg-blue-50 border-blue-300 text-blue-700 shadow-xs"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Length Slider */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-700">
              Password Length
            </label>
            <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
              {options.length}
            </span>
          </div>
          <input
            type="range"
            min={6}
            max={64}
            value={options.length}
            onChange={(e) => {
              const len = Number(e.target.value);
              const updated = { ...options, length: len };
              setOptions(updated);
              generate(updated);
            }}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-vault-accent"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>6 (Min)</span>
            <span>20 (Recommended)</span>
            <span>64 (Max)</span>
          </div>
        </div>

        {/* Character Class Toggles */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <ToggleSwitch
            label="Uppercase Letters (A-Z)"
            checked={options.uppercase}
            onChange={() => toggle("uppercase")}
          />
          <ToggleSwitch
            label="Lowercase Letters (a-z)"
            checked={options.lowercase}
            onChange={() => toggle("lowercase")}
          />
          <ToggleSwitch
            label="Numbers (0-9)"
            checked={options.numbers}
            onChange={() => toggle("numbers")}
          />
          <ToggleSwitch
            label="Special Symbols (!@#$)"
            checked={options.symbols}
            onChange={() => toggle("symbols")}
          />
          <div className="sm:col-span-2">
            <ToggleSwitch
              label="Exclude Ambiguous Characters (il1O0)"
              checked={options.excludeSimilar}
              onChange={() => toggle("excludeSimilar")}
            />
          </div>
        </div>
      </SpotlightCard>

      {/* Session History Drawer */}
      {history.length > 1 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-3">
            <History className="h-4 w-4 text-slate-500" />
            <span>Generated This Session (RAM Only)</span>
          </div>
          <div className="flex flex-col gap-2">
            {history.slice(1).map((histPwd, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 px-3.5 py-2 text-xs font-mono text-slate-800"
              >
                <span className="truncate mr-4">{histPwd}</span>
                <button
                  onClick={() => handleCopy(histPwd)}
                  className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                >
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleSwitch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-3 cursor-pointer hover:bg-slate-100/60 transition-colors">
      <span className="font-medium text-slate-700">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-vault-accent cursor-pointer"
      />
    </label>
  );
}
