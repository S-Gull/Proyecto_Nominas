CREATE DATABASE crud_electron;

USE crud_electron;

CREATE TABLE productos(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255),
  precio DECIMAL(10,2) NOT NULL
);

DESCRIBE productos;