const urlParams = new URLSearchParams(window.location.search);
const busqueda = {
    tipo: urlParams.get('type'),
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const endpoints = {
      '1': {
        url: "/api/usuarios/", 
        headers: [
          "Id", "Nombre(s)", "Apellido paterno", "Apellido materno", "Plaza", "Usuario", "", ""
        ],
        fields:  [ "id_usuario", "nombre_usuario",  "apellidop_usuario",  "apellidom_usuario",  "idplaza_usuario",  "",     "__btn__", "__btn2__" ],
        titulo: "OXXO - Usuarios",
        tienda: "Usuarios"
      },
            
      '2': {
        url: "/api/tiendas/",
        headers: [
          "Id", "CR", "Plaza", "Nombre", "", ""
        ],
        fields:  [ "id_tienda", "cr_tienda", "idplaza_tienda",  "nombre_tienda",     "__btn__", "__btn2__" ],
        titulo: "OXXO - Tiendas",
        tienda: "Tienda"
      },
            
      '3': {
        url: "/api/plazas/",
        headers: [
          "Id", "Region", "Nombre", "", ""
        ],
        fields:  [ "id_plaza", "idregion_plaza",  "nombre_plaza", "__btn__", "__btn2__" ],
        titulo: "OXXO - Plazas",
        tienda: "Plazas"
      },
        
      '4': {
        url: "/api/regiones/",
        headers: [
          "Id", "Nombre(s)", "", ""
        ],
        fields:  [ "id_region", "nombre_region",     "__btn__", "__btn2__" ],
        titulo: "OXXO - Regiones",
        tienda: "Regiones"
      }
    };
      
    const config = endpoints[busqueda.tipo];

    if (!config) {
      alert("Opción no válida");
      window.location.href = `/Inicio`;
      throw new Error("Tipo de búsqueda inválido");
    }
          
    const theadRow = document.createElement("tr");
    theadRow.innerHTML = config.headers
      .map(h => `<th class="bg-black text-white p-4">${h}</th>`)
      .join("");
    document.getElementById("tabla_usuarioshead").appendChild(theadRow);

    document.getElementById('lbl_titulo').textContent = config.titulo;
    document.getElementById('lbl_tienda').textContent = config.tienda;
          
    const res = await fetch(config.url, { method: "GET", headers: { "Content-Type":"application/json" } });
    if (!res.ok) throw new Error(`Error: ${res.statusText}`);
    const result = await res.json();
         
    const tbody = document.getElementById("tabla_usuariosbody");
    result.body.forEach(obj => {
    const tr = document.createElement("tr");
    tr.classList.add("tabla_usuariosbody");
         
      config.fields.forEach(field => {
        const td = document.createElement("td");

        if (field === "__btn__") {
          td.innerHTML = `
            <button 
              class="btn_eliminar"
              data-id="${obj[ config.fields[0] ]}"
              data-tipo="${config.url}"
              style="
                background-color: #ffffff;
                border: none;
                color: white;
                padding: 5px 10px;
                cursor: pointer;
                border-radius: 4px;"
            >
            <img 
              id="borrar" 
              src="/borrar.png" 
              width="35" 
              height="35"
            >
            </button>`;
        } else if(field === "__btn2__")
        {
          td.innerHTML = `
            <button 
              class="btn_modificar"
              data-id="${obj[ config.fields[0] ]}"
              style="
                background-color: #ffffff;
                border: none;
                color: white;
                padding: 5px 10px;
                cursor: pointer;
                border-radius: 4px;"
            >
            <a href="/Agregar?type=4&table=${busqueda.tipo}&id=${obj[ config.fields[0] ]}">
            <img 
              id="borrar" 
              src="/editar.png" 
              width="35" 
              height="35"
            >
            </a>
            </button>`;
        }
        else{
          td.textContent = obj[field] ?? "";
        }
        
        tr.appendChild(td);
      
      });
          
      tbody.appendChild(tr);  
    });   
    
    document.body.addEventListener("click", async (event) => {
      const btn = event.target.closest(".btn_eliminar"); // <- clave

      if (btn) {
        const eliminarUrl = `${btn.dataset.tipo}eliminar/${btn.dataset.id}`;

        try {
          const res = await fetch(eliminarUrl, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            }
          });

          if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

          alert("Registro eliminado correctamente");
          location.reload();
        } catch (err) {
          console.error("Error al eliminar:", err);
          alert("No se pudo eliminar el registro.");
        }
      }
    });

  } catch (err) {
    console.error("Error en la carga de resultados:", err.message);
  }
});

document.getElementById('btn_anadir').addEventListener('click', () => {
  window.location.href = `/Agregar?type=4&table=${busqueda.tipo}&id=0`
});

