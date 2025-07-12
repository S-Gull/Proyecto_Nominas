console.log("carga el app_vc_ga");
const { ipcRenderer } = require("electron");
const { registerHTML_vc_ga, crudHTML_vc_ga, loginHTML_vc_ga, toggleEye_vc_ga } = require("../js/login");
const { plantillaHTML_vc_ga, btnColorModo_vc_ga, icon_vc_ga} = require("../js/plantilla");

if (loginHTML_vc_ga) {
  toggleEye_vc_ga();
          tailwind.config = {
          darkMode: 'class',
          theme: {
            extend: {
              colors: {
                primary: '#0D0A0B',
                secondary: '#454955',
                light: '#F3EFF5',
                accent1: '#72B01D',
                accent2: '#3F7D20',
                dark: {
                  900: '#0D0A0B',
                  800: '#1a1a1a',
                  700: '#2d2d2d',
                }
              },
              fontFamily: {
                inter: ['Inter', 'sans-serif'],
                verdana: ['Verdana', 'sans-serif'],
              },
              animation: {
                'fade-in': 'fadeIn 0.5s ease-in',
                'slide-down': 'slideDown 0.5s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'underline': 'underline 0.3s ease-out forwards'
              },
              keyframes: {
                fadeIn: {
                  '0%': { opacity: '0' },
                  '100%': { opacity: '1' },
                },
                slideDown: {
                  '0%': { transform: 'translateY(-20px)', opacity: '0' },
                  '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                pulse: {
                  '0%, 100%': { opacity: '1' },
                  '50%': { opacity: '0.8' },
                },
                underline: {
                  '0%': { width: '0' },
                  '100%': { width: '100%' },
                }
              }
            }
          }
        };
      btnColorModo_vc_ga.addEventListener('click', ()=>{
    document.documentElement.classList.toggle('dark');
         // Cambiar el icono según el modo actual
       if(document.documentElement.classList.contains('dark')) {
            icon_vc_ga.classList.remove('fa-sun');
            icon_vc_ga.classList.add('fa-moon');
        } else {
            icon_vc_ga.classList.remove('fa-moon');
            icon_vc_ga.classList.add('fa-sun');
        }
  });
}

if (registerHTML_vc_ga){
  toggleEye_vc_ga();
          tailwind.config = {
          darkMode: 'class',
          theme: {
            extend: {
              colors: {
                primary: '#0D0A0B',
                secondary: '#454955',
                light: '#F3EFF5',
                accent1: '#72B01D',
                accent2: '#3F7D20',
                dark: {
                  900: '#0D0A0B',
                  800: '#1a1a1a',
                  700: '#2d2d2d',
                }
              },
              fontFamily: {
                inter: ['Inter', 'sans-serif'],
                verdana: ['Verdana', 'sans-serif'],
              },
              animation: {
                'fade-in': 'fadeIn 0.5s ease-in',
                'slide-down': 'slideDown 0.5s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'underline': 'underline 0.3s ease-out forwards'
              },
              keyframes: {
                fadeIn: {
                  '0%': { opacity: '0' },
                  '100%': { opacity: '1' },
                },
                slideDown: {
                  '0%': { transform: 'translateY(-20px)', opacity: '0' },
                  '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                pulse: {
                  '0%, 100%': { opacity: '1' },
                  '50%': { opacity: '0.8' },
                },
                underline: {
                  '0%': { width: '0' },
                  '100%': { width: '100%' },
                }
              }
            }
          }
}
    btnColorModo_vc_ga.addEventListener('click', ()=>{
    document.documentElement.classList.toggle('dark');
         // Cambiar el icono según el modo actual
       if(document.documentElement.classList.contains('dark')) {
            icon_vc_ga.classList.remove('fa-sun');
            icon_vc_ga.classList.add('fa-moon');
        } else {
            icon_vc_ga.classList.remove('fa-moon');
            icon_vc_ga.classList.add('fa-sun');
        }
  });
}

