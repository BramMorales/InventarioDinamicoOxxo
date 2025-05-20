document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault(); 

  const data = new FormData(e.target);
  const payload = {
    usuario_auth: data.get("username"),
    contrasena_auth: data.get("password"),
  };
  
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  
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