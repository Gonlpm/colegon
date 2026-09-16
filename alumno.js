const SUPABASE_URL =
  "https://lclxdcsgfqwfahwlnjkj.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_fH8WjNl3CLJr3Id9eQnQdQ_0AnynpMc";


const token =
  localStorage.getItem("access_token");

const userId =
  localStorage.getItem("user_id");


/* =========================
   COMPROBAR SESIÓN
========================= */

if (!token || !userId) {

  window.location.href = "index.html";

}


const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${token}`,
  "Content-Type": "application/json"
};


/* =========================
   COMPROBAR ROL DE ALUMNO
========================= */

async function comprobarAlumno() {

  try {

    const respuesta = await fetch(
      `${SUPABASE_URL}/rest/v1/perfiles?usuario_id=eq.${encodeURIComponent(userId)}&select=rol`,
      {
        method: "GET",
        headers: headers
      }
    );


    const perfiles = await respuesta.json();


    console.log(
      "Usuario conectado:",
      userId
    );

    console.log(
      "Respuesta perfiles:",
      perfiles
    );


    if (!respuesta.ok) {

      console.error(
        "Error comprobando perfil:",
        respuesta.status,
        perfiles
      );

      document.getElementById(
        "nombre-alumno"
      ).textContent =
        "No se ha podido comprobar tu perfil.";

      return false;
    }


    if (
      perfiles.length === 0 ||
      perfiles[0].rol !== "alumno"
    ) {

      localStorage.removeItem(
        "access_token"
      );

      localStorage.removeItem(
        "user_id"
      );

      window.location.href =
        "index.html";

      return false;
    }


    return true;


  } catch (error) {

    console.error(
      "Error comprobando alumno:",
      error
    );

    document.getElementById(
      "nombre-alumno"
    ).textContent =
      "No se ha podido comprobar tu perfil.";

    return false;
  }

}


/* =========================
   CERRAR SESIÓN
========================= */

const botonCerrarSesion =
  document.getElementById("cerrar-sesion");


if (botonCerrarSesion) {

  botonCerrarSesion.addEventListener(
    "click",
    () => {

      localStorage.removeItem(
        "access_token"
      );

      localStorage.removeItem(
        "user_id"
      );

      window.location.href =
        "index.html";

    }
  );

}


/* =========================
   DATOS DEL ALUMNO
========================= */

async function cargarAlumno() {

  try {

    const respuesta = await fetch(
      `${SUPABASE_URL}/rest/v1/alumnos?usuario_id=eq.${encodeURIComponent(userId)}&select=id,nombre,apellidos,numero_alumno,curso,grupo,correo,usuario_id`,
      {
        method: "GET",
        headers: headers
      }
    );


    const alumnos =
      await respuesta.json();


    console.log(
      "Estado respuesta alumnos:",
      respuesta.status
    );

    console.log(
      "Datos encontrados en alumnos:",
      alumnos
    );


    /* =========================
       ERROR DE SUPABASE / RLS
    ========================= */

    if (!respuesta.ok) {

      console.error(
        "ERROR TABLA ALUMNOS:",
        respuesta.status,
        alumnos
      );


      document.getElementById(
        "nombre-alumno"
      ).textContent =
        "No se han podido cargar tus datos.";


      document.getElementById(
        "numero-alumno"
      ).textContent =
        "-";


      document.getElementById(
        "curso-alumno"
      ).textContent =
        "-";


      document.getElementById(
        "grupo-alumno"
      ).textContent =
        "-";


      document.getElementById(
        "tareas"
      ).innerHTML =
        "<p>No se han podido cargar las tareas.</p>";


      document.getElementById(
        "avisos"
      ).innerHTML =
        "<p>No se han podido cargar los avisos.</p>";


      return;
    }


    /* =========================
       NO EXISTE EL ALUMNO
    ========================= */

    if (alumnos.length === 0) {

      console.warn(
        "No existe ningún alumno con este usuario_id:",
        userId
      );


      document.getElementById(
        "nombre-alumno"
      ).textContent =
        "No se han encontrado tus datos.";


      document.getElementById(
        "numero-alumno"
      ).textContent =
        "-";


      document.getElementById(
        "curso-alumno"
      ).textContent =
        "-";


      document.getElementById(
        "grupo-alumno"
      ).textContent =
        "-";


      document.getElementById(
        "tareas"
      ).innerHTML =
        "<p>No se pueden cargar las tareas porque no se ha encontrado tu alumno.</p>";


      document.getElementById(
        "avisos"
      ).innerHTML =
        "<p>No se han podido cargar los avisos.</p>";


      return;
    }


    /* =========================
       DATOS ENCONTRADOS
    ========================= */

    const alumno =
      alumnos[0];


    document.getElementById(
      "nombre-alumno"
    ).textContent =
      `${alumno.nombre || ""} ${alumno.apellidos || ""}`.trim();


    document.getElementById(
      "numero-alumno"
    ).textContent =
      alumno.numero_alumno || "-";


    document.getElementById(
      "curso-alumno"
    ).textContent =
      alumno.curso || "-";


    document.getElementById(
      "grupo-alumno"
    ).textContent =
      alumno.grupo || "-";


    console.log(
      "Alumno cargado correctamente:",
      alumno
    );


    await cargarTareas(
      alumno.id
    );


    await cargarAvisos();

  } catch (error) {

    console.error(
      "ERROR CARGANDO ALUMNO:",
      error
    );


    document.getElementById(
      "nombre-alumno"
    ).textContent =
      "No se han podido cargar tus datos.";


    document.getElementById(
      "tareas"
    ).innerHTML =
      "<p>No se han podido cargar las tareas.</p>";


    document.getElementById(
      "avisos"
    ).innerHTML =
      "<p>No se han podido cargar los avisos.</p>";
  }

}


/* =========================
   TAREAS PENDIENTES
========================= */

async function cargarTareas(
  alumnoId
) {

  const contenedor =
    document.getElementById("tareas");


  try {

    /*
      IMPORTANTE:
      Las tareas pertenecen al ID del alumno
      de la tabla alumnos, no al usuario_id
      de Supabase.
    */

    const respuesta = await fetch(
      `${SUPABASE_URL}/rest/v1/tareas?alumno_id=eq.${encodeURIComponent(alumnoId)}&estado=eq.Pendiente&select=id,texto,descripcion,asignatura,fecha_limite,estado&order=fecha_limite.asc`,
      {
        method: "GET",
        headers: headers
      }
    );


    const tareas =
      await respuesta.json();


    console.log(
      "Respuesta tareas:",
      tareas
    );


    if (!respuesta.ok) {

      console.error(
        "ERROR TAREAS:",
        respuesta.status,
        tareas
      );


      contenedor.innerHTML =
        "<p>No se han podido cargar las tareas.</p>";

      return;
    }


    if (tareas.length === 0) {

      contenedor.innerHTML =
        "<p>🎉 No tienes tareas pendientes.</p>";

      return;
    }


    contenedor.innerHTML = "";


    tareas.forEach(
      tarea => {

        const elemento =
          document.createElement("div");


        elemento.className =
          "tarea-item";


        elemento.innerHTML = `
          <h3>
            ${tarea.texto || "Tarea"}
          </h3>

          ${
            tarea.descripcion
              ? `<p>${tarea.descripcion}</p>`
              : ""
          }

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

            <span class="estado-pendiente">
              ${tarea.estado || "Pendiente"}
            </span>
          </p>
        `;


        contenedor.appendChild(
          elemento
        );

      }
    );


  } catch (error) {

    console.error(
      "ERROR CARGANDO TAREAS:",
      error
    );


    contenedor.innerHTML =
      "<p>No se han podido cargar las tareas.</p>";
  }

}


/* =========================
   AVISOS
========================= */

async function cargarAvisos() {

  const contenedor =
    document.getElementById("avisos");


  try {

    const respuesta = await fetch(
      `${SUPABASE_URL}/rest/v1/avisos?activo=eq.true&destinatario=in.(todos,alumnos)&select=titulo,mensaje,fecha,destinatario&order=fecha.desc`,
      {
        method: "GET",
        headers: headers
      }
    );


    const avisos =
      await respuesta.json();


    console.log(
      "Respuesta avisos:",
      avisos
    );


    if (!respuesta.ok) {

      console.error(
        "ERROR AVISOS:",
        respuesta.status,
        avisos
      );


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


    avisos.forEach(
      aviso => {

        const elemento =
          document.createElement("div");


        elemento.innerHTML = `
          <h3>
            ${aviso.titulo || "Aviso"}
          </h3>

          <p>
            ${aviso.mensaje || ""}
          </p>

          <p>
            <strong>📅 Fecha:</strong>
            ${aviso.fecha || "-"}
          </p>
        `;


        contenedor.appendChild(
          elemento
        );

      }
    );


  } catch (error) {

    console.error(
      "ERROR CARGANDO AVISOS:",
      error
    );


    contenedor.innerHTML =
      "<p>No se han podido cargar los avisos.</p>";
  }

}


/* =========================
   INICIO
========================= */

async function iniciarPortalAlumno() {

  const esAlumno =
    await comprobarAlumno();


  if (!esAlumno) {
    return;
  }


  await cargarAlumno();

}


iniciarPortalAlumno();
