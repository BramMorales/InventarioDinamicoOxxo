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
  
          document.getElementById("lbl_titulo").textContent = config.titulo;
          const form = document.getElementById("frm_agregar");
          form.innerHTML = "";
  
          // — crear campos, incluyendo el select dinámico
    for (const campo of config.campos) {
  // Si el campo es un <select>
  if (campo.type === "select") {
    const selDiv = await crearSelect(campo);
    selDiv.classList.add("mb-3"); // Espacio inferior para separación visual
    form.appendChild(selDiv);
  }

  // Si el campo es un input tradicional
  else if (campo.label) {
    const div = document.createElement("div");
    div.classList.add("mb-3"); // Bootstrap: espacio inferior

    const label = document.createElement("label");
    label.textContent = campo.label;
    label.setAttribute("for", campo.name);
    label.classList.add("form-label"); // Estilo para etiquetas

    const input = document.createElement("input");
    input.name = campo.name;
    input.id = campo.name;
    input.type = campo.type || "text";
    input.required = campo.required || false;
    input.placeholder = campo.placeholder || ""; // Mejora la experiencia del usuario
    input.classList.add("form-control", "shadow-sm"); // Estilo suave y sombreado

    // Opcional: ayuda textual debajo del input
    if (campo.helpText) {
      const small = document.createElement("div");
      small.classList.add("form-text");
      small.textContent = campo.helpText;
      div.appendChild(small);
    }

    div.appendChild(label);
    div.appendChild(input);
    form.appendChild(div);
    
  }
}

  
          // — botón registrar
          const submitBtn = document.createElement("button");
          submitBtn.textContent = "Registrar";
          submitBtn.type = "submit";
          submitBtn.classList.add("add-button");
          form.appendChild(submitBtn);

          // Si es modo edición, rellenar campos con datos existentes
          if (busqueda.id != 0) {
            let endpoint = "";

            switch (busqueda.tabla) {
              case '1':
                endpoint = "/api/usuarios/" + busqueda.id;
                break;
              case '2':
                endpoint = "/api/tiendas/" + busqueda.id;
                break;
              case '3':
                endpoint = "/api/plazas/" + busqueda.id;
                break;
              case '4':
                endpoint = "/api/regiones/" + busqueda.id;
                break;
            }

            if (endpoint) {
              try {
                const res = await fetch(endpoint, {
                  method: "GET",
                  headers: { "Content-Type": "application/json" }
                });
                const result = await res.json();
                const datos = result.body[0];

                // rellenar inputs
                config.campos.forEach(campo => {
                  const el = form.elements[campo.name];
                  if (!el) return;

                  if (campo.type === "select") {
                    el.value = datos[campo.name];
                  } else {
                    el.value = datos[campo.name] ?? "";
                  }
                });
              } catch (e) {
                console.error("Error cargando datos para edición:", e);
                alert("No se pudieron cargar los datos para edición");
              }
            }
          }
  
          if (config.campos.some(c => c.name === 'usuario_auth')) {
            // función de generación
            form.elements['usuario_auth'].enable = false;

            function generarUsuarioAuth() {
              const ap = form.elements['apellidop_usuario']?.value.trim() || "";
              const am = form.elements['apellidom_usuario']?.value.trim() || "";
              const no = form.elements['nombre_usuario']?.value.trim()    || "";
          
              if (ap.length >= 2 && am.length >= 1 && no.length >= 1) {
                const part = ap.slice(0,2).toLowerCase()
                           + am[0].toLowerCase()
                           + no[0].toLowerCase();
                const nums = String(Math.floor(Math.random()*1000)).padStart(3,'0');
                form.elements['usuario_auth'].value = part + nums;
              }
            }
          
            // registrar listeners solo si existen esos inputs
            ['apellidop_usuario','apellidom_usuario','nombre_usuario']
              .forEach(id => {
                const el = form.elements[id];
                if (el) el.addEventListener('input', generarUsuarioAuth);
              });
          
            // y una primera corrida
            generarUsuarioAuth();
          }

          // — listener de submit
          form.addEventListener("submit", async (e) => {
            e.preventDefault();
          
            const data = {};
            config.campos.forEach((c, i) => {
              if (c.type === "select") {
                // Recoge el value numérico de cualquier <select>
                data[c.name] = form.elements[c.name].value;
              } else if (i === 0 && c.value !== undefined) {
                // Primer campo oculto (id_…)
                if(busqueda.id != 0){
                  data[c.name] = parseInt(busqueda.id);
                }
                else{
                  data[c.name] = 0;
                }
              } else {
                // Inputs normales
                data[c.name] = form.elements[c.name].value || "";
              }
            });
          
            console.log(data)
            try {
              const res = await fetch(config.url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
              });
              if (!res.ok) throw new Error("Error en el registro");
              alert("Registro exitoso");
              location.href = "/Inicio";
            } catch (err) {
              console.error("Error al registrar:", err);
              alert("No se pudo registrar el formulario");
            }
          });
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
        await fetch("http://localhost:4000/api/activosfijos/agregar", {
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
  