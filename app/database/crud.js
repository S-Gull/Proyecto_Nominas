const { obtenerConexion } = require("./database");

const crearProducto = async (producto) => {
  const conexion = await obtenerConexion();
  producto.precio = parseFloat(producto.precio);
  const resultado = await conexion.query("INSERT INTO productos SET ?", producto);
  producto.id = resultado.insertId;
  return producto;
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
  return resultado;
};

module.exports = {
  crearProducto,
  obtenerProductos,
  eliminarProducto,
  obtenerProductoPorId,
  actualizarProducto
};