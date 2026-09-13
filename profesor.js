const SUPABASE_URL = "https://lclxdcsgfqwfahwlnjkj.supabase.co";
const SUPABASE_KEY = "sb_publishable_fH8WjNl3CLJr3Id9eQnQdQ_0AnynpMc";

const token = localStorage.getItem("access_token");
const userId = localStorage.getItem("user_id");

if (!token || !userId) {
  window.location.href = "index.html";
}

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${token}`,
  "Content-Type": "application/json"
};

document.getElementById("cerrar-sesion").addEventListener("click", () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_id");
  window.location.href = "index.html";
});

document.getElementById("mostrar-formulario-alumno").addEventListener("click", () => {
  const formulario = document.getElementById("formulario-alumno");

  if (formulario.style.display === "none") {
    formulario.style.display = "block";
  } else {
    formulario.style.display = "none";
  }
});

document.getElementById("guardar-alumno").addEventListener("click", async () => {

  const mensaje = document.getElementById("mensaje-alumno");

  const alumno = {
    nombre: document.getElementById("nombre").value,
    apellidos: document.getElementById("apellidos").value,
    numero_alumno: document.getElementById("numero_alumno").value,
    curso: document.getElementById("curso").value,
    grupo: document.getElementById("grupo").value,
    correo: document.getElementById("correo").value,
    optativa: document.getElementById("optativa").value
  };

  if (!alumno.nombre || !alumno.apellidos || !alumno.numero_alumno) {
    mensaje.textContent = "Completa nombre, apellidos y número de alumno.";
    return;
  }

  mensaje.textContent = "Guardando alumno...";

  const respuesta = await fetch(
    `${SUPABASE_URL}/rest/v1/alumnos`,
    {
      method: "POST",
      headers: {
        ...headers,
        "Prefer": "return=representation"
      },
      body: JSON.stringify(alumno)
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    mensaje.textContent = "No se ha podido guardar el alumno.";
    console.error(datos);
    return;
  }

  mensaje.textContent = "Alumno guardado correctamente.";

  document.getElementById("nombre").value = "";
  document.getElementById("apellidos").value = "";
  document.getElementById("numero_alumno").value = "";
  document.getElementById("curso").value = "";
  document.getElementById("grupo").value = "";
  document.getElementById("correo").value = "";
  document.getElementById("optativa").value = "";

  cargarAlumnos();
});

async function cargarAlumnos() {

  const respuesta = await fetch(
    `${SUPABASE_URL}/rest/v1/alumnos?select=nombre,apellidos,numero_alumno,curso,grupo,correo,optativa`,
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
      <p><strong>Optativa:</strong> ${alumno.optativa || "-"}</p>
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
