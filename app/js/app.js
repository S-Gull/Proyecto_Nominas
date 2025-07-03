console.log("carga el app");
const { ipcRenderer } = require("electron")

const formularioProducto = document.querySelector("#productForm");
const nombreProducto = document.querySelector("#name");
const precioProducto = document.querySelector("#price");
const descripcionProducto = document.querySelector("#description");
const listaProductos = document.querySelector("#products");
let btnColorModo = document.getElementById("cambio-color")

let productos = [];
let editando = false;
let idProductoEditar;

const eliminarProducto = async (id) => {
  const respuesta = confirm("¿Estás seguro de que quieres eliminarlo?");
  if (respuesta) {
    await ipcRenderer.invoke("eliminar-producto", id);
    await obtenerProductos();
  }
  return;
};

const obtenerProductos = async () => {
  productos = await ipcRenderer.invoke("obtener-productos");
  renderizarProductos(productos);
};

const editarProducto = async (id) => {
  const producto = await ipcRenderer.invoke("obtener-producto-por-id", id);
  if (!producto) {
    console.log(producto);
    alert("Producto no encontrado");
    return;
  } else { 
  nombreProducto.value = producto.nombre;
  precioProducto.value = producto.precio;
  descripcionProducto.value = producto.descripcion;

  editando = true;
  idProductoEditar = id;
  
  document.querySelector("#formTitle").textContent = "Editar Producto";
  document.querySelector("#submitText").textContent = "Actualizar";
  document.querySelector("#cancelEdit").classList.remove("hidden");
}
};

formularioProducto.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();

    const producto = {
      nombre: nombreProducto.value,
      precio: precioProducto.value,
      descripcion: descripcionProducto.value,
    };

    if (!editando) {
      await ipcRenderer.invoke("crear-producto", producto);
    } else {
      await ipcRenderer.invoke("actualizar-producto", idProductoEditar, producto);
      editando = false;
      idProductoEditar = "";
      document.querySelector("#formTitle").textContent = "Agregar Producto";
      document.querySelector("#submitText").textContent = "Guardar";
      document.querySelector("#cancelEdit").classList.add("hidden");
    }

    formularioProducto.reset();
    nombreProducto.focus();
    obtenerProductos();
  } catch (error) {
    console.log(error);
  }
});

document.querySelector("#cancelEdit").addEventListener("click", () => {
  editando = false;
  idProductoEditar = "";
  formularioProducto.reset();
  document.querySelector("#formTitle").textContent = "Agregar Producto";
  document.querySelector("#submitText").textContent = "Guardar";
  document.querySelector("#cancelEdit").classList.add("hidden");
});


function asignarEventos() {
  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', () => {
      eliminarProducto(btn.dataset.id);
    });
  });
  
  document.querySelectorAll('.btn-editar').forEach(btn => {
    btn.addEventListener('click', () => {
      editarProducto(btn.dataset.id);
    });
  });
}

// En renderizarProductos, actualiza los botones:
>>>>>>> main

function renderizarProductos(productos) {
  listaProductos.innerHTML = "";
  
  if (productos.length === 0) {
    listaProductos.innerHTML = `
      <div class="text-center py-10 text-gray-500 dark:text-gray-400">
        <i class="fas fa-box-open text-3xl mb-3"></i>
        <p>No hay productos registrados</p>
      </div>
    `;
    return;
  }
  productos.forEach((producto) => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card bg-white dark:bg-gray-700 rounded-lg shadow p-4 mb-4 transition-all duration-300 hover:shadow-lg animate__animated animate__fadeIn';
    productCard.innerHTML = `
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">${producto.nombre}</h3>
        <span class="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-sm font-medium px-2.5 py-0.5 rounded">
          $${producto.precio}
        </span>
      </div>
      
      <p class="text-gray-600 dark:text-gray-300 mb-4">${producto.descripcion || 'Sin descripción'}</p>
      
      <div class="flex space-x-2">
        <button data-id="${producto.id}" class="btn-eliminar flex-1 bg-red-500 hover:bg-red-600 text-white py-1.5 px-3 rounded-lg text-sm transition duration-200">
          <i class="fas fa-trash-alt mr-1"></i> Eliminar
        </button>
        
        <button data-id="${producto.id}" class="btn-editar flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-1.5 px-3 rounded-lg text-sm transition duration-200">
          <i class="fas fa-edit mr-1"></i> Editar
        </button>
      </div>
    `;
    
    listaProductos.appendChild(productCard);\
  });
  
  asignarEventos(); 
}


function asignarEventos() {
  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', () => {
      eliminarProducto(btn.dataset.id);
    });
  });
  
  document.querySelectorAll('.btn-editar').forEach(btn => {
    btn.addEventListener('click', () => {
      editarProducto(btn.dataset.id);
    });

  });
  
  asignarEventos(); // Asignar eventos después de renderizar
}


async function init() {
  obtenerProductos();
  window.eliminarProducto = eliminarProducto;
  window.editarProducto = editarProducto;



}

init();

btnColorModo.addEventListener('click', ()=>{
  document.documentElement.classList.toggle('dark')
});