document.addEventListener('DOMContentLoaded', async () => {
  const contenedorGeneral = document.getElementById('multiple_stores');
  const tpl = document.getElementById('tpl-tabla');

  try {
    // 1) Trae todas las tiendas
    const tiendasRes = await fetch('/api/tiendas');
    const { body: tiendas } = await tiendasRes.json();

    for (const tienda of tiendas) {
      // 2) Crea el wrapper de esta tienda
      const wrapper = document.createElement('div');
      wrapper.className = 'store-block';
      wrapper.innerHTML = `
        <div class="store-name">
          <h5>${tienda.nombre_tienda}</h5>
        </div>
      `;

      // 3) Clona el template de tu tabla EJS
      const tablaFragment = tpl.content.cloneNode(true);
      wrapper.appendChild(tablaFragment);

      // 4) Fetch de los activos de esta tienda (tipo “0” = técnico)
      const activosRes = await fetch(
        `/api/activosfijos/ubicacion/${tienda.id_tienda}&0`
      );
      const activosJSON = await activosRes.json();

      // 5) Llama a tu función llenartabla para este fragment
      //    Le pasamos el elemento raíz donde buscar los <tbody id="tabla_xxx">
      llenarTabla(activosJSON, 'Tecnico', wrapper);

      // 6) Inyecta el bloque completo al DOM
      contenedorGeneral.appendChild(wrapper);
    }

  } catch (err) {
    console.error('Error cargando tiendas o tablas:', err);
  }
});
