import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; 
import { AuthProvider } from "@/context/AuthContext";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage"; // 👈 NECESITAS IMPORTAR ESTO
import Dashboard from "@/pages/admin/Dashboard";
import VotarPage from "@/pages/votante/VotarPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          {/* 1. Ruta de Redirección (Raíz) */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 2. Ruta de Inicio de Sesión */}
          <Route path="/login" element={<LoginPage />} />

          {/* 🔑 3. RUTA FALTANTE (REGISTRO) */}
          <Route path="/register" element={<RegisterPage />} /> 

          {/* 4. Rutas Protegidas */}
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

          {/* 5. Catch-all (404) */}
          <Route path="*" element={<div>4S04 Página no encontrada</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}