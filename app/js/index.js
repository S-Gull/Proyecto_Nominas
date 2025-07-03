console.log('carga el index');
const { crearVentana } = require("./main");
const { app } = require("electron");

require('../database/conexion');

if (process.env.NODE_ENV === 'development') {
  const reloader = require('electron-reload');
  reloader(__dirname, {
    electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron')
  });
}

app.whenReady().then(crearVentana);