import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const ProtectedRoute = ({
  children,
  role,
}: {
  children: React.ReactElement;
  role?: string;
}) => {
  const { user, role: userRole, loading } = useAuth();

  if (loading) return <div className="text-center mt-10">Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && userRole !== role) return <Navigate to="/" replace />;

  return children;
};
