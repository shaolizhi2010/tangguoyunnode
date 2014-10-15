var EventProxy = require('eventproxy');

var folder = require('../proxy').Folder;

exports.getFolders = function (curBookmarkId,req, res,ep) {

    var userId = req.session.user.userId;

    var bookmarkId =  curBookmarkId?curBookmarkId: req.param("bookmarkId");
    var pid = req.param("folderId");

    var param = {};
    userId ? param.userId = userId:null;
    bookmarkId?param.bookmarkId = bookmarkId:null;
    pid ? param.pid = pid:param.pid = null;

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

//取 folderId 的统计文件夹，包括自己
exports.getBrothers = function (folderId,ep) {

    folder.getFolderById(folderId,function(err,doc){ //取 folderId 的文件夹详细信息
        if(doc.pid){ //父id
            folder.getFolders({pid:doc.pid},function(err,docs){//取父id的所有子元素
                ep.emitLater("getBrothersDone", docs);
            });
        }
    });
};

//取 folderId 的统计文件夹，包括自己
exports.getParent = function (folderId,ep) {

    folder.getFolderById(folderId,function(err,doc){ //取 folderId 的文件夹详细信息
        if(doc.pid){ //父id
            folder.getFolderById(doc.pid,function(err,parentFolder){ //取 folderId 的文件夹详细信息
                ep.emitLater("getParentDone", parentFolder);
            });
        }
    });
};

exports.getAllParentFoldersForWeb = function(req, res, next){

    var ep = new EventProxy();
    exports.getAllParentFolders(req.param('folderId'),{},ep);
    ep.once("getAllParentFoldersDone",function(folders){
        res.send(folders);
    });

}

exports.getAllParentFolders = function (folderId,subFolder,ep) {
   // var pid = req.param("folderId");
console.log("getAllParentFolders ep : " + ep);
    if(typeof subFolder == 'undefined'){
        subFolder = {};
    }

    folder.getFolderById(folderId,function(err,doc){ //取 folderId 的文件夹详细信息
        doc.folders.forEach(function(folder){
           if( folder._id = subFolder._id ){ //替换子元素，参数传进来的子元素，信息更多
               folder = subFolder;
           }
        });
        if(doc.pid){ //父id
            exports.getAllParentFolders(doc.pid,doc,ep);
        }
        else{ //已到最上层
            ep.emitLater("getAllParentFoldersDone", doc);
        }
    });


/*
    var ep = EventProxy();

    exports.getBrothers(folderId, ep);
    ep.once('getBrothersDone', function (brothers) {

    });

    exports.getParent(folderId, ep);//todo should pid
    ep.once('getParentDone', function (parent) {
        if(typeof parent.pid!='undefined' &&  parent.pid != null){ //还有上层文件夹
            exports.getAllParentFolders();
        }

    });
*/

}

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
