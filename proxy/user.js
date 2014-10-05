var EventProxy = require('eventproxy')

var models = require('../models');
var User = models.User;

exports.getUser = function (userId, callback) {
    User.findOne({"_id": userId}).exec(function (err, user) {
        if (err) return handleError(err);
        return callback(err, use);
    });
};

//同步方式取 User
/*
exports.getUserByUserIdSync = function (userId, callback) {
    var ep = new EventProxy();

    User.findOne({"userId": userId}).exec(function (err, user) {
        if (err) return console.log(err);
        ep.emitLater("done", user);
    });

    ep.after("done", function (user) {
        return user;
    });


};*/


exports.getUserByUserId = function (userId, callback) {

    User.findOne({"userId": userId}).exec(function (err, user) {
        if (err) return console.log(err);
        return callback(err,user);
    });




};

exports.getUserByUserIdAndPassword = function (param, callback) {
    User.findOne({"userId": param.userId, "password": param.password}).exec(function (err, user) {
        if (err) return handleError(err);
        return callback(err, user);
    });
};

exports.newAndSave = function (param, callback) {
    console.log('user proxy : newAndSave');
    var user = new User();
    user.userId = param.userId;
    // user.historyUserId = param.historyUserId;
    // user.name = param.userId;
    user.password = param.password;
    user.save(callback);
};

/* TODO 同步方法
exports.newAndSaveSync = function (param) {

    var flag = true;
    var ep = new EventProxy();

    var user = new User();
    user.userId = param.userId;
    user.password = param.password;
    user.save(function (err, user) {
        if (err) {
            console.log('err : ' + err);
            return null;
        }
        else {
            console.log('emitLater user: ' + user);
            ep.emitLater("newAndSaveSync", user);
        }
    });

    ep.once("newAndSaveSync", function (user) {
        return user;
    });

    //阻止 js return



 }
*/
