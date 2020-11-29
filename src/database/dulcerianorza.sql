CREATE DATABASE dulcerianorza;

USE dulcerianorza;

--Crear user table
CREATE TABLE `dulcerianorza`.`user` (
    `username` VARCHAR(16) NOT NULL,
    `email` VARCHAR(255) NULL,
    `password` VARCHAR(32) NOT NULL);

--modificar tabla de usuarios
ALTER TABLE `dulcerianorza`.`user` (
    CHANGE COLUMN `nombre` `fullname` VARCHAR(100) NULL DEFAULT NULL ,
    CHANGE COLUMN `email` `email` VARCHAR(100) NULL DEFAULT NULL ,
    CHANGE COLUMN `contrasena` `password` VARCHAR(100) NULL DEFAULT NULL);