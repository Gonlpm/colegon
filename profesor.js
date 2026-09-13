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

async function cargarAlumnos() {
  const respuesta = await fetch(
    `${SUPABASE_URL}/rest/v1/alumnos?select=nombre,apellidos,numero_alumno,curso,grupo,correo`,
    {
      headers: headers
    }
  );

  const alumnos = await respuesta.json();
  const contenedor = document.getElementById("alumnos");

  if (!respuesta.ok || alumnos.length === 0) {
    contenedor.innerHTML = "<p>No hay alumnos registrados.</p>";
    return;
  }

  contenedor.innerHTML = "";

  alumnos.forEach(alumno => {
    const elemento = document.createElement("div");

    elemento.innerHTML = `
      <h3>${alumno.nombre} ${alumno.apellidos}</h3>
      <p><strong>Número:</strong> ${alumno.numero_alumno}</p>
      <p><strong>Curso:</strong> ${alumno.curso || "-"}</p>
      <p><strong>Grupo:</strong> ${alumno.grupo || "-"}</p>
      <p><strong>Correo:</strong> ${alumno.correo || "-"}</p>
      <hr>
    `;

    contenedor.appendChild(elemento);
  });
}

async function cargarTareas() {
  const respuesta = await fetch(
    `${SUPABASE_URL}/rest/v1/tareas?select=id,texto,descripcion,asignatura,fecha_limite,estado,alumno_id`,
    {
      headers: headers
    }
  );

  const tareas = await respuesta.json();
  const contenedor = document.getElementById("tareas");

  if (!respuesta.ok || tareas.length === 0) {
    contenedor.innerHTML = "<p>No hay tareas.</p>";
    return;
  }

  contenedor.innerHTML = "";

  tareas.forEach(tarea => {
    const elemento = document.createElement("div");

    elemento.innerHTML = `
      <h3>${tarea.texto}</h3>
      <p>${tarea.descripcion || ""}</p>
      <p><strong>Asignatura:</strong> ${tarea.asignatura || "-"}</p>
      <p><strong>Fecha límite:</strong> ${tarea.fecha_limite || "-"}</p>
      <p><strong>Estado:</strong> ${tarea.estado || "-"}</p>
      <hr>
    `;

    contenedor.appendChild(elemento);
  });
}

async function cargarAvisos() {
  const respuesta = await fetch(
    `${SUPABASE_URL}/rest/v1/avisos?select=titulo,mensaje,fecha,activo&order=fecha.desc`,
    {
      headers: headers
    }
  );

  const avisos = await respuesta.json();
  const contenedor = document.getElementById("avisos");

  if (!respuesta.ok || avisos.length === 0) {
    contenedor.innerHTML = "<p>No hay avisos.</p>";
    return;
  }

  contenedor.innerHTML = "";

  avisos.forEach(aviso => {
    const elemento = document.createElement("div");

    elemento.innerHTML = `
      <h3>${aviso.titulo}</h3>
      <p>${aviso.mensaje}</p>
      <p><strong>Fecha:</strong> ${aviso.fecha || "-"}</p>
      <p><strong>Activo:</strong> ${aviso.activo ? "Sí" : "No"}</p>
      <hr>
    `;

    contenedor.appendChild(elemento);
  });
}

cargarAlumnos();
cargarTareas();
cargarAvisos();
