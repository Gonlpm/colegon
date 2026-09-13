const SUPABASE_URL = "https://lclxdcsgfqwfahwlnjkj.supabase.co";
const SUPABASE_KEY = "sb_publishable_fH8WjNl3CLJr3Id9eQnQdQ_0AnynpMc";

const loginForm = document.getElementById("login-form");
const mensaje = document.getElementById("mensaje");
const botonOlvido = document.getElementById("olvido-contrasena");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  mensaje.textContent = "Iniciando sesión...";

  try {
    const respuesta = await fetch(
      `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_KEY
        },
        body: JSON.stringify({
          email,
          password
        })
      }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      mensaje.textContent = "Correo o contraseña incorrectos.";
      return;
    }

    localStorage.setItem("access_token", datos.access_token);
    localStorage.setItem("user_id", datos.user.id);

    const perfilRespuesta = await fetch(
      `${SUPABASE_URL}/rest/v1/perfiles?usuario_id=eq.${datos.user.id}&select=rol`,
      {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${datos.access_token}`
        }
      }
    );

    const perfiles = await perfilRespuesta.json();

    if (!perfilRespuesta.ok || perfiles.length === 0) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_id");

      mensaje.textContent =
        "No se ha encontrado tu perfil.";

      return;
    }

    const rol = perfiles[0].rol;

    if (rol === "profesor") {
      window.location.href = "profesor.html";
      return;
    }

    if (rol === "alumno") {
      window.location.href = "alumno.html";
      return;
    }

    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");

    mensaje.textContent =
      "Tu rol no está configurado correctamente.";

  } catch (error) {

    mensaje.textContent =
      "No se ha podido conectar con Cole Gon.";
  }
});


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

    const respuesta = await fetch(
      `${SUPABASE_URL}/auth/v1/recover`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_KEY
        },

        body: JSON.stringify({
          email,
          redirect_to:
            "https://gonlpm.github.io/colegon/recuperar.html"
        })
      }
    );

    if (!respuesta.ok) {

      mensaje.textContent =
        "No se ha podido enviar el correo de recuperación.";

      return;
    }

    mensaje.textContent =
      "Si el correo está registrado, recibirás un enlace para cambiar la contraseña.";

  } catch (error) {

    mensaje.textContent =
      "No se ha podido conectar con Cole Gon.";
  }
});
