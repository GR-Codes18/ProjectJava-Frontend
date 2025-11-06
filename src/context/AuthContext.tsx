import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";

interface AuthContextType {
  user: any;
  role: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, nombre: string, dni: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Obtener rol desde metadata
  const getRoleFromMetadata = (currentUser: any): string | null => {
    return currentUser?.user_metadata?.rol || null;
  };

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);
      setRole(getRoleFromMetadata(currentUser));
      setLoading(false);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setRole(getRoleFromMetadata(currentUser));
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  // 📌 REGISTRO con nombre y DNI
  const register = async (email: string, password: string, nombre: string, dni: string) => {
    const redirectUrl =
      import.meta.env.MODE === "development"
        ? "http://localhost:5173/login"
        : "https://bitelapp.vercel.app/login";

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          nombre,
          dni,
          rol: "votante", // puedes ajustar esto según tu lógica
        },
      },
    });

    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
