# 🚀 Guía de Instalación Completa - Sistema de Nómina Baldox

## 📋 Para Personas Sin Conocimientos Técnicos

Esta guía te ayudará a instalar y ejecutar el sistema de nómina paso a paso, sin necesidad de conocimientos previos de programación.

---

## 🔧 PASO 1: Instalar los Programas Necesarios

### 1.1 Descargar e Instalar XAMPP
1. Ve a: https://www.apachefriends.org/download.html
2. Descarga XAMPP para Windows
3. Ejecuta el instalador como administrador
4. Instala en la ruta por defecto: `C:\xampp`
5. Durante la instalación, asegúrate de seleccionar:
   - ✅ Apache
   - ✅ MySQL
   - ✅ PHP
   - ✅ phpMyAdmin

### 1.2 Descargar e Instalar Node.js
1. Ve a: https://nodejs.org
2. Descarga la versión LTS (recomendada)
3. Ejecuta el instalador
4. Acepta todas las opciones por defecto
5. Reinicia tu computadora

### 1.3 Descargar e Instalar Git (Opcional)
1. Ve a: https://git-scm.com/download/win
2. Descarga e instala Git
3. Acepta todas las opciones por defecto

---

## 🗄️ PASO 2: Configurar la Base de Datos

### 2.1 Iniciar XAMPP
1. Busca "XAMPP Control Panel" en el menú inicio
2. Ejecuta como administrador
3. Haz clic en "Start" junto a:
   - **Apache** (debe aparecer en verde)
   - **MySQL** (debe aparecer en verde)

### 2.2 Acceder a phpMyAdmin
1. Abre tu navegador web
2. Ve a: `http://localhost/phpmyadmin`
3. Deberías ver la interfaz de phpMyAdmin

### 2.3 Crear Usuario de Base de Datos
1. En phpMyAdmin, haz clic en "Cuentas de usuario"
2. Haz clic en "Agregar cuenta de usuario"
3. Llena los datos:
   - **Nombre de usuario:** `nomina_user`
   - **Nombre de host:** `localhost`
   - **Contraseña:** `nomina123` (o la que prefieras)
   - **Volver a escribir:** `nomina123`
4. En "Privilegios globales" marca "Seleccionar todo"
5. Haz clic en "Continuar"

---

## 📁 PASO 3: Obtener y Configurar el Proyecto

### 3.1 Descargar el Proyecto
**Opción A: Con Git (si lo instalaste)**
1. Abre "Símbolo del sistema" o "PowerShell"
2. Navega a la carpeta de XAMPP:
   ```
   cd C:\xampp\htdocs\ing
   ```
3. Clona el proyecto:
   ```
   git clone [URL_DEL_REPOSITORIO] Proyecto_Nominas
   ```

**Opción B: Descarga Manual**
1. Descarga el proyecto como ZIP
2. Extrae el contenido en: `C:\xampp\htdocs\ing\Proyecto_Nominas`

### 3.2 Crear Archivo de Configuración
1. Ve a la carpeta del proyecto: `C:\xampp\htdocs\ing\Proyecto_Nominas`
2. Crea un archivo llamado `.env` (sin extensión)
3. Abre el archivo con Bloc de notas
4. Escribe lo siguiente:
   ```
   DB_HOST=localhost
   DB_USER=nomina_user
   DB_PASS=nomina123
   DB_MULTI_STATE=true
   ```
5. Guarda el archivo

---

## 🔨 PASO 4: Instalar Dependencias del Proyecto

### 4.1 Abrir Terminal en la Carpeta del Proyecto
1. Ve a: `C:\xampp\htdocs\ing\Proyecto_Nominas`
2. Mantén presionada la tecla **Shift** y haz clic derecho en un espacio vacío
3. Selecciona "Abrir ventana de PowerShell aquí" o "Abrir símbolo del sistema aquí"

### 4.2 Instalar Dependencias
1. En la terminal, escribe:
   ```
   npm install
   ```
2. Espera a que termine (puede tomar varios minutos)
3. Deberías ver un mensaje de éxito al final

---

## 🗃️ PASO 5: Configurar la Base de Datos Manualmente

