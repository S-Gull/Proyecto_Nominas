const { query_vc_ga } = require("./conexion");

// Funciones CRUD usando el estilo callback de PHP
const crearProducto_vc_ga = (producto_vc_ga, callback_vc_ga) => {
  const sql_vc_ga = "INSERT INTO productos_vc_ga SET ?";
  query_vc_ga(sql_vc_ga, producto_vc_ga, (err_vc_ga, result_vc_ga) => {
    if (err_vc_ga) return callback_vc_ga(err_vc_ga);
    callback_vc_ga(null, { ...producto_vc_ga, id_vc_ga: result_vc_ga.insertId });
  });
};

const obtenerProductos_vc_ga = (callback_vc_ga) => {
  query_vc_ga("SELECT * FROM productos_vc_ga ORDER BY id_vc_ga DESC", (err_vc_ga, results_vc_ga) => {
    if (err_vc_ga) return callback_vc_ga(err_vc_ga);
    callback_vc_ga(null, results_vc_ga);
  });
};

const eliminarProducto_vc_ga = (id_vc_ga, callback_vc_ga) => {
  query_vc_ga("DELETE FROM productos_vc_ga WHERE id_vc_ga = ?", [id_vc_ga], (err_vc_ga, result_vc_ga) => {
    if (err_vc_ga) return callback_vc_ga(err_vc_ga);
    callback_vc_ga(null, result_vc_ga);
  });
};

const obtenerProductoPorId_vc_ga = (id_vc_ga, callback_vc_ga) => {
  query_vc_ga("SELECT * FROM productos_vc_ga WHERE id_vc_ga = ?", [id_vc_ga], (err_vc_ga, results_vc_ga) => {
    callback_vc_ga(err_vc_ga, results_vc_ga);
  });
};

const actualizarProducto_vc_ga = (id_vc_ga, producto_vc_ga, callback_vc_ga) => {
  const sql_vc_ga = "UPDATE productos_vc_ga SET ? WHERE id_vc_ga = ?";
  query_vc_ga(sql_vc_ga, [producto_vc_ga, id_vc_ga], (err_vc_ga, result_vc_ga) => {
    if (err_vc_ga) return callback_vc_ga(err_vc_ga);
    callback_vc_ga(null, result_vc_ga);
  });
};

module.exports = {
  crearProducto_vc_ga,
  obtenerProductos_vc_ga,
  eliminarProducto_vc_ga,
  obtenerProductoPorId_vc_ga,
  actualizarProducto_vc_ga
};