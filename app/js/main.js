const { app, BrowserWindow, ipcMain } = require("electron");
const path = require('path');
const crud = require("../database/crud");

let ventana;

function crearVentana() {
  ventana = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false // Para compatibilidad rápida, aunque se recomienda true + preload.js
    }
  });
  ventana.loadFile(path.join(__dirname, '..', 'index.html'));
}

// Handlers IPC
ipcMain.handle("crear-producto", async (event, producto) => {
  return new Promise((resolve, reject) => {
    crud.crearProducto(producto, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
});

ipcMain.handle("obtener-productos", async () => {
  return new Promise((resolve, reject) => {
    crud.obtenerProductos((err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
});

ipcMain.handle("eliminar-producto", async (event, id) => {
  return new Promise((resolve, reject) => {
    crud.eliminarProducto(id, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
});

ipcMain.handle("obtener-producto-por-id", async (event, id) => {
  return new Promise((resolve, reject) => {
    crud.obtenerProductoPorId(id, (err, results) => {
      if (err) reject(err);
      else resolve(results[0]);
    });
  });
});

ipcMain.handle("actualizar-producto", async (event, id, producto) => {
  return new Promise((resolve, reject) => {
    crud.actualizarProducto(id, producto, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
});

module.exports = { crearVentana };