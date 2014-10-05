var models = require('../models');
var Folder = models.Folder;

exports.newAndSave = function (param, callback) {

    if (param.pid && param.pid.length >10) { //parent id is not null, sub folder
        //find folder
        Folder.findOne({ _id: param.pid }).exec(function (err, parentFolder) {
            if (err) return console.log(err);

            var folder = new Folder();
            folder.bookmarkId = param.bookmarkId;
            folder.pid = param.pid;
            folder.name = param.name;
            folder.userId = param.userId;

            //update page into folder.pages
            if (parentFolder) {
                parentFolder.folders.push(folder);
                parentFolder.save();
            }

            folder.save(callback);
        })
    }
    else{ //root folder
        var folder = new Folder();
        folder.bookmarkId = param.bookmarkId;
        folder.name = param.name;
        folder.userId = param.userId;
        folder.save(callback);
    }

};


exports.getFolders = function (param, callback) {
    Folder.find(param, function (err, docs) {
        callback(err, docs);
    });
};
