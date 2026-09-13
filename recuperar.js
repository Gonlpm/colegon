const SUPABASE_URL = "https://lclxdcsgfqwfahwlnjkj.supabase.co";
const SUPABASE_KEY = "sb_publishable_fH8WjNl3CLJr3Id9eQnQdQ_0AnynpMc";

const formulario =
  document.getElementById("recuperar-form");

const mensaje =
  document.getElementById("mensaje-recuperar");


function obtenerAccessToken() {

  const hash =
    window.location.hash.substring(1);

  const parametros =
    new URLSearchParams(hash);

  return parametros.get("access_token");
}


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


  const accessToken =
    obtenerAccessToken();


  if (!accessToken) {

    mensaje.textContent =
      "El enlace de recuperación no es válido o ha caducado.";

    return;
  }


  mensaje.textContent =
    "Cambiando contraseña...";


  try {

    const respuesta = await fetch(
      `${SUPABASE_URL}/auth/v1/user`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_KEY,
          "Authorization":
            `Bearer ${accessToken}`
        },

        body: JSON.stringify({
          password
        })
      }
    );


    if (!respuesta.ok) {

      mensaje.textContent =
        "No se ha podido cambiar la contraseña.";

      return;
    }


    mensaje.textContent =
      "Contraseña cambiada correctamente. Volviendo al inicio...";


    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    );


    setTimeout(() => {

      window.location.href =
        "index.html";

    }, 2000);


  } catch (error) {

    mensaje.textContent =
      "No se ha podido conectar con Cole Gon.";
  }

});
