const passport = require("passport");
const controller = {};
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const { check, validationResult } = require('express-validator');

controller.list = (req, res)=>{
    res.render('main');
};

controller.login = (req, res)=>{
    res.render('login');
};

controller.postLogin = passport.authenticate('local',{
    successRedirect: '/products',
    failureRedirect: '/login'
});

controller.renderSignUp= (req,res)=>{
    res.render('signup');
}

controller.signup= (req,res)=>{
    
    const userData = req.body;
    
    console.log(userData);
    
    req.getConnection((err, conn) => {
        const query = 'INSERT INTO user SET ?';
        conn.query(query, [userData], (error, data) => {
            console.log(data);
            res.redirect('/signup');
        })
    });
};

controller.logout = (req, res)=>{
    req.logOut();
    res.redirect('/login')
};

controller.renderProducts = ((req,res,next)=>{
        console.log(req.user); //mostrar los datos del usuario del request en consola
        if(req.isAuthenticated()){
            return next(); //si se encuentra logueado vamos a continuar y muestro lo siguiente
        } else{
            res.redirect('/login'); //pero si no está logueado nos redirigue a la pantalla de login
        }
        
    } ,

    (req, res) => {
    //Cuando no esté logueado /login
    //Logueado
    if(!req.user){
        res.redirect('/login');
    }else{
        //res.send('hola '+req.user.fullname+' '+req.user.id+' '+req.user.email+' '+req.user.password); //para verificar si se están recibiendo los cambios del usuario logueado
        res.render('products');
    }
});


module.exports = controller;