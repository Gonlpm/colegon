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
let tareaEditando = null;
let avisoEditando = null;


/* =========================
   CERRAR SESIÓN
========================= */

document.getElementById("cerrar-sesion").addEventListener("click", () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_id");
  window.location.href = "index.html";
});


/* =========================
   ALUMNOS
========================= */

document.getElementById("mostrar-formulario-alumno").addEventListener("click", () => {

  limpiarFormularioAlumno();

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
    mensaje.textContent =
      "Completa nombre, apellidos y número de alumno.";
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

  if (!respuesta.ok) {
    mensaje.textContent = "No se ha podido guardar el alumno.";
    return;
  }

  mensaje.textContent =
    alumnoEditando
      ? "Alumno actualizado correctamente."
      : "Alumno creado correctamente.";

  limpiarFormularioAlumno();
  cargarAlumnos();
});


document.getElementById("cancelar-edicion").addEventListener("click", () => {
  limpiarFormularioAlumno();
});


function limpiarFormularioAlumno() {

  alumnoEditando = null;

  document.getElementById("titulo-formulario").textContent =
    "Nuevo alumno";

  document.getElementById("guardar-alumno").textContent =
    "Guardar alumno";

  document.getElementById("cancelar-edicion").style.display =
    "none";

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

  if (!confirm("¿Seguro que quieres eliminar este alumno?")) {
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
    `${SUPABASE_URL}/rest/v1/alumnos?select=id,usuario_id,nombre,apellidos,numero_alumno,curso,grupo,correo,optativa`,
    {
      headers: headers
    }
  );

  const alumnos = await respuesta.json();

  const contenedor =
    document.getElementById("alumnos");

  if (!respuesta.ok || alumnos.length === 0) {

    contenedor.innerHTML =
      "<p>No hay alumnos registrados.</p>";

    return;
  }

  cargarAlumnosEnSelector(alumnos);

  contenedor.innerHTML = "";

  alumnos.forEach(alumno => {

    const elemento = document.createElement("div");

    elemento.innerHTML = `
      <h3>${alumno.nombre} ${alumno.apellidos}</h3>

      <p>
        <strong>Número:</strong>
        ${alumno.numero_alumno}
      </p>

      <p>
        <strong>Curso:</strong>
        ${alumno.curso || "-"}
      </p>

      <p>
        <strong>Grupo:</strong>
        ${alumno.grupo || "-"}
      </p>

      <p>
        <strong>Correo:</strong>
        ${alumno.correo || "-"}
      </p>

      <p>
        <strong>Optativa:</strong>
        ${alumno.optativa || "-"}
      </p>

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


function cargarAlumnosEnSelector(alumnos) {

  const selector =
    document.getElementById("alumno_tarea");

  selector.innerHTML =
    '<option value="">Selecciona un alumno</option>';

  alumnos.forEach(alumno => {

    if (!alumno.usuario_id) {
      return;
    }

    const opcion = document.createElement("option");

    opcion.value = alumno.usuario_id;

    opcion.textContent =
      `${alumno.nombre} ${alumno.apellidos} (${alumno.numero_alumno})`;

    selector.appendChild(opcion);
  });
}


/* =========================
   TAREAS
========================= */

document.getElementById("mostrar-formulario-tarea").addEventListener("click", () => {

  limpiarFormularioTarea();

  document.getElementById("formulario-tarea").style.display =
    "block";
});


document.getElementById("guardar-tarea").addEventListener("click", async () => {

  const mensaje =
    document.getElementById("mensaje-tarea");

  const alumnoId =
    document.getElementById("alumno_tarea").value;

  const texto =
    document.getElementById("texto_tarea").value.trim();

  const descripcion =
    document.getElementById("descripcion_tarea").value.trim();

  const asignatura =
    document.getElementById("asignatura_tarea").value.trim();

  const fechaLimite =
    document.getElementById("fecha_limite_tarea").value;

  const estado =
    document.getElementById("estado_tarea").value;

  if (!alumnoId || !texto) {

    mensaje.textContent =
      "Selecciona un alumno y escribe el título de la tarea.";

    return;
  }

  const tarea = {
    texto: texto,
    descripcion: descripcion,
    asignatura: asignatura,
    fecha_limite: fechaLimite || null,
    estado: estado,
    alumno_id: alumnoId
  };

  mensaje.textContent =
    "Guardando tarea...";

  let respuesta;

  if (tareaEditando) {

    respuesta = await fetch(
      `${SUPABASE_URL}/rest/v1/tareas?id=eq.${tareaEditando}`,
      {
        method: "PATCH",
        headers: {
          ...headers,
          "Prefer": "return=representation"
        },
        body: JSON.stringify(tarea)
      }
    );

  } else {

    respuesta = await fetch(
      `${SUPABASE_URL}/rest/v1/tareas`,
      {
        method: "POST",
        headers: {
          ...headers,
          "Prefer": "return=representation"
        },
        body: JSON.stringify(tarea)
      }
    );
  }

  if (!respuesta.ok) {

    mensaje.textContent =
      "No se ha podido guardar la tarea.";

    return;
  }

  mensaje.textContent =
    tareaEditando
      ? "Tarea actualizada correctamente."
      : "Tarea creada correctamente.";

  limpiarFormularioTarea();
  cargarTareas();
});


document.getElementById("cancelar-edicion-tarea").addEventListener("click", () => {
  limpiarFormularioTarea();
});


function limpiarFormularioTarea() {

  tareaEditando = null;

  document.getElementById("titulo-formulario-tarea").textContent =
    "Nueva tarea";

  document.getElementById("guardar-tarea").textContent =
    "Guardar tarea";

  document.getElementById("cancelar-edicion-tarea").style.display =
    "none";

  document.getElementById("alumno_tarea").value = "";
  document.getElementById("texto_tarea").value = "";
  document.getElementById("descripcion_tarea").value = "";
  document.getElementById("asignatura_tarea").value = "";
  document.getElementById("fecha_limite_tarea").value = "";

  document.getElementById("estado_tarea").value =
    "Pendiente";

  document.getElementById("mensaje-tarea").textContent = "";
}


function editarTarea(tarea) {

  tareaEditando = tarea.id;

  document.getElementById("titulo-formulario-tarea").textContent =
    "Editar tarea";

  document.getElementById("guardar-tarea").textContent =
    "Guardar cambios";

  document.getElementById("cancelar-edicion-tarea").style.display =
    "inline-block";

  document.getElementById("formulario-tarea").style.display =
    "block";

  document.getElementById("alumno_tarea").value =
    tarea.alumno_id || "";

  document.getElementById("texto_tarea").value =
    tarea.texto || "";

  document.getElementById("descripcion_tarea").value =
    tarea.descripcion || "";

  document.getElementById("asignatura_tarea").value =
    tarea.asignatura || "";

  document.getElementById("fecha_limite_tarea").value =
    tarea.fecha_limite || "";

  document.getElementById("estado_tarea").value =
    tarea.estado || "Pendiente";
}


async function eliminarTarea(id) {

  if (!confirm("¿Seguro que quieres eliminar esta tarea?")) {
    return;
  }

  const respuesta = await fetch(
    `${SUPABASE_URL}/rest/v1/tareas?id=eq.${id}`,
    {
      method: "DELETE",
      headers: headers
    }
  );

  if (!respuesta.ok) {

    alert("No se ha podido eliminar la tarea.");

    return;
  }

  cargarTareas();
}


async function cargarTareas() {

  const respuesta = await fetch(
    `${SUPABASE_URL}/rest/v1/tareas?select=id,texto,descripcion,asignatura,fecha_limite,estado,alumno_id,alumnos(nombre,apellidos,numero_alumno)&order=fecha_limite.asc`,
    {
      headers: headers
    }
  );

  const tareas = await respuesta.json();

  const contenedor =
    document.getElementById("tareas");

  if (!respuesta.ok || tareas.length === 0) {

    contenedor.innerHTML =
      "<p>No hay tareas.</p>";

    return;
  }

  contenedor.innerHTML = "";

  tareas.forEach(tarea => {

    const elemento =
      document.createElement("div");

    const alumno =
      tarea.alumnos;

    const nombreAlumno =
      alumno
        ? `${alumno.nombre} ${alumno.apellidos}`
        : "Alumno no identificado";

    elemento.innerHTML = `
      <h3>${tarea.texto}</h3>

      <p>
        <strong>Alumno:</strong>
        ${nombreAlumno}
      </p>

      ${
        alumno
          ? `<p>
               <strong>Número:</strong>
               ${alumno.numero_alumno || "-"}
             </p>`
          : ""
      }

      <p>
        ${tarea.descripcion || ""}
      </p>

      <p>
        <strong>Asignatura:</strong>
        ${tarea.asignatura || "-"}
      </p>

      <p>
        <strong>Fecha límite:</strong>
        ${tarea.fecha_limite || "-"}
      </p>

      <p>
        <strong>Estado:</strong>
        ${tarea.estado || "-"}
      </p>

      <button class="editar-tarea">
        ✏️ Editar
      </button>

      <button class="eliminar-tarea">
        🗑️ Eliminar
      </button>

      <hr>
    `;

    elemento.querySelector(".editar-tarea").addEventListener(
      "click",
      () => editarTarea(tarea)
    );

    elemento.querySelector(".eliminar-tarea").addEventListener(
      "click",
      () => eliminarTarea(tarea.id)
    );

    contenedor.appendChild(elemento);
  });
}


/* =========================
   AVISOS
========================= */

document.getElementById("mostrar-formulario-aviso").addEventListener("click", () => {

  limpiarFormularioAviso();

  document.getElementById("formulario-aviso").style.display =
    "block";
});


document.getElementById("guardar-aviso").addEventListener("click", async () => {

  const mensaje =
    document.getElementById("mensaje-aviso");

  const aviso = {
    titulo: document.getElementById("titulo_aviso").value.trim(),
    mensaje: document.getElementById("mensaje_aviso").value.trim(),
    fecha: document.getElementById("fecha_aviso").value,
    destinatario: document.getElementById("destinatario_aviso").value,
    activo: document.getElementById("activo_aviso").value === "true"
  };

  if (!aviso.titulo || !aviso.mensaje) {

    mensaje.textContent =
      "Completa el título y el mensaje.";

    return;
  }

  mensaje.textContent =
    "Guardando aviso...";

  let respuesta;

  if (avisoEditando) {

    respuesta = await fetch(
      `${SUPABASE_URL}/rest/v1/avisos?id=eq.${avisoEditando}`,
      {
        method: "PATCH",
        headers: {
          ...headers,
          "Prefer": "return=representation"
        },
        body: JSON.stringify(aviso)
      }
    );

  } else {

    respuesta = await fetch(
      `${SUPABASE_URL}/rest/v1/avisos`,
      {
        method: "POST",
        headers: {
          ...headers,
          "Prefer": "return=representation"
        },
        body: JSON.stringify(aviso)
      }
    );
  }

  if (!respuesta.ok) {

    mensaje.textContent =
      "No se ha podido guardar el aviso.";

    return;
  }

  mensaje.textContent =
    avisoEditando
      ? "Aviso actualizado correctamente."
      : "Aviso creado correctamente.";

  limpiarFormularioAviso();
  cargarAvisos();
});


document.getElementById("cancelar-edicion-aviso").addEventListener("click", () => {
  limpiarFormularioAviso();
});


function limpiarFormularioAviso() {

  avisoEditando = null;

  document.getElementById("titulo-formulario-aviso").textContent =
    "Nuevo aviso";

  document.getElementById("guardar-aviso").textContent =
    "Guardar aviso";

  document.getElementById("cancelar-edicion-aviso").style.display =
    "none";

  document.getElementById("titulo_aviso").value = "";
  document.getElementById("mensaje_aviso").value = "";

  document.getElementById("fecha_aviso").value =
    new Date().toISOString().split("T")[0];

  document.getElementById("destinatario_aviso").value =
    "todos";

  document.getElementById("activo_aviso").value =
    "true";

  document.getElementById("mensaje-aviso").textContent = "";
}


function editarAviso(aviso) {

  avisoEditando = aviso.id;

  document.getElementById("titulo-formulario-aviso").textContent =
    "Editar aviso";

  document.getElementById("guardar-aviso").textContent =
    "Guardar cambios";

  document.getElementById("cancelar-edicion-aviso").style.display =
    "inline-block";

  document.getElementById("formulario-aviso").style.display =
    "block";

  document.getElementById("titulo_aviso").value =
    aviso.titulo || "";

  document.getElementById("mensaje_aviso").value =
    aviso.mensaje || "";

  document.getElementById("fecha_aviso").value =
    aviso.fecha || "";

  document.getElementById("destinatario_aviso").value =
    aviso.destinatario || "todos";

  document.getElementById("activo_aviso").value =
    aviso.activo ? "true" : "false";
}


async function eliminarAviso(id) {

  if (!confirm("¿Seguro que quieres eliminar este aviso?")) {
    return;
  }

  const respuesta = await fetch(
    `${SUPABASE_URL}/rest/v1/avisos?id=eq.${id}`,
    {
      method: "DELETE",
      headers: headers
    }
  );

  if (!respuesta.ok) {

    alert("No se ha podido eliminar el aviso.");

    return;
  }

  cargarAvisos();
}


async function cambiarEstadoAviso(id, activo) {

  const respuesta = await fetch(
    `${SUPABASE_URL}/rest/v1/avisos?id=eq.${id}`,
    {
      method: "PATCH",
      headers: {
        ...headers,
        "Prefer": "return=representation"
      },
      body: JSON.stringify({
        activo: !activo
      })
    }
  );

  if (!respuesta.ok) {

    alert("No se ha podido cambiar el estado del aviso.");

    return;
  }

  cargarAvisos();
}


async function cargarAvisos() {

  const respuesta = await fetch(
    `${SUPABASE_URL}/rest/v1/avisos?select=id,titulo,mensaje,fecha,destinatario,activo&order=fecha.desc`,
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
      <h3>${aviso.titulo}</h3>

      <p>
        ${aviso.mensaje}
      </p>

      <p>
        <strong>Fecha:</strong>
        ${aviso.fecha || "-"}
      </p>

      <p>
        <strong>Destinatario:</strong>
        ${aviso.destinatario || "todos"}
      </p>

      <p>
        <strong>Estado:</strong>
        ${aviso.activo ? "🟢 Activo" : "⚪ Inactivo"}
      </p>

      <button class="editar-aviso">
        ✏️ Editar
      </button>

      <button class="cambiar-aviso">
        ${aviso.activo ? "⏸️ Desactivar" : "▶️ Activar"}
      </button>

      <button class="eliminar-aviso">
        🗑️ Eliminar
      </button>

      <hr>
    `;

    elemento.querySelector(".editar-aviso").addEventListener(
      "click",
      () => editarAviso(aviso)
    );

    elemento.querySelector(".cambiar-aviso").addEventListener(
      "click",
      () => cambiarEstadoAviso(aviso.id, aviso.activo)
    );

    elemento.querySelector(".eliminar-aviso").addEventListener(
      "click",
      () => eliminarAviso(aviso.id)
    );

    contenedor.appendChild(elemento);
  });
}


/* =========================
   CARGA INICIAL
========================= */

cargarAlumnos();
cargarTareas();
cargarAvisos();
