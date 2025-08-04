# 📊 Guía de Datos de Prueba - Sistema de Nómina Baldox

## 🎯 Propósito de los Datos de Prueba

El archivo `datosPrueba.sql` contiene un conjunto completo de datos ficticios que permiten:
- **Probar todas las funcionalidades** del sistema sin afectar datos reales
- **Demostrar el funcionamiento** completo del sistema de nómina
- **Capacitar usuarios** con ejemplos realistas
- **Verificar cálculos** y reportes del sistema

---

## 🏢 Estructura Organizacional

### 📍 **Sucursales (3 ubicaciones)**
- **Sucursal Central** - Av. Principal 123, Caracas
- **Sucursal Este** - Calle Este 456, Valencia  
- **Sucursal Oeste** - Boulevard Oeste 789, Maracay

### 🏬 **Departamentos (5 áreas)**
- **Recursos Humanos** (Sucursal Central)
- **Contabilidad** (Sucursal Central)
- **Ventas** (Sucursal Este)
- **Producción** (Sucursal Oeste)
- **Tecnología** (Sucursal Central)

### 👥 **Roles del Sistema**
- **Administrador**: Acceso total al sistema
- **Usuario**: Acceso limitado a funciones básicas

### 💼 **Cargos Disponibles**
- **Director RH**: Director de Recursos Humanos
- **Contador**: Contador general
- **Vendedor**: Ejecutivo de ventas
- **Operador**: Operador de producción
- **Desarrollador**: Desarrollador de software

---

## 👨‍💼 Empleados de Prueba

### **María González** 👩‍💼
- **Cédula**: 12.345.678
- **Cargo**: Director RH
- **Departamento**: Recursos Humanos
- **Salario**: $5,500.00
- **Email**: maria.gonzalez@empresa.com
- **Estado**: Trabajando
- **Ingreso**: 10 de marzo de 2015

### **Carlos Pérez** 👨‍💼
- **Cédula**: 23.456.789
- **Cargo**: Contador
- **Departamento**: Contabilidad
- **Salario**: $4,500.00
- **Email**: carlos.perez@empresa.com
- **Estado**: Trabajando
- **Ingreso**: 15 de junio de 2018

### **Ana Rodríguez** 👩‍💼
- **Cédula**: 34.567.890
- **Cargo**: Vendedor
- **Departamento**: Ventas
- **Salario**: $3,000.00
- **Email**: ana.rodriguez@empresa.com
- **Estado**: De Vacaciones
- **Ingreso**: 5 de enero de 2020

### **Luis Martínez** 👨‍💼
- **Cédula**: 45.678.901
- **Cargo**: Operador
- **Departamento**: Producción
- **Salario**: $3,500.00
- **Email**: luis.martinez@empresa.com
- **Estado**: Trabajando
- **Ingreso**: 12 de septiembre de 2019

### **Pedro Sánchez** 👨‍💼
- **Cédula**: 56.789.012
- **Cargo**: Desarrollador
- **Departamento**: Tecnología
- **Salario**: $4,200.00
- **Email**: pedro.sanchez@empresa.com
- **Estado**: Trabajando
- **Ingreso**: 20 de febrero de 2021

---

## 💰 Sistema de Bonos

### **Bonos Otorgados (Fecha: 30 de diciembre de 2022)**

| Empleado | Tipo de Bono | Monto |
|----------|--------------|-------|
| María González | Bono Anual | $2,000.00 |
| Carlos Pérez | Bono por Productividad | $1,500.00 |
| Ana Rodríguez | Bono Especial | $1,000.00 |
| Luis Martínez | Bono por Asistencia | $800.00 |
| Pedro Sánchez | Bono por Proyecto | $1,200.00 |

**Total en Bonos**: $6,500.00

---

## 📉 Sistema de Deducciones

### **Tipos de Deducciones Configuradas**

| Deducción | Porcentaje | Descripción | Vigencia |
|-----------|------------|-------------|----------|
| **Seguro Social** | 4.00% | Aporte al seguro social | Desde 2020 |
| **Paro Forzoso** | 0.50% | Aporte paro forzoso | Desde 2020 |
| **Ahorro Habitacional** | 1.00% | Aporte ahorro habitacional | Desde 2020 |
| **Préstamo Personal** | 5.00% | Deducción por préstamo | 2022-2023 |
| **Cuota Sindical** | 1.50% | Aporte sindical | Desde 2021 |

### **Deducciones Aplicadas (30 de diciembre de 2022)**

| Empleado | Seguro Social | Paro Forzoso | Ahorro Hab. | Total Deducciones |
|----------|---------------|--------------|-------------|-------------------|
| María González | $200.00 | $25.00 | $50.00 | $275.00 |
| Carlos Pérez | $160.00 | $20.00 | $40.00 | $220.00 |
| Ana Rodríguez | $120.00 | $15.00 | $30.00 | $165.00 |
| Luis Martínez | $140.00 | $17.50 | $35.00 | $192.50 |
| Pedro Sánchez | $168.00 | $21.00 | $42.00 | $231.00 |

