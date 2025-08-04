# 🗄️ Configuración Detallada de la Base de Datos

## 📋 Guía Específica para Configurar MySQL

Esta guía te explica paso a paso cómo configurar correctamente la base de datos del sistema de nómina.

---

## 🚀 PASO 1: Verificar que MySQL esté funcionando

### 1.1 Abrir XAMPP Control Panel
1. Busca "XAMPP Control Panel" en el menú inicio de Windows
2. Haz clic derecho y selecciona "Ejecutar como administrador"
3. En la ventana de XAMPP:
   - Haz clic en **"Start"** junto a **Apache**
   - Haz clic en **"Start"** junto a **MySQL**
   - Ambos deben aparecer con fondo **verde**

### 1.2 Verificar Acceso a phpMyAdmin
1. Abre tu navegador web (Chrome, Firefox, Edge)
2. Ve a la dirección: `http://localhost/phpmyadmin`
3. Deberías ver la interfaz de phpMyAdmin
4. Si no funciona, revisa que Apache y MySQL estén iniciados

---

## 🔧 PASO 2: Ejecutar el Script Principal de la Base de Datos

### 2.1 Acceder al Script Principal
1. Ve a la carpeta: `C:\xampp\htdocs\ing\Proyecto_Nominas\app\database\`
2. Busca el archivo: `database.sql`
3. Haz clic derecho sobre el archivo
4. Selecciona "Abrir con" → "Bloc de notas" o "Notepad++"

### 2.2 Copiar el Contenido del Script
1. Una vez abierto el archivo `database.sql`
2. Presiona **Ctrl + A** para seleccionar todo
3. Presiona **Ctrl + C** para copiar

### 2.3 Ejecutar en phpMyAdmin
1. Ve a phpMyAdmin: `http://localhost/phpmyadmin`
2. Haz clic en la pestaña **"SQL"** en la parte superior
3. En el área de texto grande, presiona **Ctrl + V** para pegar
4. Haz clic en el botón **"Continuar"** o **"Go"**
5. Deberías ver mensajes de éxito en verde
6. Si hay errores en rojo, anótalos y contacta soporte

---

## ⚙️ PASO 3: Ejecutar las Funciones Especiales

### 3.1 ¿Qué son las Funciones?
Las funciones son código especial que permite:
- ✅ Insertar bonos de manera segura
- ✅ Editar bonos con validaciones
- ✅ Eliminar bonos correctamente
- ✅ Mantener la integridad de los datos
- ✅ Automatizar procesos de nómina

