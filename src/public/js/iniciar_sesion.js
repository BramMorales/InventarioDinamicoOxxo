document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Previene el envío clásico del formulario
  
    // Obtiene los datos del formulario
    const data = new FormData(e.target);
    const payload = {
      usuario_auth: data.get("username"),
      contrasena_auth: data.get("password"),
    };
  
    try {
      // Realiza la petición al servidor para autenticar al usuario
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      // Redirige a la vista principal si la solicitud fue exitosa
      // (Este comportamiento puede ajustarse según el status del servidor)
      if (res.ok) {
        window.location.href = "/Inicio";
      } else {
        const errorData = await res.json();
        alert(`Error de inicio de sesión: ${errorData.message || 'Credenciales incorrectas'}`);
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      alert("Error al conectar con el servidor.");
    }
  });