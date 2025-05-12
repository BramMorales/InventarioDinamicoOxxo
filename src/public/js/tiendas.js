document.addEventListener('DOMContentLoaded', async () => {
    try {
        await fetch("http://localhost:4000/api/tiendas", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const result = await res.json();

        console.log(result)
  
    } catch (err) {
      console.error("Error en la carga de resultados:", err.message);
    }
  });