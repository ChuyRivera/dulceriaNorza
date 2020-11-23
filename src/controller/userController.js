const controller = {};

controller.list = (req, res)=>{
    res.render('user');
};

controller.renderSignUp= (req,res)=>{
    res.render('signup');
}

module.exports = controller;