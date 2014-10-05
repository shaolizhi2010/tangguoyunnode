var models = require('../models');
var Page = models.Page;
var Folder = models.Folder;
var async = require('async');
var EventProxy = require('eventproxy');

exports.getFoldersAndPages = function (params, callback) {


    var foldersAndPages = {};
    //get pages
    if (params.pid) {    //get sub folder of pid


        Folder
            .find({"userId": params.userId, "pid": params.pid})
            .populate('pages') // only works if we pushed refs to children
            .populate('folders') // only works if we pushed refs to children
            .exec(function (err, folders) {
                if (err) return console.log(err);


                foldersAndPages.folders = folders;

                Page.find({"userId": params.userId, "pid": params.pid}).exec(function (err, pages) {
                    if (err) return console.log(err);

                    foldersAndPages.pages = pages;
                    //  console.log(foldersAndPages);

                    var ext = {};
                    ext.parentFolderId = '';
                    ext.parentFolderName = '';
                    ext.userId = params.userId;

                    return callback(null, foldersAndPages, ext);

                });

            });

        //get pages

    }
    else {     //get root folder
        Folder
            .find(params).where('pid').exists(false)//parent folder not exist, then root it is root folder
            .populate('pages') // only works if we pushed refs to children
            .populate('folders') // only works if we pushed refs to children
            .exec(function (err, folders) {
                if (err) return console.log(err);
                //console.log(folders);

                foldersAndPages.folders = folders;

                Page.find(params).where('pid').exists(false).exec(function (err, pages) {
                    if (err) return console.log(err);

                    foldersAndPages.pages = pages;
                    //  console.log(foldersAndPages);

                    var ext = {};
                    ext.parentFolderId = '';
                    ext.parentFolderName = '';
                    ext.userId = params.userId;

                    return callback(null, foldersAndPages, ext);
                });

            });
    }


};

exports.getPages = function (param, callback) {
    Page.find(param).exec(function (err, pages) {
       // if (err) return console.log(err);
        return callback(err, pages);

    });
}


exports.newAndSave = function (param, callback) {

    if (param.folderId && param.folderId.length > 10) {

        //find folder
        Folder.findOne({ _id: param.folderId }).exec(function (err, folder) {
            if (err) return console.log(err);

            //init page
            var page = new Page();
            page.pid = param.folderId;

            page.bookmarkId = param.bookmarkId;
            page.name = param.name;
            page.link = param.link;
            page.userId = param.userId;

            //update page into folder.pages
            if (folder) {
                folder.pages.push(page);
                folder.save();
            }

            //save page
            page.save(callback);

            // console.log(folder);
        })
    }
    else{
        var page = new Page();

        page.bookmarkId = param.bookmarkId;
        page.name = param.name;
        page.link = param.link;
        page.userId = param.userId;

        page.save(callback);
    }


};