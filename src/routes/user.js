const express = require('express');
const { postLogin } = require('../controller/userController');
const router = express.Router();

const userController = require('../controller/userController');


//Get's
router.get('/', userController.list);
router.get('/login', userController.login);
router.get('/signup',userController.renderSignUp);
router.get('/logout', userController.logout); //Para matar la sesion
router.get('/products', userController.renderProducts);
router.get('/addProduct',userController.addProduct);
router.get('/productDetails/:id', userController.productDetails);
router.get('/product/edit/:id', userController.productEdit);
router.get('/cart/:idUsuario',userController.cart);
router.get('/addCart/:idProducto/:idUsuario',userController.addCart);
router.post('/product/edited/:id', userController.productEdited);
router.post('/addProduct',userController.addProductPost);



//Post's
//router.post('/signup',userController.signup); 
router.post('/login', userController.postLogin); //Post del formulario de login


module.exports = router;
/*
router.post('/signup',[
    check('email', 'email is required').isEmail().normalizeEmail(),
    check('fullname', 'name is required').not().isEmpty(),
    check('password', 'password is required').not().isEmpty().isLength({min: 5}),
  ], function(req, res, next) {
    //check validate data
    const result= validationResult(req);
    var errors = result.errors;
    for (var key in errors) {
          console.log(errors[key].value);
    }
    if (!result.isEmpty()) {
        
    //response validate data to register.ejs
       res.render('signup', {
        errors: errors
      })
    }
    
})*/