document.addEventListener('DOMContentLoaded', async () => {
    const user = window._usuario;

    try {
        const res = await fetch("http://localhost:4000/api/activosfijos/ubicacion/" + user + "&" + 1, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(),
        });
  
        if (!res.ok) {
            throw new Error(`Error en la petición: ${res.statusText}`);
        }
  
        const result = await res.json();

        llenarTabla(result, "Tecnico")
          
    } catch (err) {
        console.error("Error en la carga de resultados:", err.message);
    }
});
  