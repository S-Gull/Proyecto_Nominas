console.log("carga la conexion");
const mysql = require('mysql');

// Configuración de conexión inicial (sin base de datos especificada)
const config = {
  host: 'localhost',
  user: 'root',
  password: '3690'
};

// Crear una conexión global
const connection = mysql.createConnection(config);

// Conectar a MySQL y crear la base de datos/tabla si no existen
connection.connect(async (err) => {
  if (err) {
    console.error('Error de conexión inicial:', err);
    return;
  }

  try {
    // Crear la base de datos si no existe
    await new Promise((resolve, reject) => {
      connection.query('CREATE DATABASE IF NOT EXISTS crud_electron', (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // Seleccionar la base de datos
    await new Promise((resolve, reject) => {
      connection.query('USE crud_electron', (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // Crear la tabla si no existe
    await new Promise((resolve, reject) => {
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS productos(
          id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          nombre VARCHAR(100) NOT NULL,
          descripcion VARCHAR(255),
          precio DECIMAL(10,2) NOT NULL
        )
      `;
      connection.query(createTableQuery, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    console.log('Base de datos y tabla verificadas/creadas');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  } finally {
    // Cerrar la conexión inicial
    connection.end();
  }
});

// Función para ejecutar consultas (con reconexión automática)
function query(sql, params = [], callback) {
  // Crear una nueva conexión para cada consulta
  const db = mysql.createConnection({
    ...config,
    database: 'crud_electron'
  });
  
  db.connect((err) => {
    if (err) {
      console.error('Error de conexión:', err);
      return callback(err);
    }
    
    // Ejecutar la consulta
    db.query(sql, params, (err, results) => {
      // Cerrar la conexión después de la consulta
      db.end();
      
      if (err) {
        console.error('Error en consulta:', err);
        return callback(err);
      }
      callback(null, results);
    });
  });
}

// Exportar la función de consulta
module.exports = { query };