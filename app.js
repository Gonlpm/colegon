const SUPABASE_URL =
  "https://lclxdcsgfqwfahwlnjkj.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_fH8WjNl3CLJr3Id9eQnQdQ_0AnynpMc";


const clienteSupabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


const loginForm =
  document.getElementById("login-form");

const mensaje =
  document.getElementById("mensaje");

const botonOlvido =
  document.getElementById("olvido-contrasena");


/* =========================
   INICIAR SESIÓN
========================= */

loginForm.addEventListener("submit", async (event) => {

  event.preventDefault();

  const email =
    document.getElementById("email").value.trim();

  const password =
    document.getElementById("password").value;


  mensaje.textContent =
    "Iniciando sesión...";


  try {

    const { data, error } =
      await clienteSupabase.auth.signInWithPassword({
        email,
        password
      });


    if (error) {

      mensaje.textContent =
        "Correo o contraseña incorrectos.";

      return;
    }


    const usuario =
      data.user;

    const sesion =
      data.session;


    /* =========================
       GUARDAR SESIÓN
    ========================= */

    if (!usuario || !sesion) {

      mensaje.textContent =
        "No se ha podido iniciar la sesión.";

      return;
    }


    localStorage.setItem(
      "access_token",
      sesion.access_token
    );


    localStorage.setItem(
      "user_id",
      usuario.id
    );


    /* =========================
       COMPROBAR PERFIL
    ========================= */

    const { data: perfiles, error: errorPerfil } =
      await clienteSupabase
        .from("perfiles")
        .select("rol")
        .eq("usuario_id", usuario.id)
        .limit(1);


    if (
      errorPerfil ||
      !perfiles ||
      perfiles.length === 0
    ) {

      localStorage.removeItem("access_token");
      localStorage.removeItem("user_id");

      await clienteSupabase.auth.signOut();

      mensaje.textContent =
        "No se ha encontrado tu perfil.";

      return;
    }


    const rol =
      perfiles[0].rol;


    /* =========================
       PROFESOR
    ========================= */

    if (rol === "profesor") {

      window.location.href =
        "profesor.html";

      return;
    }


    /* =========================
       ALUMNO
    ========================= */

    if (rol === "alumno") {

      window.location.href =
        "alumno.html";

      return;
    }


    /* =========================
       ROL INCORRECTO
    ========================= */

    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");

    await clienteSupabase.auth.signOut();


    mensaje.textContent =
      "Tu rol no está configurado correctamente.";


  } catch (error) {

    console.error(
      "ERROR COMPLETO LOGIN:",
      error
    );

    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");

    mensaje.textContent =
      "No se ha podido conectar con Cole Gon.";
  }

});


/* =========================
   RECUPERAR CONTRASEÑA
========================= */

botonOlvido.addEventListener("click", async () => {

  const email =
    document.getElementById("email").value.trim();


  if (!email) {

    mensaje.textContent =
      "Escribe primero tu correo electrónico.";

    return;
  }


  mensaje.textContent =
    "Enviando correo de recuperación...";


  try {

    const { error } =
      await clienteSupabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo:
            "https://gonlpm.github.io/colegon/recuperar.html"
        }
      );


    if (error) {

      console.error(
        "ERROR COMPLETO SUPABASE:",
        error
      );

      mensaje.textContent =
        "ERROR SUPABASE: " +
        error.message;

      return;
    }


    mensaje.textContent =
      "Si el correo está registrado, recibirás un enlace para cambiar la contraseña.";


  } catch (error) {

    console.error(
      "ERROR COMPLETO:",
      error
    );

    mensaje.textContent =
      "ERROR: " +
      error.message;
  }

});


const botonMostrarContrasena = document.getElementById("mostrar-contrasena");
const campoContrasena = document.getElementById("password");

if (botonMostrarContrasena && campoContrasena) {
  botonMostrarContrasena.addEventListener("click", () => {

    if (campoContrasena.type === "password") {
      campoContrasena.type = "text";
      botonMostrarContrasena.textContent = "🙈";
      botonMostrarContrasena.setAttribute(
        "aria-label",
        "Ocultar contraseña"
      );
    } else {
      campoContrasena.type = "password";
      botonMostrarContrasena.textContent = "👁️";
      botonMostrarContrasena.setAttribute(
        "aria-label",
        "Mostrar contraseña"
      );
    }

  });
}
