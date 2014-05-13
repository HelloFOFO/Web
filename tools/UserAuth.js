var WapAuth = function(){
    return function(req,res,next){
        if(req.session && req.session.user){
                next();
        }else{
            res.redirect('/wap/login');
        }
    }
};

exports.WapAuth = WapAuth();