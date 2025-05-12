document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('multiple_stores');
  
    try {
      const resTiendas = await fetch("/api/tiendas", { headers: { "Content-Type": "application/json" } });
      const { body: tiendas } = await resTiendas.json();
  
      for (const tienda of tiendas) {
        // 1) crea el bloque padre
        const storeWrapper = document.createElement('div');
        storeWrapper.className = 'store-wrapper';
        storeWrapper.id = `store-${tienda.id_tienda}`;
        storeWrapper.innerHTML = `
          <div class="store-name">
            <h5>${tienda.nombre_tienda}</h5>
          </div>
        `;
  
        // 2) clona el template de la tabla
        const tpl = document.getElementById('tpl-tabla');
        const tablaClone = tpl.content.cloneNode(true);
  
        // 3) rellena el <tbody> de este clone con tus filas
        const tbody = tablaClone.querySelector('tbody');
        // obtienes los activos…
        const resActivos = await fetch(
          `/api/activosfijos/ubicacion/${tienda.id_tienda}&0`,
          { headers: { "Content-Type": "application/json" } }
        );
        const { body: activos } = await resActivos.json();
  
        activos.forEach(activo => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${activo.codigobarras_activo}</td>
            <td>${activo.descripcion_activo}</td>
            <td>${activo.ano_activo}</td>
            <td>${activo.modelo_activo}</td>
            <td>${activo.serie_activo}</td>
            <td>${activo.observaciones_activo}</td>
            <td><button class="btn-ver" data-id="${activo.id_activofijo}">Ver</button></td>
          `;
          tbody.appendChild(tr);
        });
  
        // 4) añades el clone completo al wrapper
        storeWrapper.appendChild(tablaClone);
  
        // 5) y finalmente lo pegas al contenedor principal
        container.appendChild(storeWrapper);
      }
    } catch (err) {
      console.error("Error cargando tiendas/activos:", err);
    }
  });
  