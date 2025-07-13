<<<<<<< HEAD
const { query_vcga } = require("./conexion");

// Funciones CRUD usando el estilo callback de PHP
const crearProducto_vcga = (producto_vcga, callback_vcga) => {
  const sql_vcga = "INSERT INTO productos SET ?";
  query_vcga(sql_vcga, producto_vcga, (err_vcga, result_vcga) => {
    if (err_vcga) return callback_vcga(err_vcga);
    callback_vcga(null, { ...producto_vcga, id: result_vcga.insertId });
=======
const { query_vc_ga } = require("./conexion");

// Funciones CRUD usando el estilo callback de PHP
const crearProducto_vc_ga = (producto_vc_ga, callback_vc_ga) => {
  const sql_vc_ga = "INSERT INTO productos_vc_ga SET ?";
  query_vc_ga(sql_vc_ga, producto_vc_ga, (err_vc_ga, result_vc_ga) => {
    if (err_vc_ga) return callback_vc_ga(err_vc_ga);
    callback_vc_ga(null, { ...producto_vc_ga, id_vc_ga: result_vc_ga.insertId });
>>>>>>> main
  });
};

<<<<<<< HEAD
const obtenerProductos_vcga = (callback_vcga) => {
  query_vcga("SELECT * FROM productos ORDER BY id DESC", (err_vcga, results_vcga) => {
    if (err_vcga) return callback_vcga(err_vcga);
    callback_vcga(null, results_vcga);
=======
const obtenerProductos_vc_ga = (callback_vc_ga) => {
  query_vc_ga("SELECT * FROM productos_vc_ga ORDER BY id_vc_ga DESC", (err_vc_ga, results_vc_ga) => {
    if (err_vc_ga) return callback_vc_ga(err_vc_ga);
    callback_vc_ga(null, results_vc_ga);
>>>>>>> main
  });
};

<<<<<<< HEAD
const eliminarProducto_vcga = (id_vcga, callback_vcga) => {
  query_vcga("DELETE FROM productos WHERE id = ?", [id_vcga], (err_vcga, result_vcga) => {
    if (err_vcga) return callback_vcga(err_vcga);
    callback_vcga(null, result_vcga);
=======
const eliminarProducto_vc_ga = (id_vc_ga, callback_vc_ga) => {
  query_vc_ga("DELETE FROM productos_vc_ga WHERE id_vc_ga = ?", [id_vc_ga], (err_vc_ga, result_vc_ga) => {
    if (err_vc_ga) return callback_vc_ga(err_vc_ga);
    callback_vc_ga(null, result_vc_ga);
>>>>>>> main
  });
};

<<<<<<< HEAD
const obtenerProductoPorId_vcga = (id_vcga, callback_vcga) => {
  query_vcga("SELECT * FROM productos WHERE id = ?", [id_vcga], (err_vcga, results_vcga) => {
    if (err_vcga) return callback_vcga(err_vcga);
    callback_vcga(null, results_vcga[0]);
=======
const obtenerProductoPorId_vc_ga = (id_vc_ga, callback_vc_ga) => {
  query_vc_ga("SELECT * FROM productos_vc_ga WHERE id_vc_ga = ?", [id_vc_ga], (err_vc_ga, results_vc_ga) => {
    callback_vc_ga(err_vc_ga, results_vc_ga);
>>>>>>> main
  });
};

<<<<<<< HEAD
const actualizarProducto_vcga = (id_vcga, producto_vcga, callback_vcga) => {
  const sql_vcga = "UPDATE productos SET ? WHERE id = ?";
  query_vcga(sql_vcga, [producto_vcga, id_vcga], (err_vcga, result_vcga) => {
    if (err_vcga) return callback_vcga(err_vcga);
    callback_vcga(null, result_vcga);
=======
const actualizarProducto_vc_ga = (id_vc_ga, producto_vc_ga, callback_vc_ga) => {
  const sql_vc_ga = "UPDATE productos_vc_ga SET ? WHERE id_vc_ga = ?";
  query_vc_ga(sql_vc_ga, [producto_vc_ga, id_vc_ga], (err_vc_ga, result_vc_ga) => {
    if (err_vc_ga) return callback_vc_ga(err_vc_ga);
    callback_vc_ga(null, result_vc_ga);
>>>>>>> main
  });
};

module.exports = {
<<<<<<< HEAD
  crearProducto_vcga,
  obtenerProductos_vcga,
  eliminarProducto_vcga,
  obtenerProductoPorId_vcga,
  actualizarProducto_vcga
=======
  crearProducto_vc_ga,
  obtenerProductos_vc_ga,
  eliminarProducto_vc_ga,
  obtenerProductoPorId_vc_ga,
  actualizarProducto_vc_ga
>>>>>>> main
};