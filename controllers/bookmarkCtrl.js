var EventProxy = require('eventproxy');

var bookmarkProxy = require('../proxy').Bookmark;

exports.getBookmarks = function (req, res, ep) {

    try {
        var userId = req.session.user.userId;

        //取用户 bookmark
        var queryBookmarkParam = {};
        userId ? queryBookmarkParam.userId = userId : null;

        bookmarkProxy.getBookmarks(queryBookmarkParam, function (err, bookmarks) {
            if (bookmarks && bookmarks.length > 0) {
               // console.log('emit  -----  getBookmarksDone  ' );
                ep.emitLater("getBookmarksDone", bookmarks);
                // ep.emitLater("getBookmarkDone", bookmarks);//done?
            }
            else { //没有bookmark 说明用户是第一次使用本站，为用户生成默认书签
                ep.emitLater("getBookmarksDone",{});
                exports.genDefaultBookmark(req, res);
                return;
            }

        });
    } catch (ex) {
        console.log("bookmarkCtrl getBookmarks ： " + ex);
        ep.emitLater("getBookmarksErr", err);
    }


};


exports.allInOne = function (req, res,ep) {
    try{
        var userId = req.session.user.userId;

        bookmarkProxy.getBookmarks({userId:userId}, function (err, bookmarks) {
            if (bookmarks && bookmarks.length > 0) {

                // console.log('emit  -----  getBookmarksDone  ' );
                ep.emitLater("allInOneDone", bookmarks);

            }
            else { //没有bookmark 说明用户是第一次使用本站，为用户生成默认书签
                ep.emitLater("allInOneDone",{});
                exports.genDefaultBookmark(req, res);
                return;
            }

        });

    } catch (ex) {
        console.log("bookmarkCtrl allInOne ： " + ex);
        ep.emitLater("allInOneErr", err);
    }
}

//用户没有登录，或没有书签，为用户生成默认书签 文件夹 和 网页
exports.genDefaultBookmark = function (req, res) {

    var ep = new EventProxy();

    var folders =[
        //{name: "主文件夹",userId:'',bookmarkId:'',_id:''},
        {name: "生活",userId:'',bookmarkId:'',_id:''},
        {name: "购物",userId:'',bookmarkId:'',_id:''},
        {name: "旅游",userId:'',bookmarkId:'',_id:''}
    ];
   var  pages = [
        {name: "百度", link: "baidu.com"},
        {name: "糖果云书签", link: "tangguoyun.com"},
        {name: "QQ空间", link: "http://qzone.qq.com/"}
    ];

    ep.all("bookmarks",  function (bookmarks) {
        console.log(' -----  genDefaultBookmark');
        res.render('index', {bookmarks: bookmarks,pages:pages,folders:folders,   session: req.session, ext: {}});
        return;
    });

    /*
     bookmarkProxy.newAndSave({name: '系统默认书签', userId: req.cookies.tgy_userId}, function (err, doc) {
     ep.emit("bookmarks", [doc]);
     });
     */
    var bookmarks = [
        {name: '系统默认书签',
        userId:'',
        _id:''}
    ];
    ep.emit("bookmarks", bookmarks);

    //todo 文件夹 和 书签



   // ep.emit("foldersAndPages", foldersAndPages);


};