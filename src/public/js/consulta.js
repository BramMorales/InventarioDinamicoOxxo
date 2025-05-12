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
                "Id", "CR", "Region", "Plaza", "Nombre", "", ""
              ],
              fields:  [ "id_tienda", "cr_tienda",  "idregion_tienda",  "idplaza_tienda",  "nombre_tienda",     "__btn__", "__btn2__" ],
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
                // última columna: el botón
                td.innerHTML = `
                  <button
                    class="btn_eliminar"
                    data-id="${obj[ config.fields[0] ]}"  /* el id del registro */
                    style="
                      background-color: #ff5c5c;
                      border: none;
                      color: white;
                      padding: 5px 10px;
                      cursor: pointer;
                      border-radius: 4px;
                    "
                  >Eliminar</button>
                `;
              } else if(field === "__btn2__")
              {
                td.innerHTML = `
                  <button
                    class="btn_modificar"
                    data-id="${obj[ config.fields[0] ]}"  /* el id del registro */
                    style="
                      background-color:rgb(0, 255, 42);
                      border: none;
                      color: white;
                      padding: 5px 10px;
                      cursor: pointer;
                      border-radius: 4px;
                    "
                  ><a href="/Agregar?type=4&table=${busqueda.tipo}&id=${obj[ config.fields[0] ]}">Modificar</a></button>
                `;
              }
              else{
                td.textContent = obj[field] ?? "";
              }
              tr.appendChild(td);
            });
          
            tbody.appendChild(tr);
          });
          
          
    } catch (err) {
        console.error("Error en la carga de resultados:", err.message);
    }
});

document.getElementById('btn_anadir').addEventListener('click', () => {
  window.location.href = `/Agregar?type=4&table=${busqueda.tipo}&id=0`
});

document.body.addEventListener('click', async (event) => {
  if (event.target && event.target.dataset.class === 'btn_eliminar') {
      // Get the id from the dataset of the clicked button
      const payload = {
          id_activofijo: event.target.dataset.id,
          ubicacion_activo: user,
          tipoubicacion_activofijo: 1,
      }

      try {
          // Realiza la petición para registrar al nuevo usuario
          const res = await fetch("/api/activosfijos/agregar", {
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
  }
});
