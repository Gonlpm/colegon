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

let alumnoEditando = null;

const formularioAlumno =
  document.getElementById("formulario-alumno");

document
  .getElementById("mostrar-formulario-alumno")
  .addEventListener("click", () => {

    alumnoEditando = null;

    document.getElementById("titulo-formulario").textContent =
      "Nuevo alumno";

    document.getElementById("cancelar-edicion").style.display =
      "none";

    formularioAlumno.style.display = "block";
  });


document
  .getElementById("cancelar-edicion")
  .addEventListener("click", () => {

    limpiarFormularioAlumno();

    formularioAlumno.style.display = "none";
  });


document
  .getElementById("guardar-alumno")
  .addEventListener("click", guardarAlumno);


async function guardarAlumno() {

  const datos = {
    nombre: document.getElementById("nombre").value.trim(),
    apellidos: document.getElementById("apellidos").value.trim(),
    numero_alumno: document.getElementById("numero_alumno").value.trim(),
    curso: document.getElementById("curso").value.trim(),
    grupo: document.getElementById("grupo").value.trim(),
    correo: document.getElementById("correo").value.trim(),
    optativa: document.getElementById("optativa").value.trim()
  };

  if (!datos.nombre || !datos.apellidos) {

    document.getElementById("mensaje-alumno").textContent =
      "Introduce al menos el nombre y los apellidos.";

    return;
  }

  let respuesta;

  if (alumnoEditando) {

    respuesta = await fetch(
      `${SUPABASE_URL}/rest/v1/alumnos?id=eq.${alumnoEditando}`,
      {
        method: "PATCH",
        headers: {
          ...headers,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(datos)
      }
    );

  } else {

    respuesta = await fetch(
      `${SUPABASE_URL}/rest/v1/alumnos`,
      {
        method: "POST",
        headers: {
          ...headers,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(datos)
      }
    );
  }

  if (!respuesta.ok) {

    document.getElementById("mensaje-alumno").textContent =
      "No se ha podido guardar el alumno.";

    return;
  }

  document.getElementById("mensaje-alumno").textContent =
    "Alumno guardado correctamente.";

  limpiarFormularioAlumno();

  formularioAlumno.style.display = "none";

  cargarAlumnos();
}


function limpiarFormularioAlumno() {

  document.getElementById("nombre").value = "";
  document.getElementById("apellidos").value = "";
  document.getElementById("numero_alumno").value = "";
  document.getElementById("curso").value = "";
  document.getElementById("grupo").value = "";
  document.getElementById("correo").value = "";
  document.getElementById("optativa").value = "";

  alumnoEditando = null;
}


async function cargarAlumnos() {

  const respuesta = await fetch(
    `${SUPABASE_URL}/rest/v1/alumnos?select=id,usuario_id,nombre,apellidos,numero_alumno,curso,grupo,correo,optativa&order=numero_alumno.asc`,
    {
      headers: headers
    }
  );

  const alumnos = await respuesta.json();

  const contenedor =
    document.getElementById("alumnos");

  if (!respuesta.ok) {

    contenedor.innerHTML =
      "<p>No se han podido cargar los alumnos.</p>";

    return;
  }

  if (alumnos.length === 0) {

    contenedor.innerHTML =
      "<p>No hay alumnos registrados.</p>";

    actualizarSelectorAlumnos([]);

    return;
  }

  contenedor.innerHTML = "";

  alumnos.forEach(alumno => {

    const elemento =
      document.createElement("div");

    elemento.innerHTML = `
      <h3>
        ${alumno.nombre} ${alumno.apellidos}
      </h3>

      <p>
        <strong>Nº:</strong>
        ${alumno.numero_alumno || "-"}
      </p>

      <p>
        <strong>Curso:</strong>
        ${alumno.curso || "-"}
        ${alumno.grupo || ""}
      </p>

      <p>
        <strong>Correo:</strong>
        ${alumno.correo || "-"}
      </p>

      <p>
        <strong>Optativa:</strong>
        ${alumno.optativa || "-"}
      </p>

      <button onclick="editarAlumno('${alumno.id}')">
        ✏️ Editar
      </button>

      <button onclick="eliminarAlumno('${alumno.id}')">
        🗑️ Eliminar
      </button>

      <hr>
    `;

    contenedor.appendChild(elemento);
  });

  actualizarSelectorAlumnos(alumnos);
}


function actualizarSelectorAlumnos(alumnos) {

  const selector =
    document.getElementById("alumno_tarea");

  selector.innerHTML =
    '<option value="">Selecciona un alumno</option>';

  alumnos.forEach(alumno => {

    if (!alumno.usuario_id) {
      return;
    }

    const opcion =
      document.createElement("option");

    opcion.value = alumno.usuario_id;

    opcion.textContent =
      `${alumno.numero_alumno || "-"} - ${alumno.nombre} ${alumno.apellidos}`;

    selector.appendChild(opcion);
  });
}


async function editarAlumno(id) {

  const respuesta = await fetch(
    `${SUPABASE_URL}/rest/v1/alumnos?id=eq.${id}&select=id,nombre,apellidos,numero_alumno,curso,grupo,correo,optativa`,
    {
      headers: headers
    }
  );

  const alumnos = await respuesta.json();

  if (!respuesta.ok || alumnos.length === 0) {
    return;
  }

  const alumno = alumnos[0];

  alumnoEditando = alumno.id;

  document.getElementById("titulo-formulario").textContent =
    "Editar alumno";

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

  document.getElementById("cancelar-edicion").style.display =
    "inline-block";

  formularioAlumno.style.display = "block";

  window.scrollTo({
    top: formularioAlumno.offsetTop,
    behavior: "smooth"
  });
}


async function eliminarAlumno(id) {

  const confirmar =
    confirm("¿Seguro que quieres eliminar este alumno?");

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


/* =========================
   TAREAS
========================= */

let tareaEditando = null;

const formularioTarea =
  document.getElementById("formulario-tarea");


document
  .getElementById("mostrar-formulario-tarea")
  .addEventListener("click", () => {

    tareaEditando = null;

    document.getElementById("titulo-formulario-tarea").textContent =
      "Nueva tarea";

    document.getElementById("cancelar-edicion-tarea").style.display =
      "none";

    formularioTarea.style.display = "block";
  });


document
  .getElementById("cancelar-edicion-tarea")
  .addEventListener("click", () => {

    limpiarFormularioTarea();

    formularioTarea.style.display = "none";
  });


document
  .getElementById("guardar-tarea")
  .addEventListener("click", guardarTarea);


async function guardarTarea() {

  const datos = {
    alumno_id: document.getElementById("alumno_tarea").value,
    texto: document.getElementById("texto_tarea").value.trim(),
    descripcion: document.getElementById("descripcion_tarea").value.trim(),
    asignatura: document.getElementById("asignatura_tarea").value.trim(),
    fecha_limite: document.getElementById("fecha_limite_tarea").value,
    estado: document.getElementById("estado_tarea").value
  };

  if (!datos.alumno_id || !datos.texto) {

    document.getElementById("mensaje-tarea").textContent =
      "Selecciona un alumno e introduce el título.";

    return;
  }

  let respuesta;

  if (tareaEditando) {

    respuesta = await fetch(
      `${SUPABASE_URL}/rest/v1/tareas?id=eq.${tareaEditando}`,
      {
        method: "PATCH",
        headers: {
          ...headers,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(datos)
      }
    );

  } else {

    respuesta = await fetch(
      `${SUPABASE_URL}/rest/v1/tareas`,
      {
        method: "POST",
        headers: {
          ...headers,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(datos)
      }
    );
  }

  if (!respuesta.ok) {

    document.getElementById("mensaje-tarea").textContent =
      "No se ha podido guardar la tarea.";

    return;
  }

  document.getElementById("mensaje-tarea").textContent =
    "Tarea guardada correctamente.";

  limpiarFormularioTarea();

  formularioTarea.style.display = "none";

  cargarTareas();
}


function limpiarFormularioTarea() {

  document.getElementById("alumno_tarea").value = "";
  document.getElementById("texto_tarea").value = "";
  document.getElementById("descripcion_tarea").value = "";
  document.getElementById("asignatura_tarea").value = "";
  document.getElementById("fecha_limite_tarea").value = "";
  document.getElementById("estado_tarea").value = "Pendiente";

  tareaEditando = null;
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

  if (!respuesta.ok) {

    contenedor.innerHTML =
      "<p>No se han podido cargar las tareas.</p>";

    return;
  }

  if (tareas.length === 0) {

    contenedor.innerHTML =
      "<p>No hay tareas.</p>";

    return;
  }

  contenedor.innerHTML = "";

  tareas.forEach(tarea => {

    const elemento =
      document.createElement("div");

    const alumno =
      tarea.alumnos || {};

    elemento.innerHTML = `
      <h3>
        ${tarea.texto}
      </h3>

      <p>
        <strong>👤 Alumno:</strong>
        ${alumno.numero_alumno || "-"}
        - ${alumno.nombre || ""}
        ${alumno.apellidos || ""}
      </p>

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

      <button onclick="editarTarea('${tarea.id}')">
        ✏️ Editar
      </button>

      <button onclick="eliminarTarea('${tarea.id}')">
        🗑️ Eliminar
      </button>

      <hr>
    `;

    contenedor.appendChild(elemento);
  });
}


async function editarTarea(id) {

  const respuesta = await fetch(
    `${SUPABASE_URL}/rest/v1/tareas?id=eq.${id}&select=id,texto,descripcion,asignatura,fecha_limite,estado,alumno_id`,
    {
      headers: headers
    }
  );

  const tareas = await respuesta.json();

  if (!respuesta.ok || tareas.length === 0) {
    return;
  }

  const tarea = tareas[0];

  tareaEditando = tarea.id;

  document.getElementById("titulo-formulario-tarea").textContent =
    "Editar tarea";

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

  document.getElementById("cancelar-edicion-tarea").style.display =
    "inline-block";

  formularioTarea.style.display = "block";

  window.scrollTo({
    top: formularioTarea.offsetTop,
    behavior: "smooth"
  });
}


async function eliminarTarea(id) {

  const confirmar =
    confirm("¿Seguro que quieres eliminar esta tarea?");

  if (!confirmar) {
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


/* =========================
   AVISOS
========================= */

let avisoEditando = null;

const formularioAviso =
  document.getElementById("formulario-aviso");


document
  .getElementById("mostrar-formulario-aviso")
  .addEventListener("click", () => {

    avisoEditando = null;

    document.getElementById("titulo-formulario-aviso").textContent =
      "Nuevo aviso";

    document.getElementById("cancelar-edicion-aviso").style.display =
      "none";

    formularioAviso.style.display = "block";
  });


document
  .getElementById("cancelar-edicion-aviso")
  .addEventListener("click", () => {

    limpiarFormularioAviso();

    formularioAviso.style.display = "none";
  });


document
  .getElementById("guardar-aviso")
  .addEventListener("click", guardarAviso);


async function guardarAviso() {

  const datos = {
    titulo: document.getElementById("titulo_aviso").value.trim(),
    mensaje: document.getElementById("mensaje_aviso").value.trim(),
    fecha: document.getElementById("fecha_aviso").value,
    destinatario: document.getElementById("destinatario_aviso").value,
    activo: document.getElementById("activo_aviso").value === "true"
  };

  if (!datos.titulo || !datos.mensaje) {

    document.getElementById("mensaje-aviso").textContent =
      "Introduce el título y el mensaje.";

    return;
  }

  let respuesta;

  if (avisoEditando) {

    respuesta = await fetch(
      `${SUPABASE_URL}/rest/v1/avisos?id=eq.${avisoEditando}`,
      {
        method: "PATCH",
        headers: {
          ...headers,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(datos)
      }
    );

  } else {

    respuesta = await fetch(
      `${SUPABASE_URL}/rest/v1/avisos`,
      {
        method: "POST",
        headers: {
          ...headers,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(datos)
      }
    );
  }

  if (!respuesta.ok) {

    document.getElementById("mensaje-aviso").textContent =
      "No se ha podido guardar el aviso.";

    return;
  }

  document.getElementById("mensaje-aviso").textContent =
    "Aviso guardado correctamente.";

  limpiarFormularioAviso();

  formularioAviso.style.display = "none";

  cargarAvisos();
}


function limpiarFormularioAviso() {

  document.getElementById("titulo_aviso").value = "";
  document.getElementById("mensaje_aviso").value = "";
  document.getElementById("fecha_aviso").value = "";
  document.getElementById("destinatario_aviso").value = "todos";
  document.getElementById("activo_aviso").value = "true";

  avisoEditando = null;
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

  if (!respuesta.ok) {

    contenedor.innerHTML =
      "<p>No se han podido cargar los avisos.</p>";

    return;
  }

  if (avisos.length === 0) {

    contenedor.innerHTML =
      "<p>No hay avisos.</p>";

    return;
  }

  contenedor.innerHTML = "";

  avisos.forEach(aviso => {

    const elemento =
      document.createElement("div");

    const estado =
      aviso.activo ? "Activo" : "Inactivo";

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

      <p>
        <strong>👥 Destinatario:</strong>
        ${aviso.destinatario || "-"}
      </p>

      <p>
        <strong>📌 Estado:</strong>
        ${estado}
      </p>

      <button onclick="editarAviso('${aviso.id}')">
        ✏️ Editar
      </button>

      <button onclick="cambiarEstadoAviso('${aviso.id}', ${!aviso.activo})">
        ${aviso.activo ? "⏸️ Desactivar" : "▶️ Activar"}
      </button>

      <button onclick="eliminarAviso('${aviso.id}')">
        🗑️ Eliminar
      </button>

      <hr>
    `;

    contenedor.appendChild(elemento);
  });
}


async function editarAviso(id) {

  const respuesta = await fetch(
    `${SUPABASE_URL}/rest/v1/avisos?id=eq.${id}&select=id,titulo,mensaje,fecha,destinatario,activo`,
    {
      headers: headers
    }
  );

  const avisos = await respuesta.json();

  if (!respuesta.ok || avisos.length === 0) {
    return;
  }

  const aviso = avisos[0];

  avisoEditando = aviso.id;

  document.getElementById("titulo-formulario-aviso").textContent =
    "Editar aviso";

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

  document.getElementById("cancelar-edicion-aviso").style.display =
    "inline-block";

  formularioAviso.style.display = "block";

  window.scrollTo({
    top: formularioAviso.offsetTop,
    behavior: "smooth"
  });
}


async function cambiarEstadoAviso(id, nuevoEstado) {

  const respuesta = await fetch(
    `${SUPABASE_URL}/rest/v1/avisos?id=eq.${id}`,
    {
      method: "PATCH",
      headers: {
        ...headers,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        activo: nuevoEstado
      })
    }
  );

  if (!respuesta.ok) {
    alert("No se ha podido cambiar el estado del aviso.");
    return;
  }

  cargarAvisos();
}


async function eliminarAviso(id) {

  const confirmar =
    confirm("¿Seguro que quieres eliminar este aviso?");

  if (!confirmar) {
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


/* =========================
   INICIO
========================= */

cargarAlumnos();
cargarTareas();
cargarAvisos();