if (plantillaHTML_vc_ga) {
          tailwind.config = {
          darkMode: 'class',
          theme: {
            extend: {
              colors: {
                primary: '#0D0A0B',
                secondary: '#454955',
                light: '#F3EFF5',
                accent1: '#72B01D',
                accent2: '#3F7D20',
                dark: {
                  900: '#0D0A0B',
                  800: '#1a1a1a',
                  700: '#2d2d2d',
                }
              },
              fontFamily: {
                inter: ['Inter', 'sans-serif'],
                verdana: ['Verdana', 'sans-serif'],
              },
              animation: {
                'fade-in': 'fadeIn 0.5s ease-in',
                'slide-down': 'slideDown 0.5s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'underline': 'underline 0.3s ease-out forwards'
              },
              keyframes: {
                fadeIn: {
                  '0%': { opacity: '0' },
                  '100%': { opacity: '1' },
                },
                slideDown: {
                  '0%': { transform: 'translateY(-20px)', opacity: '0' },
                  '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                pulse: {
                  '0%, 100%': { opacity: '1' },
                  '50%': { opacity: '0.8' },
                },
                underline: {
                  '0%': { width: '0' },
                  '100%': { width: '100%' },
                }
              }
            }
          }
        };
  console.log("plantilla");
    btnColorModo_vc_ga.addEventListener('click', ()=>{
    document.documentElement.classList.toggle('dark');
     // Cambiar el icono según el modo actual
       if(document.documentElement.classList.contains('dark')) {
            icon_vc_ga.classList.remove('fa-sun');
            icon_vc_ga.classList.add('fa-moon');
        } else {
            icon_vc_ga.classList.remove('fa-moon');
            icon_vc_ga.classList.add('fa-sun');
        }
  });
  
}

