const SUPABASE_URL = "https://lclxdcsgfqwfahwlnjkj.supabase.co";
const SUPABASE_KEY = "sb_publishable_fH8WjNl3CLJr3Id9eQnQdQ_0AnynpMc";

const token = localStorage.getItem("access_token");
const userId = localStorage.getItem("user_id");

if (!token || !userId) {
  window.location.href = "index.html";
}

async function cargarAlumno() {
  const respuesta = await fetch(
    `${SUPABASE_URL}/rest/v1/alumnos?usuario_id=eq.${userId}&select=nombre,apellidos,numero_alumno,curso,grupo`,
    {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${token}`
      }
    }
  );

  const alumnos = await respuesta.json();

  if (!respuesta.ok || alumnos.length === 0) {
    document.getElementById("nombre-alumno").textContent =
      "No se han encontrado tus datos.";
    return;
  }

  const alumno = alumnos[0];

  document.getElementById("nombre-alumno").textContent =
    `${alumno.nombre} ${alumno.apellidos}`;

  document.getElementById("numero-alumno").textContent =
    alumno.numero_alumno;

  document.getElementById("curso-alumno").textContent =
    alumno.curso;

  document.getElementById("grupo-alumno").textContent =
    alumno.grupo;
}

cargarAlumno();
