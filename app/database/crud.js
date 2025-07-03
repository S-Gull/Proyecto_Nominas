const { query } = require("./conexion");

// Funciones CRUD usando el estilo callback de PHP
function crearProducto(producto, callback) {
  const sql = "INSERT INTO productos SET ?";
  query(sql, producto, (err, result) => {
    if (err) return callback(err);
    callback(null, { ...producto, id: result.insertId });
  });
}

function obtenerProductos(callback) {
  query("SELECT * FROM productos ORDER BY id DESC", (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
}

function eliminarProducto(id, callback) {
  query("DELETE FROM productos WHERE id = ?", [id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
}

function obtenerProductoPorId(id, callback) {
  query("SELECT * FROM productos WHERE id = ?", [id], (err, results) => {
    callback(err, results);
  });
}

function actualizarProducto(id, producto, callback) {
  const sql = "UPDATE productos SET ? WHERE id = ?";
  query(sql, [producto, id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
}


module.exports = {
  crearProducto,
  obtenerProductos,
  eliminarProducto,
  obtenerProductoPorId,
  actualizarProducto
};