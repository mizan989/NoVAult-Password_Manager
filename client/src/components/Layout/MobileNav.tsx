import React from "react";
import { NavLink } from "react-router-dom";
import { KeyRound, StickyNote, LayoutGrid, Wand2, Settings } from "lucide-react";

const links = [
  { to: "/dashboard", label: "Home", icon: LayoutGrid },
  { to: "/vault", label: "Passwords", icon: KeyRound },
  { to: "/notes", label: "Notes", icon: StickyNote },
  { to: "/generator", label: "Generator", icon: Wand2 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex md:hidden items-center justify-around border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur-md shadow-lg">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-medium transition-colors ${
              isActive ? "text-vault-accent font-semibold" : "text-slate-500 hover:text-slate-900"
            }`
          }
        >
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}