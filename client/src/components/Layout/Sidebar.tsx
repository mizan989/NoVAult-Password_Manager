import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  KeyRound,
  StickyNote,
  LayoutGrid,
  Wand2,
  Settings,
  ChevronRight,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { useVaultUnlock } from "../../hooks/useVaultUnlock";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid, shortcut: "1" },
  { to: "/vault", label: "Passwords", icon: KeyRound, shortcut: "2" },
  { to: "/notes", label: "Secure Notes", icon: StickyNote, shortcut: "3" },
  { to: "/generator", label: "Generator", icon: Wand2, shortcut: "4" },
  { to: "/settings", label: "Settings", icon: Settings, shortcut: "5" },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const { isUnlocked } = useVaultUnlock();

  return (
    <motion.aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      animate={{ width: expanded ? 230 : 76 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="hidden md:flex h-screen sticky top-0 flex-col justify-between border-r border-vault-border bg-white px-3 py-6 select-none z-30 shadow-subtle"
    >
      <div>
        {/* Brand Logo */}
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <span className="font-heading text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                  No<span className="text-vault-accent">VA</span>ult
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Items with Spring Sliding Pill */}
        <nav className="flex flex-col gap-1.5">
          {links.map(({ to, label, icon: Icon, shortcut }) => {
            const isActive = location.pathname === to;

            return (
              <NavLink
                key={to}
                to={to}
                className="relative flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-sm transition-colors duration-200"
              >
                {/* Active Sliding Background Pill with layoutId */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    className="absolute inset-0 rounded-xl bg-blue-50 border border-blue-100/80 -z-0"
                  />
                )}

                <Icon
                  className={`h-5 w-5 shrink-0 z-10 transition-colors ${
                    isActive ? "text-blue-600" : "text-slate-500"
                  }`}
                />

                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -4 }}
                      transition={{ duration: 0.15 }}
                      className="z-10 flex flex-1 items-center justify-between overflow-hidden"
                    >
                      <span
                        className={`whitespace-nowrap text-xs font-medium ${
                          isActive ? "text-blue-700 font-semibold" : "text-slate-700"
                        }`}
                      >
                        {label}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Session Security Indicator in Sidebar Footer */}
      <div className="flex flex-col gap-3">
        <div
          className={`flex items-center gap-2.5 rounded-xl border p-2 text-xs ${
            isUnlocked
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-slate-200 bg-slate-50 text-slate-600"
          }`}
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white shadow-xs">
            <Lock className={`h-3.5 w-3.5 ${isUnlocked ? "text-emerald-600" : "text-slate-400"}`} />
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <p className="text-[11px] font-semibold">Vault Unlocked</p>
                <p className="text-[10px] text-emerald-600">Keys active in RAM</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center text-slate-400">
          <ChevronRight
            className={`h-4 w-4 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>
    </motion.aside>
  );
}
