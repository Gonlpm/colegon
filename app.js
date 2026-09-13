const SUPABASE_URL = "https://lclxdcsgfqwfahwlnjkj.supabase.co";
const SUPABASE_KEY = "sb_publishable_fH8WjNl3CLJr3Id9eQnQdQ_0AnynpMc";

const loginForm = document.getElementById("login-form");
const mensaje = document.getElementById("mensaje");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
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
          email: email,
          password: password
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

    mensaje.textContent = "Inicio de sesión correcto.";

  } catch (error) {
    mensaje.textContent = "No se ha podido conectar con Cole Gon.";
  }
});
