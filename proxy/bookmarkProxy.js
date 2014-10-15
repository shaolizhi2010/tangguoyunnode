var models = require('../models');
var BookmarkModel = models.Bookmark;
//todo
var BookmarkModel = models.Bookmark;
var BookmarkModel = models.Bookmark;




exports.newAndSave = function (param, callback) {

    var bookmark = new BookmarkModel();
    bookmark.name = param.name;
    bookmark.userId = param.userId;
    bookmark.save(callback);
};

exports.getBookmarks = function (param, callback) {
    BookmarkModel.find(param).sort('-_id').exec( function (err, docs) {
        callback(err, docs);
    });
};

//去一个用户所有bookmark和左右子节点，包裹子孙文件夹和网址
exports.populateBookmarks = function (param, callback) {
    BookmarkModel.find(param)
        .sort('-_id')
        //.populate('pages')
       // .populate('folders')
        .exec( function (err, bookmarks) {

            bookmarks.forEach(function(bookmark) {

                BookmarkModel.populate(bookmark, {path: 'pages folders'}, function (err, bookmark) {

                    bookmark.folders.forEach(function(folder) {



                    });

                });



                //console.log(entry);
            });

        callback(err, bookmarks);
    });
};

exports.getFirstBookmark = function (param, callback) {
     exports.getBookmarks(param,function(err,docs){
         if(docs && docs.length>0){
             callback(err, docs[0]);
         }
         else{
             callback(err, null);
         }

     });
};