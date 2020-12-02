const passport = require("passport");
const controller = {};
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const { check, validationResult } = require('express-validator');
const async = require('async');

controller.list = (req, res) => {
    res.render('main');
};

controller.login = (req, res) => {
    res.render('login');
};


controller.addCart = (req, res) => {
    req.getConnection((err, conn) => {
        const query = 'INSERT INTO cart SET ?';
        conn.query(query, [req.params], (error, data) => {
            console.log(error)
            res.redirect('/products');
        })
    });
};

controller.cart = (req, res) => {
    req.getConnection((err, conn) => {
        const query = 'SELECT * FROM product INNER JOIN cart ON product.id = cart.idProducto WHERE idUsuario = ?';
        conn.query(query, req.params.idUsuario, (error, data) => {
            res.render('cart',{
                data: data
            });
        })
    }); 
};

controller.addProduct = ((req, res, next) => {
    //res.render('addProduct');
    console.log(req.user);
    return next();
},

    (req,res) => {
        if(req.user.role != 1){
            res.redirect('/products');
            /*req.getConnection((err, conn) => {
                const query = 'SELECT * FROM product';
                sesion = req.user
                console.log(sesion)
                async.parallel([
                    function (callback) { conn.query(query, callback) },
                ], function (err, results) {
                    res.render('products', { data: results[0][0], sesion: sesion });
                });
            });*/
        }else{
            res.render('addProduct');
        }
    });

controller.productDetails = (req, res) => {
    req.getConnection((err, conn) => {
        const query = 'SELECT * FROM product WHERE id = ?';
        const query2 = 'SELECT * FROM product LIMIT 4';
        async.parallel([
            function (callback) { conn.query(query, req.params.id, callback) },
            function (callback) { conn.query(query2, callback) },
        ], function (err, results) {
            res.render('productDetails', { rows: results[0][0], rows2: results[1][0] });
        });
    });

};

controller.postLogin = passport.authenticate('local', {
    successRedirect: '/products',
    failureRedirect: '/login'
});

controller.renderSignUp = (req, res) => {
    res.render('signup');
}

controller.signup = (req, res) => {

    const userData = req.body;

    console.log(userData);

    req.getConnection((err, conn) => {
        const query = 'INSERT INTO user SET ?';
        conn.query(query, [userData], (error, data) => {
            console.log(data);
            res.redirect('/login');
        })
    });
};

controller.logout = (req, res) => {
    req.logOut();
    res.redirect('/login')
};

controller.renderProducts = ((req, res, next) => {
    console.log(req.user); //mostrar los datos del usuario del request en consola
    if (req.isAuthenticated()) {
        return next(); //si se encuentra logueado vamos a continuar y muestro lo siguiente
    } else {
        res.redirect('/login'); //pero si no está logueado nos redirigue a la pantalla de login
    }

},

    (req, res) => {
        //Cuando no esté logueado /login
        //Logueado
        if (!req.user) {
            res.redirect('/login');
        } else {
            req.getConnection((err, conn) => {
                const query = 'SELECT * FROM product';
                sesion = req.user
                console.log(sesion)
                async.parallel([
                    function (callback) { conn.query(query, callback) },
                ], function (err, results) {
                    res.render('products', { data: results[0][0], sesion: sesion });
                });
            });
            /* req.getConnection((err, conn)=>{
                 conn.query('SELECT * FROM product',(error,products)=>{
                     res.render('products',{
                         data: products
                     });
                 });
             });*/
        }
    });

controller.addProductPost = (req, res) => {
    message = '';
    if (req.method == "POST") {
        var post = req.body;
        var nombre = post.nombre;
        var descripcion = post.descripcion;
        var precio = post.precio;

        if (!req.files)
            return res.status(400).send('No files were uploaded.');

        console.log(req.files)
        var file = req.files.upload_image;
        var img_name = file.name;
        var datos = [nombre, descripcion, precio, img_name];
        console.log(datos);

        if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {
            file.mv('src/public/images/upload_images/' + file.name, function (err) {

                if (err)

                    return res.status(500).send(err);
                req.getConnection((err, conn) => {
                    const query = "INSERT INTO product (nombre, descripcion, precio, imagen) VALUES (?)"
                    conn.query(query, [datos], (err, product) => {
                        console.log(product);
                        res.redirect('/products');
                    });
                });
            });
        } else {
            message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
            res.render('main', { message: message });
        }
    } else {
        res.render('main');
    }

}

controller.productEdit = (req, res) => {
    req.getConnection((err, conn) => {
        const query = 'SELECT * FROM product WHERE id = ?';
        conn.query(query, req.params.id, (error, product) => {
            res.render('productEdit', {
                data: product
            });
        })

    });

};

controller.productEdited = (req, res) => {
    message = '';
    if (req.method == "POST") {
        var post = req.body;
        var nombre = post.nombre;
        var descripcion = post.descripcion;
        var precio = post.precio;

        if (!req.files) {
            req.getConnection((err, conn) => {
                const query = "UPDATE product SET nombre = ?, descripcion = ?, precio = ? WHERE id = ?";
                conn.query(query, [nombre, descripcion, precio, req.params.id], (error, product) => {
                    console.log(error)
                    res.redirect('/products');
                })

            });
        } else {

            console.log(req.files)
            var file = req.files.upload_image;
            var img_name = file.name;
            var datos = [nombre, descripcion, precio, img_name];
            console.log(datos);

            if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {
                file.mv('src/public/images/upload_images/' + file.name, function (err) {

                    if (err)

                        return res.status(500).send(err);
                    req.getConnection((err, conn) => {
                        const query = "UPDATE product SET nombre = ?, descripcion = ?, precio = ?, imagen = ? WHERE id = ?";
                        conn.query(query, [datos[0], datos[1], datos[2], datos[3], req.params.id], (error, product) => {
                            console.log(error)
                            res.redirect('/products');
                        })

                    });
                });
            } else {
                message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
                res.render('main', { message: message });
            }
        }
    } else {
        res.render('main');
    }

};

controller.cartRemove = (req, res) => {
    var idUsuario = req.params.idUsuario
    req.getConnection((err, conn) => {
        const query = 'DELETE FROM cart WHERE id = ?';
        conn.query(query, req.params.id, (error, data) => {
            res.redirect('/cart/' + idUsuario)
        })
    }); 
};

module.exports = controller;