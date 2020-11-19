const express = require('express');
const app = express();
const port = 3000
const path = require('path');
const myConn = require('express-myconnection');
const mysql = require('mysql');

//conf engine
app.use(express.urlencoded({extended:false})) //extends false para formularios sin imagenes o archivos
app.use(express.json())

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Middleware
const conn = {
    host:'localhost',
    user:'root',
    password:'',
    database:'dulcerianorza',
    port: '3306'
};

app.use(myConn(mysql, conn, 'single'));

//declaracion de variables de rutas

const userRoutes = require('./routes/user');


//rutas

app.use('/',userRoutes);



//Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => console.log(`Example app listening on port port!`))