**Total en Deducciones**: $1,083.50

---

## 🧾 Recibos de Nómina Generados

### **Período: Diciembre 2022 (Fecha de Pago: 30/12/2022)**

| Empleado | Salario Base | Bonos | Deducciones | **Monto Neto** |
|----------|--------------|-------|-------------|----------------|
| María González | $5,500.00 | $2,000.00 | $275.00 | **$5,200.00** |
| Carlos Pérez | $4,500.00 | $1,500.00 | $220.00 | **$4,100.00** |
| Ana Rodríguez | $3,000.00 | $1,000.00 | $165.00 | **$3,100.00** |
| Luis Martínez | $3,500.00 | $800.00 | $192.50 | **$3,600.00** |
| Pedro Sánchez | $4,200.00 | $1,200.00 | $231.00 | **$4,300.00** |

### **📊 Resumen Total de Nómina**
- **Total Salarios**: $20,700.00
- **Total Bonos**: $6,500.00
- **Total Deducciones**: $1,083.50
- **🎯 TOTAL NETO PAGADO**: $20,300.00

---

## 📈 Reportes Generados

### **🏦 Reporte Bancario**
- **Fecha**: 30 de diciembre de 2022
- **Total a Transferir**: $20,300.00
- **Cantidad de Pagos**: 5 empleados
- **Detalle**: Incluye información completa de cada empleado para transferencias bancarias

### **📋 Reporte Contable**
- **Fecha**: 30 de diciembre de 2022
- **Total Nómina**: $20,300.00
- **Resumen Contable**:
  - Total Deducciones: $1,083.50
  - Total Bonos: $6,500.00
  - Impacto Contable: Registros para asientos contables

---

## 🔐 Credenciales de Acceso

### **Usuarios de Prueba para Login**

| Usuario | Email | Contraseña | Rol |
|---------|-------|------------|-----|
| María González | maria.gonzalez@empresa.com | abc123 | Usuario |
| Carlos Pérez | carlos.perez@empresa.com | def456 | Usuario |
| Ana Rodríguez | ana.rodriguez@empresa.com | ghi789 | Usuario |
| Luis Martínez | luis.martinez@empresa.com | jkl012 | Usuario |
| Pedro Sánchez | pedro.sanchez@empresa.com | mno345 | Usuario |

> **⚠️ Nota de Seguridad**: Estas son contraseñas de prueba. En producción, usar contraseñas seguras.

---

## 🎯 Casos de Uso para Pruebas

### **✅ Funcionalidades que Puedes Probar**

1. **👥 Gestión de Empleados**
   - Ver lista completa de empleados
   - Consultar detalles de cada empleado
   - Verificar estructura organizacional

2. **💰 Cálculos de Nómina**
   - Revisar salarios históricos
   - Verificar cálculos de bonos
   - Comprobar deducciones aplicadas

3. **🧾 Generación de Recibos**
   - Ver recibos de nómina generados
   - Verificar cálculos netos
   - Comprobar asociaciones de bonos y deducciones

4. **📊 Reportes del Sistema**
   - Generar reportes bancarios
   - Crear reportes contables
   - Verificar totales y resúmenes

5. **🔍 Consultas y Filtros**
   - Buscar empleados por departamento
   - Filtrar por estado (Trabajando, Vacaciones)
   - Consultar historiales específicos

---

## 🚀 Cómo Usar los Datos de Prueba

### **📋 Pasos para Cargar los Datos**

1. **Asegúrate** de que la base de datos esté creada
2. **Ejecuta** primero `database.sql`
3. **Ejecuta** después `funciones.sql`
4. **Finalmente ejecuta** `datosPrueba.sql`

### **🔄 Reiniciar Datos de Prueba**

Si necesitas volver a cargar los datos:
```sql
-- El script automáticamente limpia datos existentes
-- Solo ejecuta nuevamente datosPrueba.sql
```

### **⚠️ Consideraciones Importantes**

- Los datos están **sincronizados** para el 30 de diciembre de 2022
- Todas las **relaciones** entre tablas están correctamente establecidas
- Los **cálculos** reflejan la legislación laboral venezolana
- Las **fechas** están alineadas para consistencia en reportes

---

## 📞 Soporte

Si tienes problemas con los datos de prueba:
- Verifica que todos los scripts se ejecutaron correctamente
- Revisa que no hay errores en la consola de MySQL
- Consulta los logs del sistema para más detalles

**¡Los datos de prueba te permitirán explorar todas las funcionalidades del Sistema de Nómina Baldox de manera segura y completa!** 🎉