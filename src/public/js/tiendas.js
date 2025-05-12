document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch("/api/tiendas", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const result = await res.json();

        result.body.forEach((activo) => {
            const renglon = document.createElement("tr");
            renglon.dataset.id = activo.id_activofijo;
    
            var contenedor = document.getElementById("multiple_stores");
            renglon.innerHTML = `
                <div id=${activo.id_tienda}>
                    <div class="store-name">
                    <h5>${activo.nombre_tienda}</h5>
                    </div>

                    <%- include('./partial/tabla') %>
                </div>
            `;
            contenedor.appendChild(renglon);
        });

        console.log()
  
    } catch (err) {
      console.error("Error en la carga de resultados:", err.message);
    }
  });