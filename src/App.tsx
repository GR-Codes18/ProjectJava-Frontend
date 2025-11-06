import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // <--- 1. Importa Navigate
import { AuthProvider } from "@/context/AuthContext";
import LoginPage from "@/pages/auth/LoginPage";
import Dashboard from "@/pages/admin/Dashboard";
import VotarPage from "@/pages/votante/VotarPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 2. Añade esta línea para redirigir la raíz al login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/votar"
            element={
              <ProtectedRoute role="votante">
                <VotarPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<div>4S04 Página no encontrada</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}