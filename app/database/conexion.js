console.log("carga la conexion_vcga");
const mysql_vcga = require('mysql');

// Crear una conexión global (similar a PHP)
const connection_vcga = mysql_vcga.createConnection({
  host: 'localhost',
  user: 'root',
  password: '3690',
  database: 'crud_electron'
});

// Conectar a la base de datos
connection_vcga.connect((err_vcga) => {
  if (err_vcga) {
    console.error('Error de conexión_vcga:', err_vcga);
    return;
  }
  console.log('Conectado a MySQL_vcga');
});

// Función para ejecutar consultas estilo PHP
const query_vcga = (sql_vcga, params_vcga = [], callback_vcga) => {
  if (!callback_vcga && typeof params_vcga === 'function') {
    callback_vcga = params_vcga;
    params_vcga = [];
  }
  
  connection_vcga.query(sql_vcga, params_vcga, (err_vcga, results_vcga) => {
    if (err_vcga) {
      console.error('Error en consulta_vcga:', err_vcga);
      return callback_vcga(err_vcga, null);
    }
    callback_vcga(null, results_vcga);
  });
}

// Exportar la función de consulta
module.exports = { query_vcga };