function llenarTabla(result, modo, root = document) {
    result.body.forEach(activo => {
      const tr = document.createElement('tr');
      tr.dataset.id = activo.id_activofijo;
  
      // 1) Elige cuál tbody usar
      let tbody;
      switch (activo.lugar_activofijo) {
        case 1: tbody = root.querySelector('#tabla_isla'); break;
        case 2: tbody = root.querySelector('#tabla_cctv');  break;
        case 3: tbody = root.querySelector('#tabla_site');  break;
        case 4: tbody = root.querySelector('#tabla_movilidad'); break;
      }
      if (!tbody) return; // seguridad
  
      // 2) Rellena según modo
      if (modo === 'Agregar') {
        tr.innerHTML = `
          <td><input type="checkbox"></td>
          <td>${activo.codigobarras_activo}</td>
          <td>${activo.descripcion_activo}</td>
          <td>${activo.ano_activo}</td>
          <td>${activo.modelo_activo}</td>
          <td>${activo.serie_activo}</td>
          <td>${activo.observaciones_activo}</td>
        `;
      } else if (modo === 'Tecnico') {
        tr.innerHTML = `
          <td>${activo.codigobarras_activo}</td>
          <td>${activo.descripcion_activo}</td>
          <td>${activo.ano_activo}</td>
          <td>${activo.modelo_activo}</td>
          <td>${activo.serie_activo}</td>
          <td>${activo.observaciones_activo}</td>
        `;
      } else if (modo === 'Tienda') {
        const btn = `<button data-id="${activo.id_activofijo}" onclick=Eliminar(event)><img id="borrar" src="/borrar.png" width="35" height="35"></button>`;
        tr.innerHTML = `
          <td>${activo.codigobarras_activo}</td>
          <td>${activo.descripcion_activo}</td>
          <td>${activo.ano_activo}</td>
          <td>${activo.modelo_activo}</td>
          <td>${activo.serie_activo}</td>
          <td>${activo.observaciones_activo}</td>
          <td>${btn}</td>
        `;
      }
  
      // 3) Lo engancha al <tbody> correcto
      tbody.appendChild(tr);
    });
  }
  
async function Eliminar(event) {
  const id = event.currentTarget.dataset.id;

  const payload = {
    id_activofijo: id,
    ubicacion_activo: user,
    tipoubicacion_activofijo: 1,
  };

  console.log(payload)
        try {
            // Realiza la petición para registrar al nuevo usuario
            const res = await fetch("/api/activosfijos/agregar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });
        
            const result = await res.json();
            console.log(result)
          } catch (error) {
            console.error("Error en el registro:", error);
            alert("No se pudo conectar con el servidor.");
          }
  }