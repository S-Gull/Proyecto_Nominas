const { query_vcga } = require("./conexion");

// Funciones CRUD usando el estilo callback de PHP
const crearProducto_vcga = (producto_vcga, callback_vcga) => {
  const sql_vcga = "INSERT INTO productos SET ?";
  query_vcga(sql_vcga, producto_vcga, (err_vcga, result_vcga) => {
    if (err_vcga) return callback_vcga(err_vcga);
    callback_vcga(null, { ...producto_vcga, id: result_vcga.insertId });
  });
}

const obtenerProductos_vcga = (callback_vcga) => {
  query_vcga("SELECT * FROM productos ORDER BY id DESC", (err_vcga, results_vcga) => {
    if (err_vcga) return callback_vcga(err_vcga);
    callback_vcga(null, results_vcga);
  });
}

const eliminarProducto_vcga = (id_vcga, callback_vcga) => {
  query_vcga("DELETE FROM productos WHERE id = ?", [id_vcga], (err_vcga, result_vcga) => {
    if (err_vcga) return callback_vcga(err_vcga);
    callback_vcga(null, result_vcga);
  });
}

const obtenerProductoPorId_vcga = (id_vcga, callback_vcga) => {
  query_vcga("SELECT * FROM productos WHERE id = ?", [id_vcga], (err_vcga, results_vcga) => {
    if (err_vcga) return callback_vcga(err_vcga);
    callback_vcga(null, results_vcga[0]);
  });
}

const actualizarProducto_vcga = (id_vcga, producto_vcga, callback_vcga) => {
  const sql_vcga = "UPDATE productos SET ? WHERE id = ?";
  query_vcga(sql_vcga, [producto_vcga, id_vcga], (err_vcga, result_vcga) => {
    if (err_vcga) return callback_vcga(err_vcga);
    callback_vcga(null, result_vcga);
  });
}

module.exports = {
  crearProducto_vcga,
  obtenerProductos_vcga,
  eliminarProducto_vcga,
  obtenerProductoPorId_vcga,
  actualizarProducto_vcga
};