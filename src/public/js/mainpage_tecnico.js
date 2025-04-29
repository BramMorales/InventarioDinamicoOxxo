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
  
        result.body.forEach((activo) => {
            const renglon = document.createElement("tr");

            var contenedor
            switch(activo.lugar_activofijo)
            {
                case 1:
                    contenedor = document.getElementById("tabla_isla");
                    renglon.classList.add("tabla_isla");
                break;

                case 2:
                    contenedor = document.getElementById("tabla_cctv");
                    renglon.classList.add("tabla_cctv");
                break;

                case 3:
                    contenedor = document.getElementById("tabla_site");
                    renglon.classList.add("tabla_site");
                break;

                case 4:
                    contenedor = document.getElementById("tabla_movilidad");
                    renglon.classList.add("tabla_movilidad");
                break;
            }
            
            //
  
            renglon.innerHTML = `
                <tr>
                    <th>${activo.codigobarras_activo}</th>
                    <th>${activo.descripcion_activo}</th>
                    <th>${activo.ano_activo}</th>
                    <th>${activo.modelo_activo}</th>
                    <th>${activo.serie_activo}</th>
                    <th>${activo.observaciones_activo}</th>
                </tr>
            `;
  
            contenedor.appendChild(renglon);
        });
          
    } catch (err) {
        console.error("Error en la carga de resultados:", err.message);
    }
});
  