### 5.1 Ejecutar Script Principal
1. Ve a phpMyAdmin: `http://localhost/phpmyadmin`
2. Haz clic en "SQL" en la parte superior
3. Abre el archivo: `C:\xampp\htdocs\ing\Proyecto_Nominas\app\database\database.sql`
4. Copia todo el contenido del archivo
5. Pégalo en el área de texto de phpMyAdmin
6. Haz clic en "Continuar"
7. Deberías ver un mensaje de éxito

### 5.2 Ejecutar Funciones de la Base de Datos
1. En phpMyAdmin, asegúrate de estar en la base de datos `dbcrud_electron_vc_ga`
2. Haz clic en "SQL" nuevamente
3. Abre el archivo: `C:\xampp\htdocs\ing\Proyecto_Nominas\app\database\funciones.sql`
4. Copia todo el contenido
5. Pégalo en phpMyAdmin
6. Haz clic en "Continuar"

### 5.3 Cargar Datos de Prueba (Opcional)
1. Repite el proceso anterior con el archivo:
   `C:\xampp\htdocs\ing\Proyecto_Nominas\app\database\datosPrueba.sql`
2. Esto creará usuarios y datos de ejemplo para probar el sistema

---

## 🚀 PASO 6: Ejecutar la Aplicación

### 6.1 Iniciar el Sistema
1. Asegúrate de que XAMPP esté ejecutando Apache y MySQL
2. Ve a la carpeta del proyecto en la terminal (como en el paso 4.1)
3. Escribe:
   ```
   npm start
   ```
4. Espera unos segundos
5. La aplicación debería abrirse automáticamente

### 6.2 Iniciar Sesión
**Credenciales por defecto:**
- **Usuario:** admin@baldox.com
- **Contraseña:** admin123

---

## 🔧 PASO 7: Uso Diario del Sistema

### 7.1 Para Iniciar el Sistema Cada Día
1. **Abrir XAMPP Control Panel**
2. **Iniciar Apache y MySQL** (botón Start)
3. **Abrir terminal** en la carpeta del proyecto
4. **Ejecutar:** `npm start`
5. **Iniciar sesión** en la aplicación

### 7.2 Para Cerrar el Sistema
1. **Cerrar la aplicación** de nómina
2. **En XAMPP:** hacer clic en "Stop" en Apache y MySQL
3. **Cerrar XAMPP Control Panel**

---

## 🆘 SOLUCIÓN DE PROBLEMAS COMUNES

### ❌ Error: "Puerto 80 en uso"
**Solución:**
1. Cierra Skype o cualquier programa que use internet
2. Reinicia XAMPP
3. Si persiste, cambia el puerto de Apache en XAMPP

### ❌ Error: "MySQL no inicia"
**Solución:**
1. Ve a Servicios de Windows
2. Detén cualquier servicio de MySQL existente
3. Reinicia XAMPP como administrador

### ❌ Error: "No se puede conectar a la base de datos"
**Solución:**
1. Verifica que MySQL esté ejecutándose en XAMPP
2. Revisa el archivo `.env` que creaste
3. Asegúrate de que las credenciales sean correctas

### ❌ Error: "npm no se reconoce"
**Solución:**
1. Reinstala Node.js
2. Reinicia tu computadora
3. Abre una nueva terminal

---

## 📞 CONTACTO Y SOPORTE

Si tienes problemas:
1. Revisa esta guía paso a paso
2. Verifica que todos los programas estén instalados correctamente
3. Asegúrate de seguir el orden exacto de los pasos
4. Contacta al equipo de desarrollo con capturas de pantalla del error

---

## 📝 NOTAS IMPORTANTES

- ⚠️ **Siempre ejecuta XAMPP como administrador**
- ⚠️ **No cierres la terminal mientras uses la aplicación**
- ⚠️ **Haz respaldos regulares de tu base de datos**
- ⚠️ **Mantén actualizadas las contraseñas de acceso**

---

*Esta guía fue creada para facilitar el uso del Sistema de Nómina Baldox por parte de usuarios sin conocimientos técnicos.*