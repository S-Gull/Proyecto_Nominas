console.log('carga el main');
const { BrowserWindow, Notification } = require("electron");
const { obtenerConexion } = require("../database/database");
const path = require('path');
const rutaApp = path.join(__dirname,'..','/' );//! Esta variable es la que se encarga de almacenar la ruta de la carpeta App

let ventana;

const crearProducto = async (producto) => {
  try {
    const conexion = await obtenerConexion();
    producto.precio = parseFloat(producto.precio);
    const resultado = await conexion.query("INSERT INTO productos SET ?", producto);
    producto.id = resultado.insertId;

    // Notificar al usuario
    new Notification({
      title: "Electron MySQL",
      body: "Producto guardado exitosamente",
    }).show();

    return producto;
  } catch (error) {
    console.log(error);
  }
};

const obtenerProductos = async () => {
  const conexion = await obtenerConexion();
  const resultados = await conexion.query("SELECT * FROM productos ORDER BY id DESC");
  return resultados;
};

const eliminarProducto = async (id) => {
  const conexion = await obtenerConexion();
  const resultado = await conexion.query("DELETE FROM productos WHERE id = ?", id);
  return resultado;
};

const obtenerProductoPorId = async (id) => {
  const conexion = await obtenerConexion();
  const resultado = await conexion.query("SELECT * FROM productos WHERE id = ?", id);
  return resultado[0];
};

const actualizarProducto = async (id, producto) => {
  const conexion = await obtenerConexion();
  const resultado = await conexion.query("UPDATE productos SET ? WHERE id = ?", [
    producto,
    id,
  ]);
  console.log(resultado);
};

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