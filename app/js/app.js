console.log("carga el app_vcga");
const { remote } = require("electron");
const main_vcga = remote.require("./main");

const formularioProducto_vcga = document.getElementById("productForm");
const nombreProducto_vcga = document.getElementById("name");
const precioProducto_vcga = document.getElementById("price");
const descripcionProducto_vcga = document.getElementById("description");
const listaProductos_vcga = document.getElementById("products");
let btnColorModo_vcga = document.getElementById("cambio-color")

let productos_vcga = [];
let editando_vcga = false;
let idProductoEditar_vcga;

const eliminarProducto_vcga = async (id_vcga) => {
  const respuesta_vcga = confirm("¿Estás seguro de que quieres eliminarlo?");
  if (respuesta_vcga) {
    await main_vcga.eliminarProducto_vcga(id_vcga);
    await obtenerProductos_vcga();
  }
  return;
};

const obtenerProductos_vcga = async () => {
  productos_vcga = await main_vcga.obtenerProductos_vcga();
  renderizarProductos_vcga(productos_vcga);
};

const editarProducto_vcga = async (id_vcga) => {
  const producto_vcga = await main_vcga.obtenerProductoPorId_vcga(id_vcga);
  nombreProducto_vcga.value = producto_vcga.nombre;
  precioProducto_vcga.value = producto_vcga.precio;
  descripcionProducto_vcga.value = producto_vcga.descripcion;

  editando_vcga = true;
  idProductoEditar_vcga = id_vcga;
  
  document.getElementById("formTitle").textContent = "Editar Producto";
  document.getElementById("submitText").textContent = "Actualizar";
  document.getElementById("cancelEdit").classList.remove("hidden");
};

formularioProducto_vcga.addEventListener("submit", async (e_vcga) => {
  try {
    e_vcga.preventDefault();

    const producto_vcga = {
      nombre: nombreProducto_vcga.value,
      precio: precioProducto_vcga.value,
      descripcion: descripcionProducto_vcga.value,
    };

    if (!editando_vcga) {
      await main_vcga.crearProducto_vcga(producto_vcga);
    } else {
      await main_vcga.actualizarProducto_vcga(idProductoEditar_vcga, producto_vcga);
      editando_vcga = false;
      idProductoEditar_vcga = "";
      document.getElementById("formTitle").textContent = "Agregar Producto";
      document.getElementById("submitText").textContent = "Guardar";
      document.getElementById("cancelEdit").classList.add("hidden");
    }

    formularioProducto_vcga.reset();
    nombreProducto_vcga.focus();
    obtenerProductos_vcga();
  } catch (error_vcga) {
    console.log(error_vcga);
  }
});

document.getElementById("cancelEdit").addEventListener("click", () => {
  editando_vcga = false;
  idProductoEditar_vcga = "";
  formularioProducto_vcga.reset();
  document.getElementById("formTitle").textContent = "Agregar Producto";
  document.getElementById("submitText").textContent = "Guardar";
  document.getElementById("cancelEdit").classList.add("hidden");
});
const renderizarProductos_vcga=(productos_vcga)=> {
  listaProductos_vcga.innerHTML = "";
  
  if (productos_vcga.length === 0) {
    listaProductos_vcga.innerHTML = `
      <div class="text-center py-10 text-gray-500 dark:text-gray-400">
        <i class="fas fa-box-open text-3xl mb-3"></i>
        <p>No hay productos registrados</p>
      </div>
    `;
    return;
  }

  productos_vcga.forEach((producto_vcga) => {
    listaProductos_vcga.innerHTML += `
      <div class="product-card bg-white dark:bg-gray-700 rounded-lg shadow p-4 mb-4 transition-all duration-300 hover:shadow-lg animate__animated animate__fadeIn">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white">${producto_vcga.nombre}</h3>
          <span class="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-sm font-medium px-2.5 py-0.5 rounded">
            $${producto_vcga.precio}
          </span>
        </div>
        
        <p class="text-gray-600 dark:text-gray-300 mb-4">${producto_vcga.descripcion || 'Sin descripción'}</p>
        
        <div class="flex space-x-2">
          <button onclick="eliminarProducto_vcga('${producto_vcga.id}')" 
                  class="flex-1 bg-red-500 hover:bg-red-600 text-white py-1.5 px-3 rounded-lg text-sm transition duration-200">
            <i class="fas fa-trash-alt mr-1"></i> Eliminar
          </button>
          
          <button onclick="editarProducto_vcga('${producto_vcga.id}')" 
                  class="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-1.5 px-3 rounded-lg text-sm transition duration-200">
            <i class="fas fa-edit mr-1"></i> Editar
          </button>
        </div>
      </div>
    `;
  });
}

async function init_vcga() {
  obtenerProductos_vcga();
  window.eliminarProducto = eliminarProducto_vcga;
  window.editarProducto = editarProducto_vcga;
}

init_vcga();

btnColorModo_vcga.addEventListener('click', ()=>{
  document.documentElement.classList.toggle('dark')
});