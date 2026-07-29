import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";
import { main } from "framer-motion/m";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-vault-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col">
     <Navbar />
     <main className="flex-1 p-6 pb-24 md:pb-6">
        <Outlet />
        </main>
        <footer className="border-t border-vault-border px-6 py-4 text-center text-xs text-vault-muted">
       Built by <span className="font-medium text-vault-text">Md Mizan</span> as a portfolio project.
       <br />
       This is a personal/educational project — not intended for storing real sensitive
       credentials, and not to be used for any illegal purpose.
       </footer>
       <MobileNav />
      </div>
    </div>
  );
}
