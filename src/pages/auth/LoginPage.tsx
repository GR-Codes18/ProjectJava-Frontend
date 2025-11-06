import { useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${dni}@votacion.com`,
      password,
    });
    if (error) return setError(error.message);

    const role = data.user?.user_metadata?.role;
    navigate(role === "admin" ? "/admin" : "/votar");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-xl shadow-md w-80">
        <h1 className="text-xl font-bold text-center mb-4">Iniciar sesión</h1>
        <input
          type="text"
          placeholder="DNI"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          className="border p-2 rounded w-full mb-3"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full mb-3"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded">
          Entrar
        </button>
        <p className="text-center text-sm mt-3">
          ¿No tienes cuenta?{' '}
          <a onClick={() => navigate('/register')} className="text-blue-600 hover:underline cursor-pointer">
            Regístrate aquí
          </a>
        </p>
      </form>
    </div>
  );
}
