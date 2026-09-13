const SUPABASE_URL = "https://lclxdcsgfqwfahwlnjkj.supabase.co";
const SUPABASE_KEY = "sb_publishable_fH8WjNl3CLJr3Id9eQnQdQ_0AnynpMc";

const formulario =
  document.getElementById("recuperar-form");

const mensaje =
  document.getElementById("mensaje-recuperar");


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

    const respuesta = await fetch(
      `${SUPABASE_URL}/auth/v1/user`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_KEY,
          "Authorization":
            `Bearer ${localStorage.getItem("access_token")}`
        },

        body: JSON.stringify({
          password: password
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


    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");


    setTimeout(() => {

      window.location.href =
        "index.html";

    }, 2000);


  } catch (error) {

    mensaje.textContent =
      "No se ha podido conectar con Cole Gon.";

  }

});
