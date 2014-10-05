var pageProxy = require('../proxy').Page;

var folderModel = require('../models').Folder;


exports.getPages = function (req,res,ep) {

    var userId = req.session.user.userId;
    var bookmarkId = req.param("bookmarkId");
    var pid = req.param("pid");

    var param = {};
    userId ? param.userId = userId:null;
    bookmarkId?param.bookmarkId = bookmarkId:null;
    pid ? param.pid = pid:null;

    //console.log('getPages param : ' + JSON.stringify( param));

    pageProxy.getPages(param, function (err, pages) {
        if(err){
            console.log("pageCtrl getPages : " + err);
            ep.emitLater("getPagesErr", err);
        }
        else{
           // console.log('emit  -----  getPagesDone pages ：' + pages);
            ep.emitLater("getPagesDone", pages);
        }
    });

};


exports.create = function (req, res, next) {

    try{
        var param = {};

        param.bookmarkId = req.param('bookmarkId');
        if(req.param('folderId')){
            param.folderId = req.param('folderId');
        }

        param.name = req.param('pageName');
        param.link = req.param('pageUrl');
        param.userId = req.session.user.userId;

        pageProxy.newAndSave(param, function (err) {
            console.log(err);
            res.send('done');
        });
    }catch(ex){
        console.log(ex);
        res.send(ex);
    }



};
/*
 exports.getPages = function (req, res, next) {
 page.getPages(function(err,doc){
 res.cookie('pages', doc);
 res.send( doc );
 });
 }
 */