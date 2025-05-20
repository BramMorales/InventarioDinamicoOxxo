const plaza = window._plaza;
const user = window._usuario;

document.addEventListener('DOMContentLoaded', () => {
    const filterSelect = document.querySelector('.filter-select');
    const filterOptions = document.querySelector('.filter-options');
    const filterOptionsList = document.querySelectorAll('.filter-option');
    const filterText = document.querySelector('.filter-select-text');

    filterSelect.addEventListener('click', () => {
        filterOptions.classList.toggle('show');
    });

    filterOptionsList.forEach(option => {
        option.addEventListener('click', () => {
            filterText.textContent = option.textContent;
            filterOptions.classList.remove('show');
        });
    });

    document.addEventListener('click', (event) => {
        if (!filterOptions.contains(event.target) && !filterSelect.contains(event.target)) {
            filterOptions.classList.remove('show');
        }
    });
});

document.getElementById('frm_buscar').addEventListener('submit', async (e)=>{
    e.preventDefault();

    const contenedor = document.getElementById('lbl_resultado');
    const cabeceraInicial = `
    <div class="result-box">
        <h2>Resultados de la búsqueda</h2>
    </div>
    `;  

    contenedor.innerHTML = cabeceraInicial;

    const data = new FormData(e.target);
    const valor = data.get("txt_buscar");

    try {
        let res;
        if(document.getElementById('lst_filtro').textContent == "Tienda")
        {
            res = await fetch("/api/tiendas/busqueda/" + valor, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const result = await res.json();
            console.log(result)
            const contenedor = document.getElementById("lbl_resultado");
    
            if (!contenedor) {
                console.error("No se encontró el contenedor de resultados");
                return;
            }
    
            if (!Array.isArray(result.body)) {
                console.error("La respuesta no contiene una lista válida");
                return;
            } 
    
            result.body.forEach((resultado) => {
                if(user != 3 && plaza == resultado.plaza_tienda || user == 3){
                    const tarjeta = document.createElement("div");
                    tarjeta.classList.add("tarjeta-resultado");
        
                    tarjeta.innerHTML = `
                        <div class="info">
                            <button class="ver-resultado" data-id="${resultado.id_tienda}">
                                <h3>${resultado.cr_tienda} - ${resultado.nombre_tienda}</h3>
                            </button>
                        </div>
                    `;
        
                    contenedor.appendChild(tarjeta);

                    const btn = tarjeta.querySelector(".ver-resultado");
                    btn.addEventListener("click", () => {
                        const id = btn.dataset.id;
                        console.log("Hicieron click en tienda:", id);
                        window.location.href = `/Tienda?id=${id}&type=0`;
                    });
                }
            });
        } 
        else if(document.getElementById('lst_filtro').textContent == "Activo")
        {
            console.log("activos jeje")
        }
        else
        {

        }
  
        if (!res.ok) {
            throw new Error(`Error en la petición: ${res.statusText}`);
        }
  
        
  
    } catch (err) {
        console.error("Error en la carga de resultados:", err.message);
    }
});