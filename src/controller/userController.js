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
}


module.exports = controller;