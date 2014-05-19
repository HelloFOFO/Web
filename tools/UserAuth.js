var WapAuth = function(){
    return function(req,res,next){
        if(req.session && req.session.user){
                next();
        }else{
            res.redirect('/wap/login');
        }
    };
};

var WebAuth = function(){
    return function(req,res,next){
        if(req.session && req.session.user){
            next();
        }else{
            res.redirect('/login');
        }
    };
};

exports.WapAuth = WapAuth();
exports.WebAuth = WebAuth();