if (crudHTML_vc_ga) {
  tailwind.config = {
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          dark: '#1e293b'
        }
      }
    }
  }

  const formularioProducto_vc_ga = document.querySelector("#productForm");
  const nombreProducto_vc_ga = document.querySelector("#name");
  const precioProducto_vc_ga = document.querySelector("#price");
  const descripcionProducto_vc_ga = document.querySelector("#description");
  const listaProductos_vc_ga = document.querySelector("#products");

  let productos_vc_ga = [];
  let editando_vc_ga = false;
  let idProductoEditar_vc_ga;

  const eliminarProducto_vc_ga = async (id_vc_ga) => {
    const respuesta_vc_ga = confirm("¿Estás seguro de que quieres eliminarlo?");
    if (respuesta_vc_ga) {
      await ipcRenderer.invoke("eliminar-producto_vc_ga", id_vc_ga);
      await obtenerProductos_vc_ga();
    }
    return;
  };

  const obtenerProductos_vc_ga = async () => {
    productos_vc_ga = await ipcRenderer.invoke("obtener-productos_vc_ga");
    renderizarProductos_vc_ga(productos_vc_ga);
  };

  const editarProducto_vc_ga = async (id_vc_ga) => {
    const producto_vc_ga = await ipcRenderer.invoke("obtener-producto-por-id_vc_ga", id_vc_ga);
    if (!producto_vc_ga) {
      console.log(producto_vc_ga);
      alert("Producto no encontrado");
      return;
    } else { 
      nombreProducto_vc_ga.value = producto_vc_ga.nombre_vc_ga;
      precioProducto_vc_ga.value = producto_vc_ga.precio_vc_ga;
      descripcionProducto_vc_ga.value = producto_vc_ga.descripcion_vc_ga;

      editando_vc_ga = true;
      idProductoEditar_vc_ga = id_vc_ga;
      
      document.querySelector("#formTitle").textContent = "Editar Producto";
      document.querySelector("#submitText").textContent = "Actualizar";
      document.querySelector("#cancelEdit").classList.remove("hidden");
    }
  };

  formularioProducto_vc_ga.addEventListener("submit", async (e_vc_ga) => {
    try {
      e_vc_ga.preventDefault();

      const producto_vc_ga = {
        nombre_vc_ga: nombreProducto_vc_ga.value,
        precio_vc_ga: precioProducto_vc_ga.value,
        descripcion_vc_ga: descripcionProducto_vc_ga.value,
      };

      if (!editando_vc_ga) {
        await ipcRenderer.invoke("crear-producto_vc_ga", producto_vc_ga);
      } else {
        await ipcRenderer.invoke("actualizar-producto_vc_ga", idProductoEditar_vc_ga, producto_vc_ga);
        editando_vc_ga = false;
        idProductoEditar_vc_ga = "";
        document.querySelector("#formTitle").textContent = "Agregar Producto";
        document.querySelector("#submitText").textContent = "Guardar";
        document.querySelector("#cancelEdit").classList.add("hidden");
      }

      formularioProducto_vc_ga.reset();
      nombreProducto_vc_ga.focus();
      obtenerProductos_vc_ga();
    } catch (error_vc_ga) {
      console.log(error_vc_ga);
    }
  });

  document.querySelector("#cancelEdit").addEventListener("click", () => {
    editando_vc_ga = false;
    idProductoEditar_vc_ga = "";
    formularioProducto_vc_ga.reset();
    document.querySelector("#formTitle").textContent = "Agregar Producto";
    document.querySelector("#submitText").textContent = "Guardar";
    document.querySelector("#cancelEdit").classList.add("hidden");
  });

  const asignarEventos_vc_ga = () => {
    document.querySelectorAll('.btn-eliminar').forEach(btn_vc_ga => {
      btn_vc_ga.addEventListener('click', () => {
        eliminarProducto_vc_ga(btn_vc_ga.dataset.id_vc_ga);
      });
    });
    
    document.querySelectorAll('.btn-editar').forEach(btn_vc_ga => {
      btn_vc_ga.addEventListener('click', () => {
        editarProducto_vc_ga(btn_vc_ga.dataset.id_vc_ga);
      });
    });
  }

  const renderizarProductos_vc_ga = (productos_vc_ga) => {
    listaProductos_vc_ga.innerHTML = "";
    
    if (productos_vc_ga.length === 0) {
      listaProductos_vc_ga.innerHTML = `
        <div class="text-center py-10 text-gray-500 dark:text-gray-400">
          <i class="fas fa-box-open text-3xl mb-3"></i>
          <p>No hay productos registrados</p>
        </div>
      `;
      return;
    }

    productos_vc_ga.forEach((producto_vc_ga) => {
      const productCard_vc_ga = document.createElement('div');
      productCard_vc_ga.className = 'product-card bg-white dark:bg-gray-700 rounded-lg shadow p-4 mb-4 transition-all duration-300 hover:shadow-lg animate__animated animate__fadeIn';
      productCard_vc_ga.innerHTML = `
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white">${producto_vc_ga.nombre_vc_ga}</h3>
          <span class="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-sm font-medium px-2.5 py-0.5 rounded">
            $${producto_vc_ga.precio_vc_ga}
          </span>
        </div>
        
        <p class="text-gray-600 dark:text-gray-300 mb-4">${producto_vc_ga.descripcion_vc_ga || 'Sin descripción'}</p>
        
        <div class="flex space-x-2">
          <button data-id_vc_ga="${producto_vc_ga.id_vc_ga}" class="btn-eliminar flex-1 bg-red-500 hover:bg-red-600 text-white py-1.5 px-3 rounded-lg text-sm transition duration-200">
            <i class="fas fa-trash-alt mr-1"></i> Eliminar
          </button>
          
          <button data-id_vc_ga="${producto_vc_ga.id_vc_ga}" class="btn-editar flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-1.5 px-3 rounded-lg text-sm transition duration-200">
            <i class="fas fa-edit mr-1"></i> Editar
          </button>
        </div>
      `;
      
      listaProductos_vc_ga.appendChild(productCard_vc_ga);
    });
    
    asignarEventos_vc_ga();
  }

  const init_vc_ga = async () => {
    obtenerProductos_vc_ga();
    document.eliminarProducto_vc_ga = eliminarProducto_vc_ga;
    document.editarProducto_vc_ga = editarProducto_vc_ga;
  }

  init_vc_ga();

  btnColorModo_vc_ga.addEventListener('click', ()=>{
    document.documentElement.classList.toggle('dark')
  });
}