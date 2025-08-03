# 📝 Sistema de Gestión de Nómina - Baldox

![Baldox Logo](./app/img/BALDOX_LOGO.jpg)

## 📌 Descripción

Sistema completo de gestión de nómina desarrollado con Electron.js, MySQL y Tailwind CSS. Permite administrar empleados, departamentos, roles, pagos y reportes de nómina de manera eficiente y moderna.

---

## Tabla de Contenidos

- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos del Sistema](#requisitos-del-sistema)
- [Instalación](#instalación)
- [Estructura de la Base de Datos](#estructura-de-la-base-de-datos)
- [Sistema de Autenticación](#sistema-de-autenticación)
- [Características de la Interfaz](#características-de-la-interfaz)
- [Funcionalidades Clave](#funcionalidades-clave)
- [Solución de Problemas Comunes](#solución-de-problemas-comunes)
- [Licencia](#licencia)

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**:  
  - Electron.js  
  - Tailwind CSS  
  - Font Awesome  
  - Animate.css

- **Backend**:  
  - Node.js  
  - MySQL

- **Otros**:  
  - IPC (Comunicación entre procesos)
  - bcryptjs (hash de contraseñas)
  - electron-reload (recarga automática en desarrollo)
  - fs-extra, path, y utilidades de Node.js

---

---

## 🗃️ Estructura del Proyecto

```
.
├── .gitignore
├── package.json
├── README.md
└── app/
    ├── css/
    │   ├── login-register.css
    │   ├── modal.css
    │   └── style.css
    ├── database/
    │   ├── conexion.js
    │   ├── crud.js
    │   ├── database.sql
    │   ├── datosPrueba.sql
    ├── img/
    │   ├── BALDOX_LOGO.jpg
    │   ├── crud.png
    │   ├── CrudElectron.png
    │   ├── Guillermo.png
    │   └── Victor.png
    ├── js/
    │   ├── app.js
    │   ├── dark-mode.js
    │   ├── empleado.js
    │   ├── index.js
    │   ├── login.js
    │   ├── main.js
    │   ├── modal.js
    │   ├── plantilla.js
    │   ├── reportes.js
    │   └── seleccionado.js
    ├── tailwind/
    │   └── tailwind.config.js
    └── views/
        ├── empleado.html
        ├── index.html
        ├── plantilla.html
        ├── reportes.html
        └── seleccionado.html
```

---

## 🔌 Requisitos del Sistema

- Node.js v16+
- MySQL 8+
- XAMPP (opcional para entorno local)
- Linux (desarrollado y probado en Zorin OS)

---

---

## 🚀 Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone [url-del-repositorio]
   cd INGENIERIA\ DEL\ SOFTWARE/project/main
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar base de datos:**
   - Importar el archivo `app/database/database.sql` a MySQL
   - (Opcional) Importar `datosPrueba.sql` para datos de ejemplo
   - Configurar credenciales en `app/database/conexion.js`

4. **Iniciar la aplicación:**
   ```bash
   npm start
   ```

---

## 🗄️ Estructura de la Base de Datos

El sistema utiliza varias tablas relacionadas, incluyendo:

- `td_usuarios_vc_ga` (Empleados)
- `td_departamento_vc_ga` (Departamentos)
- `td_roles_vc_ga` (Roles de usuario)
- `td_cargos_vc_ga` (Cargos)
- `td_pago_nomina_vc_ga` (Pagos)
- `td_salario_historico_vc_ga` (Historial salarial)
- `td_bono_vc_ga` (Bonos)
- `td_horas_extras_vc_ga` (Horas extras)
- `td_recibo_nomina_vc_ga` (Recibos)
- `td_reporte_banco_vc_ga` (Reportes bancarios)
- `td_reporte_contable_vc_ga` (Reportes contables)
- ...y otras para deducciones, vacaciones, prestaciones, etc.

---

---

## 🔒 Sistema de Autenticación

- Login con email y contraseña
- Roles de usuario (Administrador/Usuario)
- Protección de rutas
- Manejo de sesiones

---

## 🎨 Características de la Interfaz

- **Modo oscuro/claro** con persistencia
- **Animaciones** con Animate.css
- **Responsive design** con Tailwind
- **Componentes reutilizables** (modales, formularios)
- **Validación de formularios**

---

## 🛠️ Funcionalidades Clave

1. **Gestión de Usuarios:**
   - CRUD completo de empleados
   - Asignación de departamentos/roles
   - Historial salarial

2. **Nómina:**
   - Registro de pagos
   - Cálculo automático
   - Generación de recibos

3. **Reportes:**
   - Bancarios
   - Contables
   - Históricos

---

## 🐛 Solución de Problemas Comunes

### Error al eliminar usuarios
```bash
Error: ER_ROW_IS_REFERENCED_2: Cannot delete or update a parent row
```
**Solución:** Asegurar que todas las tablas tienen `ON DELETE CASCADE` en sus FK.

### Error de fechas
```bash
The specified value does not conform to the required format "yyyy-MM-dd"
```
**Solución:** Usar el método `_formatearFecha_vc_ga` al guardar.

### Error de referencias
```bash
Error: Uno o más IDs referenciados no existen en la base de datos
```
**Solución:** Validar los selects con `validarReferencias_vc_ga`.

---

## 📜 Licencia

MIT License - Free for commercial and personal
