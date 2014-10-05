var EventProxy = require('eventproxy')

var pageProxy = require('../proxy').Page;
var userProxy = require('../proxy').User;
var bookmarkProxy = require('../proxy').Bookmark
    ;
var folderModel = require('../models').Folder;
var bookmarkModel = require('../models').Bookmark;

 var userController =require('./userCtrl');
var bookmarkController =require('./bookmarkCtrl');
var pageController =require('./pageCtrl');
var folderController =require('./folderCtrl');


//用户打开首页执行此方法
exports.index = function (req, res, next) {

    //not login
    if ( !userController.checkSession(req,res,next)) {
        //console.log('site checkSession user is not login');
        bookmarkController.genDefaultBookmark(req, res, next);

    }
    else{ //already login

        var userId = req.session.user.userId;
        var bookmarkId = req.param("bookmarkId");
        var pid = req.param("pid");
        console.log('site index userId ： ' + userId + ' bookmarkId :' + bookmarkId + " pid : " + pid);

        var curBookmarkId; //用户当前bookmarkId
        var bookmarks;

        var ext = {};
        ext.userId = userId;
        ext.parentFolderId = '';
        ext.parentFolderName = '';
        ext.curBookmarkId ='';


        var ep = new EventProxy();

        //get bookmarks
        bookmarkController.getBookmarks(req,res,ep);

        //if parentFolderId is exist, get parent Folder info
        /*
        if(pid){
            // get parentFolderName
            folderModel.findOne({_id: pid}, function (err, parentFolder) {
                parentFolderName = parentFolder.name;

                ep.emit("parentFolderName", parentFolderName);

            });
        }*/

        ep.once('getBookmarksDone', function (bookmarks) {
            bookmarkId ?ext.curBookmarkId=bookmarkId:ext.curBookmarkId=bookmarks[0]._id;
        });

        pageController.getPages(req,res,ep);
        folderController.getFolders(req,res,ep);

        ep.all("getBookmarksDone","getFoldersDone","getPagesDone",function(bookmarks,folders,pages){
            //console.log('render folders : ' + folders);
            res.render('index', {bookmarks: bookmarks,folders:folders,pages:pages, ext: ext, session: req.session});
        });

    }



};


//创建新书签
//如果用户未登录，则自动登陆
//如果用户未注册，则自动注册

exports.createBookmark = function (req, res, next) {

    console.log('createBookmark');

    var ep = new EventProxy();

    if (typeof req.session == 'undefined' || typeof req.session.user == 'undefined') {
        //检查用户名是否存在
        userProxy.getUserByUserId(req.param('createBookmark_username'), function (err, user) {
            ep.emitLater("getUserByUserId", user);
        });

        ep.once("getUserByUserId", function (user) {
            //如存在 则登录并取出user信息
            if (user != null) {
                userProxy.getUserByUserIdAndPassword({userId: req.param('createBookmark_username'), password: req.param('createBookmark_password')}, function (err, loginUser) {
                    req.session.user = loginUser;
                    ep.emitLater("user", loginUser);
                })
            }
            else {//如不存在 则注册新用户
                userProxy.newAndSave({userId: req.param('createBookmark_username'), password: req.param('createBookmark_password')}, function (err, newUser) {
                    req.session.user = newUser;
                    ep.emitLater("user", newUser);
                });
            }
        });
    }
    else { //已登录
        ep.emitLater("user", req.session.user);
    }

    ep.once("user", function (user) {
        console.log('creating bookmark for user : ' + user);
        bookmarkProxy.newAndSave({userId: user.userId, name: req.param('createBookmark_bookmarkName')}, function (err, bookmark) {
            res.send(bookmark);
        });
    });


}
exports.getBookmarks = function (req, res, next) {
    bookmarkProxy.getBookmarks({userId: req.param('userId')}, function (err, docs) {
        res.send(docs);
    });
};