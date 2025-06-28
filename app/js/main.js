console.log('carga el main');
const { BrowserWindow, Notification } = require("electron");
const path = require('path');
const { crearProducto, obtenerProductos, eliminarProducto, obtenerProductoPorId, actualizarProducto } = require("../database/crud");

const rutaApp = path.join(__dirname, '..', '/');

let ventana;

const crearVentana = () => {
  ventana = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  ventana.loadFile(rutaApp + 'index.html');
}

module.exports = {
  crearVentana,
  crearProducto,
  obtenerProductos,
  eliminarProducto,
  obtenerProductoPorId,
  actualizarProducto
};