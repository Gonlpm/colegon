const SUPABASE_URL =
  "https://lclxdcsgfqwfahwlnjkj.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_fH8WjNl3CLJr3Id9eQnQdQ_0AnynpMc";


const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


const formulario =
  document.getElementById("recuperar-form");

const mensaje =
  document.getElementById("mensaje-recuperar");


/* =========================
   COMPROBAR SESIÓN DE RECUPERACIÓN
========================= */

async function prepararRecuperacion() {

  mensaje.textContent =
    "Comprobando enlace de recuperación...";


  try {

    const { data, error } =
      await supabase.auth.getSession();


    if (error || !data.session) {

      mensaje.textContent =
        "El enlace de recuperación no es válido o ha caducado.";

      return false;
    }


    mensaje.textContent =
      "";

    return true;


  } catch (error) {

    mensaje.textContent =
      "No se ha podido comprobar el enlace.";

    return false;
  }
}


prepararRecuperacion();


/* =========================
   CAMBIAR CONTRASEÑA
========================= */

formulario.addEventListener("submit", async (event) => {

  event.preventDefault();


  const password =
    document.getElementById("nueva-password").value;

  const confirmar =
    document.getElementById("confirmar-password").value;


  if (password !== confirmar) {

    mensaje.textContent =
      "Las contraseñas no coinciden.";

    return;
  }


  if (password.length < 6) {

    mensaje.textContent =
      "La contraseña debe tener al menos 6 caracteres.";

    return;
  }


  mensaje.textContent =
    "Cambiando contraseña...";


  try {

    const { error } =
      await supabase.auth.updateUser({
        password: password
      });


    if (error) {

      console.error(error);

      mensaje.textContent =
        "No se ha podido cambiar la contraseña.";

      return;
    }


    mensaje.textContent =
      "Contraseña cambiada correctamente. Volviendo al inicio...";


    await supabase.auth.signOut();


    setTimeout(() => {

      window.location.href =
        "index.html";

    }, 2000);


  } catch (error) {

    console.error(error);

    mensaje.textContent =
      "No se ha podido conectar con Cole Gon.";
  }

});
