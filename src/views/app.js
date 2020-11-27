const express = require('express');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const app = express();
const port = 3000
const path = require('path');
const myConn = require('express-myconnection');
const mysql = require('mysql');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

//conf engine
app.use(express.urlencoded({ extended: false })) //extends false para formularios sin imagenes o archivos
app.use(express.json())

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Middleware
const conn = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dulcerianorza',
    port: '3306'
};

app.use(myConn(mysql, conn, 'single'));

//declaracion de variables de rutas

const userRoutes = require('./routes/user');


//rutas

//use
app.use('/', userRoutes);
app.use('/login', userRoutes);
app.use('/signup', userRoutes);

//post's
app.post('/signup', urlencodedParser, [
    check('fullname', 'El nombre debe ser mayor a 5 carácteres ')
        .exists()
        .isLength({ min: 5 }),
    check('email', 'El correo electrónico no es válido').isEmail()
        .normalizeEmail(),
        check('password',' "La contraseña debe incluir 1 mínuscula , 1 mayúscula , 1 número, y un cáracter especial(*,/,-)."').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return res.status(422).jsonp(errors.array())
        const alert = errors.array()
        res.render('signup', {
            alert,

        })
    } else {
        const userData = req.body;

        console.log(userData);
        req.getConnection((err, conn) => {
            const query = 'INSERT INTO user SET ?';
            conn.query(query, [userData], (error, data) => {
                console.log(data);
                res.redirect('/signup');
            })

        });
    }
});



//Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => console.log(`Example app listening on port port!`))


