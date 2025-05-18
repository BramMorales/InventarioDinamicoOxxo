// — Helper para fetch + JSON
async function fetchJSON(url, options = {}) {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options
    });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  }
  
  // — Helper para crear un <select> dinámico
  async function crearSelect(campo) {
    const div = document.createElement("div");
    div.classList.add("form-group");
  
    const label = document.createElement("label");
    label.setAttribute("for", campo.name);
    label.textContent = campo.label;
    div.appendChild(label);
  
    const select = document.createElement("select");
    select.id = campo.name;
    select.name = campo.name;
    select.required = campo.required || false;
    select.classList.add("form-control");
  
    // placeholder
    const ph = document.createElement("option");
    ph.value = "";
    ph.textContent = "-- Selecciona --";
    ph.disabled = true;
    ph.selected = true;
    select.appendChild(ph);
  
    if (campo.options) {
      // opciones estáticas
      campo.options.forEach(optCfg => {
        const opt = document.createElement("option");
        opt.value       = optCfg.value;
        opt.textContent = optCfg.label;
        select.appendChild(opt);
      });
    } else if (campo.optionsEndpoint) {
      // opciones dinámicas desde API
      const data = await fetchJSON(campo.optionsEndpoint);
      data.body.forEach(item => {
        const opt = document.createElement("option");
        const idKey   = Object.keys(item).find(k => k.startsWith("id_"));
        const nameKey = Object.keys(item).find(k => k.startsWith("nombre_"));
        opt.value       = item[idKey];
        opt.textContent = item[nameKey];
        select.appendChild(opt);
      });
    }
  
    div.appendChild(select);
    return div;
  }
  
  // — Inicio de tu código
  const urlParams = new URLSearchParams(window.location.search);
  const busqueda = {
    id:     urlParams.get('id'),
    plaza:  urlParams.get('plaza'),
    region: urlParams.get('region'),
    tipo:   urlParams.get('type'),
    tabla:  urlParams.get('table'),
  };
  
  async function anadirActivo () {
    const user = window._usuario;
    const res = await fetch("/api/activosfijos/ubicacion/" + user + "&" + 1, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    if (!res.ok) throw new Error(`Error en la petición: ${res.statusText}`);
    const result = await res.json();
    llenarTabla(result, "Agregar");
  }
  
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      let id, res1, result1;
  
      switch (busqueda.tipo) {
        case '0':
          res1 = await fetch("/api/tiendas/" + busqueda.id, { method: "GET", headers: { "Content-Type": "application/json" } });
          result1 = await res1.json();
          document.getElementById('lbl_titulo').textContent = `OXXO - ${result1.body[0].nombre_tienda}`;
          document.getElementById('lbl_tienda').textContent = result1.body[0].nombre_tienda;
          await anadirActivo();
          break;
  
        case '1':
          // ...
          break;
  
        case '2':
          {
            const b = await fetchJSON("/api/bodegas/localizacion/"+ busqueda.plaza + "&" + busqueda.region);
            busqueda.id = b.body[0].id_bodega;
            document.getElementById('lbl_titulo').textContent = `OXXO - ${b.body[0].nombre_bodega}`;
            document.getElementById('lbl_tienda').textContent = b.body[0].nombre_bodega;
            await anadirActivo();
          }
          break;
  
        case '4':
          // — configuración de formularios
          const formularios = {
            '1': {
              titulo: "Usuario",
              url:    "/api/usuarios/agregar/",
              campos: [
                { name: "id_usuario",        value: 0 },
                { name: "nombre_usuario",    label: "Nombre",           type: "text",     required: true },
                { name: "apellidop_usuario", label: "Apellido Paterno", type: "text",     required: true },
                { name: "apellidom_usuario", label: "Apellido Materno", type: "text"                },
                { name: "usuario_auth",      label: "Usuario",           type: "text",     required: true },
                {
                    name:    "rol_auth",
                    label:   "Rol",
                    type:    "select",
                    required: true,
                    options: [    // <--- opciones estáticas
                      { value: 0, label: "admin" },
                      { value: 1, label: "técnico" },
                      { value: 2, label: "ATI" },
                      { value: 3, label: "Coordi" }
                    ]
                  },
                { 
                  name: "idplaza_usuario", 
                  label: "Plaza", 
                  type: "select", 
                  required: true ,
                   optionsEndpoint: "/api/plazas/"
                },
                { name: "contrasena_auth",   label: "Contraseña",        type: "password", required: true }
              ]
            },
            '2': {
                titulo: "Tienda",
                url: "/api/tiendas/agregar",
                campos: [
                    { name: "id_tienda", value: 0},
                    { name: "cr_tienda", label: "CR", type: "text", required: true },
                    { 
                        name: "idplaza_tienda", 
                        label: "Plaza", 
                        type: "select", 
                        required: true,
                        optionsEndpoint: "/api/plazas/"
                    },
                    { name: "nombre_tienda", label: "Nombre", type: "text", required: true }
                ]
            },

            '3': {
                titulo: "Plaza",
                url: "/api/plazas/agregar",
                campos: [
                    { name: "id_plaza", value: 0},
                    { 
                        name: "idregion_plaza", 
                        label: "Región", 
                        type: "select", 
                        required: true,
                        optionsEndpoint: "/api/regiones/"
                    },
                    { name: "nombre_plaza", label: "Nombre", type: "text", required: true }
                ]
            },

            '4': {
                titulo: "Region",
                url: "/api/regiones/agregar",
                campos: [
                    { name: "id_region", value: 0},
                    { name: "nombre_region", label: "Nombre", type: "text", required: true }
                ]
            }
          };
  
          const config = formularios[busqueda.tabla];
          if (!config) {
            alert("Formulario no disponible");
            window.location.href = `/Inicio`;
            throw new Error("Tipo de formulario inválido");
          }
  
          let valoresActuales = {};
          if (busqueda.id && busqueda.id !== "0") {
            // determino endpoint según tabla
            const endpointMap = {
              '1': `/api/usuarios/${busqueda.id}`,
              '2': `/api/tiendas/${busqueda.id}`,
              '3': `/api/plazas/${busqueda.id}`,
              '4': `/api/regiones/${busqueda.id}`,
            };
            try {
              const res = await fetch(endpointMap[busqueda.tabla]);
              const json = await res.json();
              valoresActuales = json.body[0] || {};
            } catch (err) {
              console.error("Error cargando datos para edición:", err);
            }
          }

          // 2) Renderizo el formulario
          document.getElementById("lbl_titulo").textContent = config.titulo;
          const form = document.getElementById("frm_agregar");
          form.innerHTML = "";

          for (const campo of config.campos) {
            // oculto el primer campo si es id
            if (campo.value !== undefined && !campo.label) {
              // lo guardo pero no creo un input visible
              continue;
            }

            if (campo.type === "select") {
              // creo el <select> dinámico
              const selDiv = await crearSelect(campo);
              // marco la opción actual si vengo de edición
              const sel = selDiv.querySelector("select");
              if (valoresActuales[campo.name] != null) {
                sel.value = valoresActuales[campo.name];
              }
              form.appendChild(selDiv);
            }
            else {
              // creo un <input> normal
              const div = document.createElement("div");
              div.className = "form-group";
              div.innerHTML = `
                <label for="${campo.name}">${campo.label}</label>
                <input
                  id="${campo.name}"
                  name="${campo.name}"
                  type="${campo.type || "text"}"
                  ${campo.required ? "required" : ""}
                  class="form-control"
                  value="${valoresActuales[campo.name] || ""}"
                />
              `;
              form.appendChild(div);
            }
          }

          // 3) Botón
          const btn = document.createElement("button");
          btn.type = "submit";
          btn.textContent = busqueda.id && busqueda.id !== "0" ? "Actualizar" : "Registrar";
          btn.className = "add-button";
          form.appendChild(btn);

          // 4) Listener de envío: si id≠0 hace PUT, si no POST
          form.onsubmit = async e => {
            e.preventDefault();
            const data = {};
            config.campos.forEach((c, i) => {
              if (i === 0 && c.value !== undefined) {
                data[c.name] = busqueda.id && busqueda.id !== "0"
                  ? parseInt(busqueda.id)
                  : undefined;
              } else if (c.type === "select") {
                data[c.name] = form.elements[c.name].value;
              } else {
                data[c.name] = form.elements[c.name].value;
              }
            });

            const method = (busqueda.id && busqueda.id !== "0") ? "PUT" : "POST";
            const url    = (method === "PUT")
              ? `${config.url.replace(/\/agregar\/?$/, "")}/${busqueda.id}`
              : config.url;

            try {
              const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              });
              if (!res.ok) throw new Error(res.statusText);

              // — SI ES PLAZA Y ES NUEVA, CREA TAMBIÉN LA BODEGA
              if (busqueda.tabla === '3' && method === "POST") {
                const plazaCreada = await res.json();
                const idNuevaPlaza = plazaCreada.body?.insertId || plazaCreada.body?.id_plaza;

                const payloadBodega = {
                  id_bodega: 0,
                  idplaza_bodega: idNuevaPlaza,
                  idregion_bodega: data.idregion_plaza,
                  nombre_bodega:"Bodega" + data.nombre_plaza  
                };

                const resBodega = await fetch("/api/bodegas/agregar", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payloadBodega)
                });

                if (!resBodega.ok) throw new Error("Error al crear la bodega.");
              }

              alert(`${method === "PUT" ? "Actualización" : "Registro"} exitoso.`);
              window.location.href = "/Inicio";
            } catch (err) {
              console.error("Error al guardar:", err);
              alert("No se pudo guardar el formulario");
            }
          };

        break;
  
        default:
          window.location.href = `/Inicio`;
          alert("Error: Tipo no válido");
          break;
      }
  
    } catch (err) {
      console.error("Error en la carga de resultados:", err.message);
    }
  });
  
document.querySelector('.add-button')?.addEventListener('click', async () => {
    const checkedBoxes = document.querySelectorAll('tbody input[type="checkbox"]:checked');
    for (const cb of checkedBoxes) {
      const row = cb.closest('tr');
      const payload = {
        id_activofijo: row.dataset.id,
        ubicacion_activo: busqueda.id,
        tipoubicacion_activofijo: busqueda.tipo,
      };
      try {
        await fetch("/api/activosfijos/agregar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (busqueda.tipo == 2) {
          window.location.href = `/Tienda?plaza=${busqueda.plaza}&region=${busqueda.region}&type=2`;
        } else {
          window.location.href = `/Tienda?id=${busqueda.id}&type=${busqueda.tipo}`;
        }
      } catch (error) {
        console.error("Error en el registro:", error);
        alert("No se pudo conectar con el servidor.");
      }
    }
  });
  