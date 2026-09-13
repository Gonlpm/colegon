const SUPABASE_URL = "https://lclxdcsgfqwfahwlnjkj.supabase.co";
const SUPABASE_KEY = "sb_publishable_fH8WjNl3CLJr3Id9eQnQdQ_0AnynpMc";

const token = localStorage.getItem("access_token");
const userId = localStorage.getItem("user_id");

if (!token || !userId) {
  window.location.href = "index.html";
}

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${token}`
};


/* =========================
   CERRAR SESIÓN
========================= */

document.getElementById("cerrar-sesion").addEventListener("click", () => {

  localStorage.removeItem("access_token");
  localStorage.removeItem("user_id");

  window.location.href = "index.html";
});


/* =========================
   DATOS DEL ALUMNO
========================= */

async function cargarAlumno() {

  const respuesta = await fetch(
    `${SUPABASE_URL}/rest/v1/alumnos?usuario_id=eq.${userId}&select=nombre,apellidos,numero_alumno,curso,grupo`,
    {
      headers: headers
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
    alumno.numero_alumno || "-";

  document.getElementById("curso-alumno").textContent =
    alumno.curso || "-";

  document.getElementById("grupo-alumno").textContent =
    alumno.grupo || "-";

  cargarTareas();
  cargarAvisos();
}


/* =========================
   TAREAS PENDIENTES
========================= */

async function cargarTareas() {

  const respuesta = await fetch(
    `${SUPABASE_URL}/rest/v1/tareas?alumno_id=eq.${userId}&estado=eq.Pendiente&select=id,texto,descripcion,asignatura,fecha_limite,estado&order=fecha_limite.asc`,
    {
      headers: headers
    }
  );

  const tareas = await respuesta.json();

  const contenedor =
    document.getElementById("tareas");

  if (!respuesta.ok || tareas.length === 0) {

    contenedor.innerHTML =
      "<p>🎉 No tienes tareas pendientes.</p>";

    return;
  }

  contenedor.innerHTML = "";

  tareas.forEach(tarea => {

    const elemento =
      document.createElement("div");

    elemento.innerHTML = `
      <h3>
        ${tarea.texto}
      </h3>

      <p>
        ${tarea.descripcion || ""}
      </p>

      <p>
        <strong>📖 Asignatura:</strong>
        ${tarea.asignatura || "-"}
      </p>

      <p>
        <strong>📅 Fecha límite:</strong>
        ${tarea.fecha_limite || "-"}
      </p>

      <p>
        <strong>📌 Estado:</strong>
        ${tarea.estado || "-"}
      </p>

      <hr>
    `;

    contenedor.appendChild(elemento);
  });
}


/* =========================
   AVISOS
========================= */

async function cargarAvisos() {

  const respuesta = await fetch(
    `${SUPABASE_URL}/rest/v1/avisos?activo=eq.true&destinatario=in.(todos,alumnos)&select=titulo,mensaje,fecha,destinatario&order=fecha.desc`,
    {
      headers: headers
    }
  );

  const avisos = await respuesta.json();

  const contenedor =
    document.getElementById("avisos");

  if (!respuesta.ok || avisos.length === 0) {

    contenedor.innerHTML =
      "<p>No hay avisos.</p>";

    return;
  }

  contenedor.innerHTML = "";

  avisos.forEach(aviso => {

    const elemento =
      document.createElement("div");

    elemento.innerHTML = `
      <h3>
        ${aviso.titulo}
      </h3>

      <p>
        ${aviso.mensaje}
      </p>

      <p>
        <strong>📅 Fecha:</strong>
        ${aviso.fecha || "-"}
      </p>

      <hr>
    `;

    contenedor.appendChild(elemento);
  });
}


/* =========================
   INICIO
========================= */

cargarAlumno();
