const express = require('express');
const router = express.Router();

const userController = require('../controller/userController');

router.get('/', userController.list);
router.get('/login', userController.login);
router.get('/signup',userController.renderSignUp);


module.exports = router;