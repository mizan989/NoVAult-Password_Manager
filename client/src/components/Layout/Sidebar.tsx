import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  KeyRound,
  StickyNote,
  LayoutGrid,
  Wand2,
  Settings,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/vault", label: "Passwords", icon: KeyRound },
  { to: "/notes", label: "Secure Notes", icon: StickyNote },
  { to: "/generator", label: "Generator", icon: Wand2 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      animate={{ width: expanded ? 220 : 72 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="hidden md:flex h-screen sticky top-0 flex-col justify-between border-r border-vault-border bg-vault-surface px-3 py-6 overflow-hidden"
    >
      <div>
        <div className="mb-8 flex items-center gap-2 px-2">
          <ShieldCheck className="h-6 w-6 shrink-0 text-vault-accent" />
          {expanded && (
            <span className="font-heading text-lg font-semibold whitespace-nowrap">
              No<span className="text-vault-accent">VA</span>ult
            </span>
          )}
        </div>

        <nav className="flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-250 ${
                  isActive
                    ? "bg-vault-accentSoft text-vault-accent font-medium"
                    : "text-vault-muted hover:bg-vault-border/50 hover:text-vault-text"
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {expanded && <span className="whitespace-nowrap">{label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center justify-center px-2 text-vault-muted">
        <ChevronRight
          className={`h-4 w-4 transition-transform duration-250 ${expanded ? "rotate-180" : ""}`}
        />
      </div>
    </motion.aside>
  );
}
