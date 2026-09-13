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

let alumnoEditando = null;

document.getElementById("cerrar-sesion").addEventListener("click", () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_id");
  window.location.href = "index.html";
});

document.getElementById("mostrar-formulario-alumno").addEventListener("click", () => {
  limpiarFormulario();

  const formulario = document.getElementById("formulario-alumno");
  formulario.style.display =
    formulario.style.display === "none" ? "block" : "none";
});

document.getElementById("guardar-alumno").addEventListener("click", async () => {

  const mensaje = document.getElementById("mensaje-alumno");

  const alumno = {
    nombre: document.getElementById("nombre").value.trim(),
    apellidos: document.getElementById("apellidos").value.trim(),
    numero_alumno: document.getElementById("numero_alumno").value.trim(),
    curso: document.getElementById("curso").value.trim(),
    grupo: document.getElementById("grupo").value.trim(),
    correo: document.getElementById("correo").value.trim(),
    optativa: document.getElementById("optativa").value.trim()
  };

  if (!alumno.nombre || !alumno.apellidos || !alumno.numero_alumno) {
    mensaje.textContent = "Completa nombre, apellidos y número de alumno.";
    return;
  }

  mensaje.textContent = "Guardando...";

  let respuesta;

  if (alumnoEditando) {

    respuesta = await fetch(
      `${SUPABASE_URL}/rest/v1/alumnos?id=eq.${alumnoEditando}`,
      {
        method: "PATCH",
        headers: {
          ...headers,
          "Prefer": "return=representation"
        },
        body: JSON.stringify(alumno)
      }
    );

  } else {

    respuesta = await fetch(
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
  }

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    mensaje.textContent = "No se ha podido guardar el alumno.";
    console.error(datos);
    return;
  }

  mensaje.textContent = alumnoEditando
    ? "Alumno actualizado correctamente."
    : "Alumno creado correctamente.";

  limpiarFormulario();
  cargarAlumnos();
});

document.getElementById("cancelar-edicion").addEventListener("click", () => {
  limpiarFormulario();
});

function limpiarFormulario() {

  alumnoEditando = null;

  document.getElementById("titulo-formulario").textContent = "Nuevo alumno";
  document.getElementById("guardar-alumno").textContent = "Guardar alumno";
  document.getElementById("cancelar-edicion").style.display = "none";

  document.getElementById("nombre").value = "";
  document.getElementById("apellidos").value = "";
  document.getElementById("numero_alumno").value = "";
  document.getElementById("curso").value = "";
  document.getElementById("grupo").value = "";
  document.getElementById("correo").value = "";
  document.getElementById("optativa").value = "";
  document.getElementById("mensaje-alumno").textContent = "";
}

function editarAlumno(alumno) {

  alumnoEditando = alumno.id;

  document.getElementById("titulo-formulario").textContent =
    "Editar alumno";

  document.getElementById("guardar-alumno").textContent =
    "Guardar cambios";

  document.getElementById("cancelar-edicion").style.display =
    "inline-block";

  document.getElementById("formulario-alumno").style.display =
    "block";

  document.getElementById("nombre").value =
    alumno.nombre || "";

  document.getElementById("apellidos").value =
    alumno.apellidos || "";

  document.getElementById("numero_alumno").value =
    alumno.numero_alumno || "";

  document.getElementById("curso").value =
    alumno.curso || "";

  document.getElementById("grupo").value =
    alumno.grupo || "";

  document.getElementById("correo").value =
    alumno.correo || "";

  document.getElementById("optativa").value =
    alumno.optativa || "";
}

async function eliminarAlumno(id) {

  const confirmar = confirm(
    "¿Seguro que quieres eliminar este alumno?"
  );

  if (!confirmar) {
    return;
  }

  const respuesta = await fetch(
    `${SUPABASE_URL}/rest/v1/alumnos?id=eq.${id}`,
    {
      method: "DELETE",
      headers: headers
    }
  );

  if (!respuesta.ok) {
    alert("No se ha podido eliminar el alumno.");
    return;
  }

  cargarAlumnos();
}

async function cargarAlumnos() {

  const respuesta = await fetch(
    `${SUPABASE_URL}/rest/v1/alumnos?select=id,nombre,apellidos,numero_alumno,curso,grupo,correo,optativa`,
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

      <button class="editar-alumno">
        ✏️ Editar
      </button>

      <button class="eliminar-alumno">
        🗑️ Eliminar
      </button>

      <hr>
    `;

    elemento.querySelector(".editar-alumno").addEventListener(
      "click",
      () => editarAlumno(alumno)
    );

    elemento.querySelector(".eliminar-alumno").addEventListener(
      "click",
      () => eliminarAlumno(alumno.id)
    );

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
