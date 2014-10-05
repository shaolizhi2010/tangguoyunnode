var random = require("node-random");

var user = require('../proxy').User;
var PageModel = require('../models').Page;
var FolderModel = require('../models').Folder;




//如果cookie不存在 认为是一个新用户，
// 新建一个cookie
//为用户生成一套系统默认书签
/*
exports.checkCookie = function (req, res, next) {

    if (typeof req.cookies.tgy_userId == 'undefined') {
        //新建cookie
        try {
            random.strings({
                "length": 1,
                "number": 4,
                "upper": false,
                "digits": false
            }, function (error, data) {
                req.cookies.tgy_userId = data.join("") + new Date().getDate();
                res.cookie('tgy_userId', data.join("") + new Date().getDate());
                next();
            });
        } catch (ex) {
            
        }

        //新建一条bookmark
        siteCtrl.genDefaultBookmark(req, res, next)
    }
    else {
        next();
    }

};
*/
//每次用户访问自己的书签，先执行此方法重置用户cookie
//这样用户的cookie中保存的信息，就一直都是上一次访问的userId的信息
exports.checkUserId = function (req, res, next) {

    if (req.param('userId') && req.param('userId')!='favicon.ico') {
        try {
            req.cookies.tgy_userId = req.param('userId');
            res.cookie('tgy_userId', req.param('userId'));
            //site.index(req,res,next);
        } catch (ex) {
            console.log('err: controller user checkUserId :' + ex);
        }
    }
    next();
};


//检查session
exports.checkSession = function (req, res, next) {
    //未登录
    if (typeof req.session == 'undefined' || typeof req.session.user == 'undefined') {
        return false;
    }
    else{
        return true;
    }
}

//用户注册
exports.createUser = function (req, res, next) {

    var param = {};
    param.userId = req.param("name");
   // param.name = req.param("name");
    param.password = req.param("password");
    param.historyUserId = req.cookies.tgy_userId;

    //替换掉用户的临时userid
    FolderModel.update({ "userId": req.cookies.tgy_userId}, { "userId": req.param("name"), "historyUserId": req.cookies.tgy_userId},{ multi: true },function(err){
        console.log(err);
        if (err) return handleError(err);
    });

    PageModel.update({ "userId": req.cookies.tgy_userId}, { "userId": req.param("name"), "historyUserId": req.cookies.tgy_userId},{ multi: true },function(err){
        console.log(err);
        if (err) return handleError(err);
    });

    //req.cookies.tgy_userId
   // Folder.

    user.newAndSave(param, function(err,user){
        if(err){
            console.log(err);
        }
        else{
            req.session.user = user;
            res.send('注册成功');
        }

    });


};

//用户登录
exports.login = function (req, res, next) {

    if (req.param('name') && req.param('password') ) {
        try {
            //check
            user.getUserByUserIdAndPassword({userId:req.param('name'),password:req.param('password')},function(err,user){
                if(user){
                    req.session.user = user;
                    res.send('登录成功');
                }
                else{
                    res.send('用户名或密码错误');
                }

            });
            //site.index(req,res,next);
        } catch (ex) {
            console.log('err: controller user login :' + ex);
        }
    }

};

exports.logout = function (req, res, next) {
    if(req.session ){
        req.session.destroy(function(err) {
            res.send('已退出登录');
        })
    }
}