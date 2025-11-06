// RegisterPage.tsx
import { useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. Crear el usuario en Supabase Auth
    const email = `${dni}@votacion.com`;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Opcional: para establecer el rol de inmediato en la metadata
        data: { rol: 'votante' } 
      }
    });

    if (authError) {
      setLoading(false);
      return setError(authError.message);
    }
    
    // 2. Insertar el registro en la tabla 'public.usuarios'
    if (authData.user) {
      const { error: dbError } = await supabase
        .from('usuarios')
        .insert({
          id_auth: authData.user.id,
          nombre: nombre,
          email: email,
          rol: 'votante', // Asignamos el rol por defecto
        });

      if (dbError) {
        // Manejo de error si la inserción en la tabla falla
        console.error("Error al insertar en DB:", dbError);
        // Opcional: Borrar el usuario de auth si la inserción en DB falla
        // await supabase.auth.admin.deleteUser(authData.user.id); 
        setLoading(false);
        return setError("Error al completar el registro. Inténtelo de nuevo.");
      }
    }

    setLoading(false);
    alert("¡Registro exitoso! Por favor, revisa tu correo para confirmar la cuenta.");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded-xl shadow-md w-80">
        <h1 className="text-xl font-bold text-center mb-4">Registro de Usuario</h1>
        
        <input type="text" placeholder="Nombre Completo" value={nombre} 
               onChange={(e) => setNombre(e.target.value)} 
               className="border p-2 rounded w-full mb-3" required />
        
        <input type="text" placeholder="DNI" value={dni} 
               onChange={(e) => setDni(e.target.value)} 
               className="border p-2 rounded w-full mb-3" required />
        
        <input type="password" placeholder="Contraseña" value={password} 
               onChange={(e) => setPassword(e.target.value)} 
               className="border p-2 rounded w-full mb-3" required />
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <button type="submit" disabled={loading} className="bg-green-500 text-white w-full py-2 rounded mb-3">
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
        
        <p className="text-center text-sm mt-3">
          ¿Ya tienes cuenta?{' '}
          <a onClick={() => navigate('/login')} className="text-blue-600 hover:underline cursor-pointer">
            Iniciar sesión
          </a>
        </p>
      </form>
    </div>
  );
}