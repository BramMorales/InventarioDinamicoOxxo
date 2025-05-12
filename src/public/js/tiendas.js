document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch("/api/tiendas", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const result = await res.json();

        result.body.forEach(async (tienda) => {
            const renglon2 = document.createElement("tr");
            renglon2.dataset.id = tienda.id_tienda;
    
            var contenedor = document.getElementById("multiple_stores");
            renglon2.innerHTML = `
                <div class="store-name">
                    <h5>${tienda.nombre_tienda}</h5>
                </div>

            `;

            const res = await fetch("/api/activosfijos/ubicacion/" + tienda.id_tienda + "&" + 0, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(),
            });
      
            if (!res.ok) {
                throw new Error(`Error en la petición: ${res.statusText}`);
            }
      
            const result1 = await res.json();
    
            contenedor.appendChild(renglon2);
            llenarTabla(result1, "Tecnico")
        });

        console.log()
  
    } catch (err) {
      console.error("Error en la carga de resultados:", err.message);
    }
  });