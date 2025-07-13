console.log('carga el index');
<<<<<<< HEAD
const { crearVentana_vcga } = require("./main");
=======
const { crearVentana_vc_ga } = require("../js/main");
>>>>>>> main
const { app } = require("electron");

require('../database/conexion');

if (process.env.NODE_ENV === 'development') {
  const reloader = require('electron-reload');
  reloader(__dirname, {
    electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron')
  });
}

<<<<<<< HEAD
app.allowRendererProcessReuse = true;
app.whenReady().then(crearVentana_vcga);
=======
app.whenReady().then(crearVentana_vc_ga);
>>>>>>> main
