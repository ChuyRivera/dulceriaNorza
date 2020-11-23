const controller = {};

controller.list = (req, res)=>{
    res.render('main');
};

controller.login = (req, res)=>{
    res.render('login');
};

controller.renderSignUp= (req,res)=>{
    res.render('signup');
}


module.exports = controller;