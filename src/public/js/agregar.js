const urlParams = new URLSearchParams(window.location.search);
const busqueda = {
    id: urlParams.get('id'),
    plaza: urlParams.get('plaza'),
    region: urlParams.get('region'),
    tipo: urlParams.get('type'),
};

document.addEventListener('DOMContentLoaded', async () => {
    const user = window._usuario;

    try {

        var id;
        if(busqueda.tipo == 2){
            const bodega = await fetch("http://localhost:4000/api/bodegas/localizacion/"+ busqueda.plaza + "&" + busqueda.region, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(),
            });

            id = await bodega.json();
            busqueda.id = id.body[0].id_bodega;
            console.log(busqueda.id)
        }

        const res = await fetch("http://localhost:4000/api/activosfijos/ubicacion/" + user + "&" + 1, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(),
        });

        const res1 = await fetch("http://localhost:4000/api/tiendas/" + busqueda.id, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(),
        });
  
        if (!res.ok) {
            throw new Error(`Error en la petición: ${res.statusText}`);
        }
  
        const result1 = await res1.json();
        const result = await res.json();

        if(busqueda.tipo != 2){
            document.getElementById('lbl_titulo').textContent = `OXXO - ${result1.body[0].nombre_tienda}`;
            document.getElementById('lbl_tienda').textContent = `${result1.body[0].nombre_tienda}`;
        }
        else{
            document.getElementById('lbl_titulo').textContent = `OXXO - ${id.body[0].nombre_bodega}`;
            document.getElementById('lbl_tienda').textContent = `${id.body[0].nombre_bodega}`;
        }

        result.body.forEach((activo) => {
            const renglon = document.createElement("tr");
            renglon.dataset.id = activo.id_activofijo;

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
                    <td><input type="checkbox"><label for="cb1"></label></td>
                    <td>${activo.codigobarras_activo}</td>
                    <td>${activo.descripcion_activo}</td>
                    <td>${activo.ano_activo}</td>
                    <td>${activo.modelo_activo}</td>
                    <td>${activo.serie_activo}</td>
                    <td>${activo.observaciones_activo}</td>
            `;
  
            contenedor.appendChild(renglon);
        });
          
    } catch (err) {
        console.error("Error en la carga de resultados:", err.message);
    }
});

document.querySelector('.add-button').addEventListener('click', async () => {
    // 1) Selecciona todos los checkboxes marcados dentro de <tbody>
    const checkedBoxes = document.querySelectorAll('tbody input[type="checkbox"]:checked');
    
    // 2) Para cada checkbox, sube hasta el <tr> y lee las celdas
    const seleccionados = Array.from(checkedBoxes).map(async cb => {
      const row = cb.closest('tr');
      const cells = row.querySelectorAll('td');
      const payload = {
        id_activofijo: row.dataset.id,
        ubicacion_activo: busqueda.id,
        tipoubicacion_activofijo: busqueda.tipo,
      };

      try {
        const res = await fetch("http://localhost:4000/api/activosfijos/agregar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
    
        const result = await res.json();

        if(busqueda.tipo==2)
        {
            window.location.href = `/Tienda?plaza=${busqueda.plaza}&region=${busqueda.region}&type=2`;
        }
        else{
            window.location.href = `/Tienda?id=${busqueda.id}&type=${busqueda.tipo}`;
        }
    
      } catch (error) {
        console.error("Error en el registro:", error);
        alert("No se pudo conectar con el servidor.");
      }
    });
  });
  