/**
 * result: el JSON que trae { body: [...] }
 * modo:   'Agregar' | 'Tienda' | 'Tecnico'
 * root:   elemento dentro del cual buscar los TBODYs (no globalmente)
 */
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
        const btn = `<button data-id="${activo.id_activofijo}" class="btn_eliminar">Eliminar</button>`;
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
  