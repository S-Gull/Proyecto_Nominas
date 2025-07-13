const { app, BrowserWindow, ipcMain } = require("electron");
const path = require('path');
const crud_vc_ga = require("../database/crud");

let ventana_vc_ga;

<<<<<<< HEAD
function crearVentana() {
    ventana = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: false, // IMPORTANTE: deshabilitar
      contextIsolation: true // HABILITAR seguridad
      
     // Archivo de precarga
    
=======
const crearVentana_vc_ga = () => {
  ventana_vc_ga = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
>>>>>>> main
    }
  });
  ventana_vc_ga.loadFile(path.join(__dirname, '..','/','views','/' ,'index.html'));
};

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