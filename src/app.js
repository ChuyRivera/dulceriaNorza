const express = require('express');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const app = express();
const port = 3000
const path = require('path');
const myConn = require('express-myconnection');
const mysql = require('mysql');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passportLocal = require('passport-local').Strategy;

const urlencodedParser = bodyParser.urlencoded({ extended: false });

//conf engine
const db = mysql.createConnection({ //es para utilizar mysql sin middleware
    host:'localhost',
    user:'root',
    password:'',
    database:'dulcerianorza',
    port: '3306'
})

app.use(express.json())

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false })) //extends false para formularios sin imagenes o archivos
app.use(cookieParser('mi secreto'))
app.use(session({
    secret: 'mi secreto',
    resave: true,
    saveUninitialized: true
}))


//Middleware
const conn = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dulcerianorza',
    port: '3306'
};

//*configuracion para usar mysql por medio de un middleware,  y usar la conexión por medio de req
app.use(myConn(mysql, conn, 'single'));

app.use(passport.initialize())
app.use(passport.session())

passport.use(new passportLocal( (username, password, done) => {

    //logica de logueo (Conexion a la DB)
    if(db){
        const consulta = `SELECT * FROM user WHERE email LIKE '${username}'
                            AND password LIKE '${password}'`;

        db.query(consulta, (err, user) => {
            if(!err){
                if(user.length > 0){ //si existe almenos un usuario
                    done(null, user[0]);
                }else{
                    done(null,false,{mesagge: 'el usuario y/o contraseña son incorrectos'});
                }
            }else{
                done(null,false,{mesagge: 'No se pudieron obtener datos'});
            }
        })
    }else{
        done(null,false,{mesagge: 'No se pudo conectar con la base de datos'});
    }
} ));

//serializar los objetos de passport
//{id:1, name:'Ete Zech'} <-- objeto deserializado, convertir por ejemplo se usa el id para serializar
//1  <-- serializado
passport.serializeUser((user, done) => {
    done(null, user.id)
})

//Deserializar
passport.deserializeUser((id, done) => {
    //Consultar la base de datos para traer los datos del usuario mediante el id
    
    if(db){
        const consulta = `SELECT * FROM user WHERE id = ${id}`;
        db.query(consulta, (err, user) => {
            if(!err){
                if(user.length > 0){ //si existe almenos un usuario
                    done(null, user[0]);
                }else{
                    done(null,false,{mesagge: 'no se encontró el usuario con id = '+id});
                }
            }else{
                done(null,false,{mesagge: 'No se pudieron obtener datos'});
            }
        })
    }else{
        done(null,false,{mesagge: 'No se pudo conectar con la base de datos'});
    }

})



//Declaracion de variables de rutas

const userRoutes = require('./routes/user');


//rutas

//use
app.use('/', userRoutes);
app.use('/login', userRoutes);
app.use('/signup', userRoutes);
app.use('/products',userRoutes);

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
        const {fullname,email,password} = req.body;

        
        req.getConnection((err, conn) => {
            var sql = "INSERT INTO user (fullname, email,password) VALUES (?,?,?)";
            const query = 'INSERT INTO user SET ?';
            conn.query(sql, [fullname,email,password], (error, data) => {
                console.log(data);
                res.redirect('/signup');
            })

        });
    }
});



//Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => console.log(`Example app listening on port port!`))


