// test_mysql.js
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '3690',
  database: 'crud_electron'
});
connection.connect((err) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('¡Conexión exitosa!');
  connection.query('SELECT * FROM productos', (err, results) => {
    if (err) throw err;
    console.log(results);
    connection.end();
  });
});