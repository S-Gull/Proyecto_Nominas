console.log("carga la conexion");
const mysql = require('promise-mysql');

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '3690',
  database: 'crud_electron'
});

function obtenerConexion() {
  return conexion;
}

module.exports = { obtenerConexion };