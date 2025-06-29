console.log('carga el main');
const { BrowserWindow } = require("electron");
const path = require('path');
const crud = require("../database/crud");

const rutaApp = path.join(__dirname, '..', '/');

let ventana;

// Adaptamos las funciones para que devuelvan promesas
const crearProducto = (producto) => {
  return new Promise((resolve, reject) => {
    crud.crearProducto(producto, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Repetimos el mismo patrón para las demás funciones
const obtenerProductos = () => new Promise((resolve, reject) => {
  crud.obtenerProductos((err, results) => {
    if (err) return reject(err);
    resolve(results);
  });
});

const eliminarProducto = (id) => new Promise((resolve, reject) => {
  crud.eliminarProducto(id, (err, result) => {
    if (err) return reject(err);
    resolve(result);
  });
});

const obtenerProductoPorId = (id) => new Promise((resolve, reject) => {
  crud.obtenerProductoPorId(id, (err, result) => {
    if (err) return reject(err);
    resolve(result);
  });
});

const actualizarProducto = (id, producto) => new Promise((resolve, reject) => {
  crud.actualizarProducto(id, producto, (err, result) => {
    if (err) return reject(err);
    resolve(result);
  });
});

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