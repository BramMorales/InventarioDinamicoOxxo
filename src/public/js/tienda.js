const urlParams = new URLSearchParams(window.location.search);
const busqueda = {
    id: urlParams.get('id'),
    plaza: urlParams.get('plaza'),
    region: urlParams.get('region'),
    tipo: urlParams.get('type'),
};
const user = window._usuario;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        var id;
        if(busqueda.tipo == 2){
            const bodega = await fetch("/api/bodegas/localizacion/"+ busqueda.plaza + "&" + busqueda.region, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(),
            });

            id = await bodega.json();
            busqueda.id = id.body[0].id_bodega;
            console.log(busqueda.id)
        }

        const res = await fetch("/api/activosfijos/ubicacion/" + busqueda.id + "&" + busqueda.tipo, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(),
        });

        const res1 = await fetch("/api/tiendas/" + busqueda.id, {
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

        llenarTabla(result, "Tienda")
          
    } catch (err) {
        console.error("Error en la carga de resultados:", err.message);
    }
});

document.getElementById('btn_anadir').addEventListener('click', async () => {
    if(busqueda.tipo == 2){
        window.location.href = `/Agregar?plaza=${busqueda.plaza}&region=${busqueda.region}&type=2`;
    }
    else{
        window.location.href = `/Agregar?id=${busqueda.id}&type=${busqueda.tipo}`;
    }
});
