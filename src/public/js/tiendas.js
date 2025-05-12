document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch("/api/tiendas", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const result = await res.json();

        result.body.forEach(async (tienda) => {
            const renglon2 = document.createElement("tr");
            renglon2.dataset.id = tienda.id_tienda;
    
            var contenedor = document.getElementById("multiple_stores");
            renglon2.innerHTML = `
                <div class="store-name">
                    <h5>${tienda.nombre_tienda}</h5>
                </div>

                <div class="table-container">
                    <table>
                    <thead>
                        <tr>
                        <th colspan="7" class="text-lg font-semibold bg-yellow-400 p-4">ISLA</th>
                        </tr>
                        <tr>
                        <th class="bg-black text-white p-4">Activo</th>
                        <th class="bg-black text-white p-4">Descripción del activo</th>
                        <th class="bg-black text-white p-4">Año</th>
                        <th class="bg-black text-white p-4">Modelo</th>
                        <th class="bg-black text-white p-4">Número de serie</th>
                        <th class="bg-black text-white p-4">Observaciones</th>
                        <th class="bg-black text-white p-4"></th>
                        </tr>
                    </thead>
                    <tbody id="tabla_isla"></tbody>
                    </table>

                    <table>
                    <thead>
                        <tr>
                        <th colspan="7" class="text-lg font-semibold bg-yellow-400 p-4" >CCTV</th>
                        </tr>
                        <tr>
                        <th class="bg-black text-white p-4">Activo</th>
                        <th class="bg-black text-white p-4">Descripción del activo</th>
                        <th class="bg-black text-white p-4">Año</th>
                        <th class="bg-black text-white p-4">Modelo</th>
                        <th class="bg-black text-white p-4">Número de serie</th>
                        <th class="bg-black text-white p-4">Observaciones</th>
                        <th class="bg-black text-white p-4"></th>
                        </tr>
                    </thead>
                    <tbody id="tabla_cctv"></tbody>
                    </table>

                    <table>
                    <thead>
                        <tr>
                        <th colspan="7" class="text-lg font-semibold bg-yellow-400 p-4">SITE</th>
                        </tr>
                        <tr>
                        <th class="bg-black text-white p-4">Activo</th>
                        <th class="bg-black text-white p-4">Descripción del activo</th>
                        <th class="bg-black text-white p-4">Año</th>
                        <th class="bg-black text-white p-4">Modelo</th>
                        <th class="bg-black text-white p-4">Número de serie</th>
                        <th class="bg-black text-white p-4">Observaciones</th>
                        <th class="bg-black text-white p-4"></th>
                        </tr>
                    </thead>
                    <tbody id="tabla_site"></tbody>
                    </table>

                    <table>
                    <thead>
                        <tr>
                        <th colspan="7" class="text-lg font-semibold bg-yellow-400 p-4">MOVILIDAD</th>
                        </tr>
                        <tr>
                        <th class="bg-black text-white p-4">Activo</th>
                        <th class="bg-black text-white p-4">Descripción del activo</th>
                        <th class="bg-black text-white p-4">Año</th>
                        <th class="bg-black text-white p-4">Modelo</th>
                        <th class="bg-black text-white p-4">Número de serie</th>
                        <th class="bg-black text-white p-4">Observaciones</th>
                        <th class="bg-black text-white p-4"></th>
                        </tr>
                    </thead>
                    <tbody id="tabla_movilidad"></tbody>
                    </table>
                </div>            
                `;
            
            const res = await fetch("/api/activosfijos/ubicacion/" + tienda.id_tienda + "&" + 0, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(),
            });
    
            if (!res.ok) {
                throw new Error(`Error en la petición: ${res.statusText}`);
            }
    
            const result1 = await res.json();

            console.log(result1)
    
            contenedor.appendChild(renglon2);
            llenarTabla(result1, "Tecnico")
        });

        console.log()

    } catch (err) {
    console.error("Error en la carga de resultados:", err.message);
    }
});