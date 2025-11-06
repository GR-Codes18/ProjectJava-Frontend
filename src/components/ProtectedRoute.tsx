import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  // 🚫 Si no hay usuario, lo enviamos al login
  if (!user) return <Navigate to="/login" replace />;

  // 🚫 Si hay un rol definido y no coincide, redirigimos según rol
  if (role && user.user_metadata?.rol !== role) {
    if (user.user_metadata?.rol === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (user.user_metadata?.rol === "votante") return <Navigate to="/votante/portal" replace />;
  }

  // ✅ Si todo está OK
  return <>{children}</>;
}
