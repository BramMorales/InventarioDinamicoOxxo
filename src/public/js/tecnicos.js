document.addEventListener('DOMContentLoaded', async () => {
  const contenedorGeneral = document.getElementById('multiple_stores');
  const tpl = document.getElementById('tpl-tabla');
  
  try {
    const tecnicoRes = await fetch('/api/usuarios');
    const { body: tecnicos } = await tecnicoRes.json();
  
    for (const tecnico of tecnicos) {
      const authRes = await fetch('/api/auth');
      const { body: tecnicos } = await tecnicoRes.json();

      const wrapper = document.createElement('div');
      wrapper.className = 'store-block';
      wrapper.innerHTML = `
        <div class="store-name">
          <h5>${tecnico.apellidop_usuario}, ${tecnico.nombre_usuario}</h5>
        </div>
      `;
  
      const tablaFragment = tpl.content.cloneNode(true);
      wrapper.appendChild(tablaFragment);
  
      const activosRes = await fetch(
        `/api/activosfijos/ubicacion/${tecnico.id_usuario}&1`
      );
      const activosJSON = await activosRes.json();
  
      llenarTabla(activosJSON, 'Tecnico', wrapper);
  
      contenedorGeneral.appendChild(wrapper);
    }
  
  } catch (err) {
    console.error('Error cargando tiendas o tablas:', err);
  }
});
  