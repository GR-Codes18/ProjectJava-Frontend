import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; 
import { AuthProvider } from "@/context/AuthContext";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import Dashboard from "@/pages/admin/Dashboard";
import VotarPage from "@/pages/votante/VotarPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ✅ Página raíz — si hay sesión, se redirige según el rol, si no, muestra login */}
          <Route path="/" element={<LoginPage />} />

          {/* 🔐 Autenticación */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} /> 

          {/* 🧭 Rutas protegidas */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/votante/portal"
            element={
              <ProtectedRoute role="votante">
                <VotarPage />
              </ProtectedRoute>
            }
          />

          {/* 🚫 Página no encontrada */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
