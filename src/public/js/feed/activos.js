function llenarTabla(result, num)
{
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
        
        switch(num)
        {
            case 'Agregar':
                renglon.innerHTML = `
                <td><input type="checkbox"><label for="cb1"></label></td>
                <td>${activo.codigobarras_activo}</td>
                <td>${activo.descripcion_activo}</td>
                <td>${activo.ano_activo}</td>
                <td>${activo.modelo_activo}</td>
                <td>${activo.serie_activo}</td>
                <td>${activo.observaciones_activo}</td>
                `;
                break;

            case 'Tienda':
                const btnEliminar = document.createElement("button");
                btnEliminar.dataset.id = activo.id_activofijo;
                btnEliminar.dataset.class = "btn_eliminar";
                btnEliminar.textContent = "Eliminar";
                btnEliminar.type = "button";
                btnEliminar.style.backgroundColor = "#ff5c5c";
                btnEliminar.style.border = "none";
                btnEliminar.style.color = "white";
                btnEliminar.style.padding = "5px 10px";
                btnEliminar.style.cursor = "pointer";
                btnEliminar.style.borderRadius = "4px";

                btnHTML = btnEliminar.outerHTML;

                renglon.innerHTML = `
                <tr>
                    <th>${activo.codigobarras_activo}</th>
                    <th>${activo.descripcion_activo}</th>
                    <th>${activo.ano_activo}</th>
                    <th>${activo.modelo_activo}</th>
                    <th>${activo.serie_activo}</th>
                    <th>${activo.observaciones_activo}</th>
                    <th>${btnHTML}</th>
                </tr>
                `;
                break;

            case 'Tecnico':
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
                break;
        }
        
        contenedor.appendChild(renglon);
    });
}