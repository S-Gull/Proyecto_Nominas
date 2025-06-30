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
  });

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