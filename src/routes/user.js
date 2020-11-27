const express = require('express');
const router = express.Router();

const userController = require('../controller/userController');


//Get's
router.get('/', userController.list);
router.get('/login', userController.login);
router.get('/signup',userController.renderSignUp);


//Post's
//router.post('/signup',userController.signup); 


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