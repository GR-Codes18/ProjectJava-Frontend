export async function buscarPorDNI(dni: string) {
  const token = "TU_TOKEN_APISPERU"; // reemplázalo por tu token real
  const res = await fetch(`https://dniruc.apisperu.com/api/v1/dni/${dni}?token=${token}`);
  if (!res.ok) throw new Error("Error al buscar DNI");
  return await res.json();
}
