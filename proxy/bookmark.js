var models = require('../models');
var BookmarkModel = models.Bookmark;

exports.newAndSave = function (param, callback) {

    var bookmark = new BookmarkModel();
    bookmark.name = param.name;
    bookmark.userId = param.userId;
    bookmark.save(callback);
};

exports.getBookmarks = function (param, callback) {
    BookmarkModel.find(param, function (err, docs) {
        callback(err, docs);
    });
};
