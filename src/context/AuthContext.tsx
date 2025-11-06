import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react"; // ✅ IMPORTAR ReactNode COMO TYPE
import { supabase } from "@/services/supabaseClient";

// 🔹 Interfaz del contexto de autenticación
interface AuthContextType {
  user: any;
  role: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// 🔹 Crear contexto
const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

// 🔹 Proveedor de autenticación
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión activa al iniciar
  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("Error obteniendo sesión:", error.message);
      setUser(data.session?.user ?? null);

      if (data.session?.user) {
        await fetchUserRole(data.session.user.id);
      }

      setLoading(false);
    };

    getSession();

    // Escuchar cambios de sesión (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserRole(session.user.id);
        } else {
          setRole(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 🔹 Obtener rol del usuario desde una tabla `usuarios`
  const fetchUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from("usuarios")
      .select("rol")
      .eq("id_auth", userId)
      .single();

    if (error) {
      console.warn("No se pudo obtener rol del usuario:", error.message);
      setRole(null);
    } else {
      setRole(data?.rol || null);
    }
  };

  // 🔹 Función de login
  const login = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error al iniciar sesión:", error.message);
      alert("Credenciales incorrectas o usuario no encontrado.");
    } else {
      setUser(data.user);
      await fetchUserRole(data.user.id);
    }

    setLoading(false);
  };

  // 🔹 Función de logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acceder fácilmente al contexto
export const useAuth = () => useContext(AuthContext);
