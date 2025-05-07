document.getElementById("btn_usuarios").addEventListener("click", (e)=>{
    window.location.href = `/Consulta?type=1`;
})

document.getElementById("btn_plazas").addEventListener("click", (e)=>{
    window.location.href = `/Consulta?type=3`;
})

document.getElementById("btn_tiendas").addEventListener("click", (e)=>{
    window.location.href = `/Consulta?type=2`;
})

document.getElementById("btn_regiones").addEventListener("click", (e)=>{
    window.location.href = `/Consulta?type=4`;
})