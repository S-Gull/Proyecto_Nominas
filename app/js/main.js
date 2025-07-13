<<<<<<< HEAD
console.log('carga el main_vcga');
const { BrowserWindow } = require("electron");
const path = require('path');
const crud_vcga = require("../database/crud");

const rutaApp_vcga = path.join(__dirname, '..', '/');

let ventana_vcga;

// Adaptamos las funciones para que devuelvan promesas
const crearProducto_vcga = (producto_vcga) => {
  return new Promise((resolve_vcga, reject_vcga) => {
    crud_vcga.crearProducto_vcga(producto_vcga, (err_vcga, result_vcga) => {
      if (err_vcga) return reject_vcga(err_vcga);
      resolve_vcga(result_vcga);
    });
  });
};

// Repetimos el mismo patrón para las demás funciones
const obtenerProductos_vcga = () => new Promise((resolve_vcga, reject_vcga) => {
  crud_vcga.obtenerProductos_vcga((err_vcga, results_vcga) => {
    if (err_vcga) return reject_vcga(err_vcga);
    resolve_vcga(results_vcga);
  });
});

const eliminarProducto_vcga = (id_vcga) => new Promise((resolve_vcga, reject_vcga) => {
  crud_vcga.eliminarProducto_vcga(id_vcga, (err_vcga, result_vcga) => {
    if (err_vcga) return reject_vcga(err_vcga);
    resolve_vcga(result_vcga);
  });
});

const obtenerProductoPorId_vcga = (id_vcga) => new Promise((resolve_vcga, reject_vcga) => {
  crud_vcga.obtenerProductoPorId_vcga(id_vcga, (err_vcga, result_vcga) => {
    if (err_vcga) return reject_vcga(err_vcga);
    resolve_vcga(result_vcga);
  });
});

const actualizarProducto_vcga = (id_vcga, producto_vcga) => new Promise((resolve_vcga, reject_vcga) => {
  crud_vcga.actualizarProducto_vcga(id_vcga, producto_vcga, (err_vcga, result_vcga) => {
    if (err_vcga) return reject_vcga(err_vcga);
    resolve_vcga(result_vcga);
  });
});

const crearVentana_vcga = () => {
  ventana_vcga = new BrowserWindow({
    width_vcga: 1000,
    height_vcga: 700,
    webPreferences_vcga: {
      nodeIntegration_vcga: true,
      contextIsolation_vcga: false
    },
=======
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require('path');
const crud_vc_ga = require("../database/crud");

let ventana_vc_ga;

const crearVentana_vc_ga = () => {
  ventana_vc_ga = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
>>>>>>> main
  });
  ventana_vc_ga.loadFile(path.join(__dirname, '..','/','views','/' ,'index.html'));
};

<<<<<<< HEAD
  ventana_vcga.loadFile(rutaApp_vcga + 'index.html');
}

module.exports = {
  crearVentana_vcga,
  crearProducto_vcga,
  obtenerProductos_vcga,
  eliminarProducto_vcga,
  obtenerProductoPorId_vcga,
  actualizarProducto_vcga
};
=======
// Handlers IPC
ipcMain.handle("crear-producto_vc_ga", async (event_vc_ga, producto_vc_ga) => {
  return new Promise((resolve_vc_ga, reject_vc_ga) => {
    crud_vc_ga.crearProducto_vc_ga(producto_vc_ga, (err_vc_ga, result_vc_ga) => {
      if (err_vc_ga) reject_vc_ga(err_vc_ga);
      else resolve_vc_ga(result_vc_ga);
    });
  });
});

ipcMain.handle("obtener-productos_vc_ga", async () => {
  return new Promise((resolve_vc_ga, reject_vc_ga) => {
    crud_vc_ga.obtenerProductos_vc_ga((err_vc_ga, results_vc_ga) => {
      if (err_vc_ga) reject_vc_ga(err_vc_ga);
      else resolve_vc_ga(results_vc_ga);
    });
  });
});

ipcMain.handle("eliminar-producto_vc_ga", async (event_vc_ga, id_vc_ga) => {
  return new Promise((resolve_vc_ga, reject_vc_ga) => {
    crud_vc_ga.eliminarProducto_vc_ga(id_vc_ga, (err_vc_ga, result_vc_ga) => {
      if (err_vc_ga) reject_vc_ga(err_vc_ga);
      else resolve_vc_ga(result_vc_ga);
    });
  });
});

ipcMain.handle("obtener-producto-por-id_vc_ga", async (event_vc_ga, id_vc_ga) => {
  return new Promise((resolve_vc_ga, reject_vc_ga) => {
    crud_vc_ga.obtenerProductoPorId_vc_ga(id_vc_ga, (err_vc_ga, results_vc_ga) => {
      if (err_vc_ga) reject_vc_ga(err_vc_ga);
      else resolve_vc_ga(results_vc_ga && results_vc_ga[0] ? results_vc_ga[0] : null);
    });
  });
});

ipcMain.handle("actualizar-producto_vc_ga", async (event_vc_ga, id_vc_ga, producto_vc_ga) => {
  return new Promise((resolve_vc_ga, reject_vc_ga) => {
    crud_vc_ga.actualizarProducto_vc_ga(id_vc_ga, producto_vc_ga, (err_vc_ga, result_vc_ga) => {
      if (err_vc_ga) reject_vc_ga(err_vc_ga);
      else resolve_vc_ga(result_vc_ga);
    });
  });
});

module.exports = { crearVentana_vc_ga };
>>>>>>> main
