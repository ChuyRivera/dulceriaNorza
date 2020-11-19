CREATE DATABASE dulcerianorza;

USE dulcerianorza;

--user table
CREATE TABLE `dulcerianorza`.`user` (
    `username` VARCHAR(16) NOT NULL,
    `email` VARCHAR(255) NULL,
    `password` VARCHAR(32) NOT NULL,
    `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP);