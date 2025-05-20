document.addEventListener('DOMContentLoaded', async () => {
  const contenedorGeneral = document.getElementById('multiple_stores');
  const tpl = document.getElementById('tpl-tabla');
  
  try {
    const tiendasRes = await fetch('/api/tiendas');
    const { body: tiendas } = await tiendasRes.json();
  
    for (const tienda of tiendas) {
      const wrapper = document.createElement('div');
      wrapper.className = 'store-block';
      wrapper.innerHTML = `
        <div class="store-name">
          <h5>${tienda.nombre_tienda}</h5>
        </div>
      `;
  
      const tablaFragment = tpl.content.cloneNode(true);
      wrapper.appendChild(tablaFragment);
  
      const activosRes = await fetch(
        `/api/activosfijos/ubicacion/${tienda.id_tienda}&0`
      );
      const activosJSON = await activosRes.json();
  
      llenarTabla(activosJSON, 'Tecnico', wrapper);

      contenedorGeneral.appendChild(wrapper);
    }  
  } catch (err) {
    console.error('Error cargando tiendas o tablas:', err);
  }
});
  