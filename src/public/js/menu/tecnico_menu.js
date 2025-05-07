document.getElementById("btn_bodega").addEventListener("click", (e)=>{
    const plaza = window._plaza;
    const region = window._region;

    window.location.href = `/Tienda?plaza=${plaza}&region=${region}&type=2`;
})