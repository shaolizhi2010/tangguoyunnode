var folder = require('../proxy').Folder;

exports.getFolders = function (req, res,ep) {

    var userId = req.session.user.userId;
    var bookmarkId = req.param("bookmarkId");
    var pid = req.param("pid");

    var param = {};
    userId ? param.userId = userId:null;
    bookmarkId?param.bookmarkId = bookmarkId:null;
    pid ? param.pid = pid:null;

    folder.getFolders(param, function (err, docs) {
        if(err){
            console.log("folderCtrl getFolders : " + err);
            ep.emitLater("getFoldersErr", err);
        }
        else{
           // console.log('emit  -----  getFoldersDone ' );
            ep.emitLater("getFoldersDone", docs);
        }
    });

};

exports.create = function (req, res, next) {

    try{
        var param = {};

        param.bookmarkId = req.param('bookmarkId');
        if(req.param('folderId')){
            param.pid = req.param('folderId');
        }
        param.name = req.param('folderName');
        param.userId  = req.session.user.userId;;

        folder.newAndSave(param, function (err) {
            console.log(err);
            res.send('操作成功');
        });

    }catch(ex){
        console.log(ex);
        res.send(ex);
    }

};
