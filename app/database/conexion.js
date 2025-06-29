console.log("carga la conexion");
const mysql = require('mysql');

// Crear una conexión global (similar a PHP)
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '3690',
  database: 'crud_electron'
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error de conexión:', err);
    return;
  }
  console.log('Conectado a MySQL');
});

// Función para ejecutar consultas estilo PHP
function query(sql, params = [], callback) {
  if (!callback && typeof params === 'function') {
    callback = params;
    params = [];
  }
  
  connection.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error en consulta:', err);
      return callback(err, null);
    }
    callback(null, results);
  });
}

// Exportar la función de consulta
module.exports = { query };