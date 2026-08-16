import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { VaultUnlockProvider } from "./hooks/useVaultUnlock";
import { ToastProvider } from "./hooks/useToast";
import SmoothScroll from "./components/Animation/SmoothScroll";
import ToastContainer from "./components/UI/Toast";
import { RequireUser, RequireVaultUnlock } from "./components/Auth/ProtectedRoute";
import AppLayout from "./components/Layout/AppLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import MasterPassword from "./pages/MasterPassword";
import Unlock from "./pages/Unlock";
import Dashboard from "./pages/Dashboard";
import VaultPage from "./pages/Vault";
import Notes from "./pages/Notes";
import PasswordGenerator from "./pages/PasswordGenerator";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <AuthProvider>
      <VaultUnlockProvider>
        <ToastProvider>
          <SmoothScroll>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />

              <Route
                path="/master-password"
                element={
                  <RequireUser>
                    <MasterPassword />
                  </RequireUser>
                }
              />
              <Route
                path="/unlock"
                element={
                  <RequireUser>
                    <Unlock />
                  </RequireUser>
                }
              />

              <Route
                element={
                  <RequireVaultUnlock>
                    <AppLayout />
                  </RequireVaultUnlock>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/vault" element={<VaultPage type="password" />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/generator" element={<PasswordGenerator />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <ToastContainer />
          </SmoothScroll>
        </ToastProvider>
      </VaultUnlockProvider>
    </AuthProvider>
  );
}