### 3.2 Ejecutar el Archivo de Funciones
1. Ve a la carpeta: `C:\xampp\htdocs\ing\Proyecto_Nominas\app\database\`
2. Busca el archivo: `funciones.sql`
3. Ábrelo con Bloc de notas
4. Selecciona todo el contenido (**Ctrl + A**)
5. Copia el contenido (**Ctrl + C**)

### 3.3 Aplicar las Funciones en MySQL
1. En phpMyAdmin, asegúrate de estar en la base de datos `dbcrud_electron_vc_ga`
   - Si no la ves, haz clic en "Bases de datos" en el menú izquierdo
   - Busca y haz clic en `dbcrud_electron_vc_ga`
2. Haz clic en la pestaña **"SQL"**
3. Pega el contenido del archivo `funciones.sql` (**Ctrl + V**)
4. Haz clic en **"Continuar"**
5. Deberías ver varios mensajes de éxito

---

## 📊 PASO 4: Cargar Datos de Prueba (Opcional pero Recomendado)

### 4.1 ¿Para qué sirven los Datos de Prueba?
- 🧪 Permiten probar el sistema inmediatamente
- 👥 Crean usuarios de ejemplo
- 💰 Incluyen datos de nómina de muestra
- 🏢 Configuran departamentos y roles básicos

### 4.2 Ejecutar Datos de Prueba
1. Ve a: `C:\xampp\htdocs\ing\Proyecto_Nominas\app\database\`
2. Abre el archivo: `datosPrueba.sql`
3. Copia todo el contenido
4. En phpMyAdmin, ve a la pestaña **"SQL"**
5. Pega el contenido
6. Haz clic en **"Continuar"**

---

## 🔍 PASO 5: Verificar que Todo Esté Correcto

### 5.1 Verificar Tablas Creadas
1. En phpMyAdmin, haz clic en `dbcrud_electron_vc_ga` en el menú izquierdo
2. Deberías ver una lista de tablas que incluya:
   - ✅ `td_usuarios_vc_ga`
   - ✅ `td_departamento_vc_ga`
   - ✅ `td_roles_vc_ga`
   - ✅ `td_bono_vc_ga`
   - ✅ `td_deduccion_vc_ga`
   - ✅ Y muchas más...

### 5.2 Verificar Funciones Creadas
1. En phpMyAdmin, haz clic en `dbcrud_electron_vc_ga`
2. Busca la pestaña **"Rutinas"** o **"Procedures"**
3. Deberías ver funciones como:
   - ✅ `fn_insertar_bono_vc_ga`
   - ✅ `fn_editar_bono_vc_ga`
   - ✅ `fn_eliminar_bono_vc_ga`

### 5.3 Verificar Datos de Prueba (si los cargaste)
1. Haz clic en la tabla `td_usuarios_vc_ga`
2. Haz clic en la pestaña **"Examinar"** o **"Browse"**
3. Deberías ver usuarios de ejemplo

---

## 🛠️ PASO 6: Crear Usuario de Base de Datos para la Aplicación

### 6.1 ¿Por qué crear un usuario específico?
- 🔒 Mayor seguridad
- 🎯 Permisos específicos
- 📊 Mejor control de acceso

### 6.2 Crear el Usuario
1. En phpMyAdmin, haz clic en **"Cuentas de usuario"** en la parte superior
2. Haz clic en **"Agregar cuenta de usuario"**
3. Llena los siguientes datos:
   - **Nombre de usuario:** `nomina_user`
   - **Nombre de host:** `localhost`
   - **Contraseña:** `nomina123` (o la que prefieras)
   - **Volver a escribir:** `nomina123`

### 6.3 Asignar Permisos
1. En la sección **"Privilegios globales"**
2. Haz clic en **"Seleccionar todo"**
3. Haz clic en **"Continuar"**
4. El usuario debería aparecer en la lista

---

## 🔧 PASO 7: Configurar el Archivo de Conexión

### 7.1 Crear Archivo .env
1. Ve a la carpeta raíz del proyecto: `C:\xampp\htdocs\ing\Proyecto_Nominas\`
2. Haz clic derecho en un espacio vacío
3. Selecciona **"Nuevo"** → **"Documento de texto"**
4. Nombra el archivo exactamente: `.env` (sin extensión .txt)

### 7.2 Configurar las Credenciales
1. Abre el archivo `.env` con Bloc de notas
2. Escribe exactamente lo siguiente:
   ```
   DB_HOST=localhost
   DB_USER=nomina_user
   DB_PASS=nomina123
   DB_MULTI_STATE=true
   ```
3. Guarda el archivo (**Ctrl + S**)

---

## ✅ PASO 8: Verificación Final

### 8.1 Lista de Verificación
Antes de ejecutar la aplicación, verifica que:
- ✅ XAMPP esté ejecutando Apache y MySQL
- ✅ phpMyAdmin funcione correctamente
- ✅ La base de datos `dbcrud_electron_vc_ga` exista
- ✅ Las tablas estén creadas
- ✅ Las funciones estén instaladas
- ✅ El usuario `nomina_user` exista
- ✅ El archivo `.env` esté configurado

### 8.2 Probar la Conexión
1. Abre una terminal en la carpeta del proyecto
2. Ejecuta: `npm start`
3. Si la aplicación se abre sin errores, ¡todo está correcto!
4. Si hay errores de conexión, revisa los pasos anteriores

---

## 🆘 SOLUCIÓN DE PROBLEMAS ESPECÍFICOS

### ❌ Error: "Access denied for user"
**Causa:** Credenciales incorrectas en el archivo `.env`
**Solución:**
1. Verifica que el usuario `nomina_user` exista en phpMyAdmin
2. Verifica que la contraseña en `.env` coincida
3. Asegúrate de que el usuario tenga permisos

### ❌ Error: "Database does not exist"
**Causa:** La base de datos no se creó correctamente
**Solución:**
1. Repite el PASO 2 (ejecutar database.sql)
2. Verifica que no haya errores en phpMyAdmin
3. Asegúrate de que la base de datos aparezca en la lista

### ❌ Error: "Function does not exist"
**Causa:** Las funciones no se ejecutaron correctamente
**Solución:**
1. Repite el PASO 3 (ejecutar funciones.sql)
2. Verifica en la pestaña "Rutinas" que las funciones existan
3. Si hay errores de sintaxis, contacta soporte

### ❌ Error: "Table doesn't exist"
**Causa:** Las tablas no se crearon
**Solución:**
1. Verifica que MySQL esté ejecutándose
2. Repite la ejecución de database.sql
3. Revisa que no haya errores en la consola de phpMyAdmin

---

## 📝 NOTAS IMPORTANTES

- ⚠️ **Siempre haz respaldos** antes de ejecutar scripts
- ⚠️ **No modifiques** los archivos .sql a menos que sepas lo que haces
- ⚠️ **Guarda las credenciales** en un lugar seguro
- ⚠️ **No compartas** el archivo .env con otros

---

*Esta guía cubre todos los aspectos técnicos de la configuración de la base de datos para el Sistema de Nómina Baldox.*