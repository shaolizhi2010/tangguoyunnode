var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var domainMiddleware = require('domain-middleware');

//var routes = require('./routes/index');
//var users = require('./routes/users');

var pageCtrl = require('./controllers/pageCtrl');
var folderCtrl = require('./controllers/folderCtrl');
var siteCtrl = require('./controllers/siteCtrl');
var userCtrl = require('./controllers/userCtrl');

var util = require('./utils/util');

// 静态文件目录
var staticDir = path.join(__dirname, 'public');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
    secret: 'tangguoyun123456',
    resave: true,
    saveUninitialized: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(require('express-domain-middleware')); //todo

//如果cookie中没有用户id，认为用户首次登录，则为用户生成一个新的id，并存贮在用户cookie中。
//app.use(user.checkCookie);

app.all('/favicon.ico', function (req, res, next) {
    res.send('');
});

app.all('/', siteCtrl.index);

app.all('/user/login', userCtrl.login);
app.all('/user/logout', userCtrl.logout);

app.all('/:userId/bookmark/:bookmarkId', siteCtrl.index);
app.all('/bookmark/create', siteCtrl.createBookmark);

app.all('/:userId/bookmark/:bookmarkId/folder/:folderId/page/create', pageCtrl.create);
app.all('/:userId/bookmark/:bookmarkId/folder//page/create', pageCtrl.create);

app.all('/:userId/bookmark/:bookmarkId/folder/create', folderCtrl.create);

//app.all('/:userId', user.checkUserId);
app.all('/:userId', siteCtrl.index);
//app.all('/:userId', page.getFoldersAndPages);
//app.all('/:userId/folder/:pid', page.getFoldersAndPages);

app.all('/user/create', userCtrl.createUser);

//app.all('/page/create', page.create);
//app.all('/page/list', page.getPages);

//app.all('/folder/create', folder.create);
//app.get('/folder/list', function (req, res) {
 //   folder.getFolders(req, res);
//});

//app.all('/clearCookie', function (req, res) {
 //   res.clearCookie('tgy_userId');
 //   res.send(res.cookies);
//})

app.all('/xml', util.importPages

    /*
     function(req,res,next){

     var xml = "  <DL> <DT><A HREF='place:folder=BOOKMARKS_MENU&folder=UNFILED_BOOKMARKS&folder=TOOLBAR&queryType=1&sort=12&maxResults=10&excludeQueries=1' ADD_DATE='1411870796' LAST_MODIFIED='1411870796'>最近使用的书签</A> <DT><A HREF='place:type=6&sort=14&maxResults=10' ADD_DATE='1411870796' LAST_MODIFIED='1411870796'>最近使用的标签</A> <HR>    <DT><H3 ADD_DATE='1396418467' LAST_MODIFIED='1396418467'>Mozilla Firefox</H3> <DL> <DT><A HREF='http://www.mozilla.com/zh-CN/firefox/help/' ADD_DATE='1396418467' LAST_MODIFIED='1396418467' ICON_URI='http://www.mozilla.org/2005/made-up-favicon/0-1396418467354' ICON='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHWSURBVHjaYvz//z8DJQAggJiQOe/fv2fv7Oz8rays/N+VkfG/iYnJfyD/1+rVq7ffu3dPFpsBAAHEAHIBCJ85c8bN2Nj4vwsDw/8zQLwKiO8CcRoQu0DxqlWrdsHUwzBAAIGJmTNnPgYa9j8UqhFElwPxf2MIDeIrKSn9FwSJoRkAEEAM0DD4DzMAyPi/G+QKY4hh5WAXGf8PDQ0FGwJ22d27CjADAAIIrLmjo+MXA9R2kAHvGBA2wwx6B8W7od6CeQcggKCmCEL8bgwxYCbUIGTDVkHDBia+CuotgACCueD3TDQN75D4xmAvCoK9ARMHBzAw0AECiBHkAlC0Mdy7x9ABNA3obAZXIAa6iKEcGlMVQHwWyjYuL2d4v2cPg8vZswx7gHyAAAK7AOif7SAbOqCmn4Ha3AHFsIDtgPq/vLz8P4MSkJ2W9h8ggBjevXvHDo4FQUQg/kdypqCg4H8lUIACnQ/SOBMYI8bAsAJFPcj1AAEEjwVQqLpAbXmH5BJjqI0gi9DTAAgDBBCcAVLkgmQ7yKCZxpCQxqUZhAECCJ4XgMl493ug21ZD+aDAXH0WLM4A9MZPXJkJIIAwTAR5pQMalaCABQUULttBGCCAGCnNzgABBgAMJ5THwGvJLAAAAABJRU5ErkJggg=='>帮助和教程</A> <DT><A HREF='http://www.mozilla.com/zh-CN/firefox/customize/' ADD_DATE='1396418467' LAST_MODIFIED='1396418467' ICON_URI='http://www.mozilla.org/2005/made-up-favicon/1-1396418467360' ICON='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHWSURBVHjaYvz//z8DJQAggJiQOe/fv2fv7Oz8rays/N+VkfG/iYnJfyD/1+rVq7ffu3dPFpsBAAHEAHIBCJ85c8bN2Nj4vwsDw/8zQLwKiO8CcRoQu0DxqlWrdsHUwzBAAIGJmTNnPgYa9j8UqhFElwPxf2MIDeIrKSn9FwSJoRkAEEAM0DD4DzMAyPi/G+QKY4hh5WAXGf8PDQ0FGwJ22d27CjADAAIIrLmjo+MXA9R2kAHvGBA2wwx6B8W7od6CeQcggKCmCEL8bgwxYCbUIGTDVkHDBia+CuotgACCueD3TDQN75D4xmAvCoK9ARMHBzAw0AECiBHkAlC0Mdy7x9ABNA3obAZXIAa6iKEcGlMVQHwWyjYuL2d4v2cPg8vZswx7gHyAAAK7AOif7SAbOqCmn4Ha3AHFsIDtgPq/vLz8P4MSkJ2W9h8ggBjevXvHDo4FQUQg/kdypqCg4H8lUIACnQ/SOBMYI8bAsAJFPcj1AAEEjwVQqLpAbXmH5BJjqI0gi9DTAAgDBBCcAVLkgmQ7yKCZxpCQxqUZhAECCJ4XgMl493ug21ZD+aDAXH0WLM4A9MZPXJkJIIAwTAR5pQMalaCABQUULttBGCCAGCnNzgABBgAMJ5THwGvJLAAAAABJRU5ErkJggg=='>自定义 Firefox</A> <DT><A HREF='http://www.mozilla.com/zh-CN/firefox/community/' ADD_DATE='1396418467' LAST_MODIFIED='1396418467' ICON_URI='http://www.mozilla.org/2005/made-up-favicon/2-1396418467367' ICON='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHWSURBVHjaYvz//z8DJQAggJiQOe/fv2fv7Oz8rays/N+VkfG/iYnJfyD/1+rVq7ffu3dPFpsBAAHEAHIBCJ85c8bN2Nj4vwsDw/8zQLwKiO8CcRoQu0DxqlWrdsHUwzBAAIGJmTNnPgYa9j8UqhFElwPxf2MIDeIrKSn9FwSJoRkAEEAM0DD4DzMAyPi/G+QKY4hh5WAXGf8PDQ0FGwJ22d27CjADAAIIrLmjo+MXA9R2kAHvGBA2wwx6B8W7od6CeQcggKCmCEL8bgwxYCbUIGTDVkHDBia+CuotgACCueD3TDQN75D4xmAvCoK9ARMHBzAw0AECiBHkAlC0Mdy7x9ABNA3obAZXIAa6iKEcGlMVQHwWyjYuL2d4v2cPg8vZswx7gHyAAAK7AOif7SAbOqCmn4Ha3AHFsIDtgPq/vLz8P4MSkJ2W9h8ggBjevXvHDo4FQUQg/kdypqCg4H8lUIACnQ/SOBMYI8bAsAJFPcj1AAEEjwVQqLpAbXmH5BJjqI0gi9DTAAgDBBCcAVLkgmQ7yKCZxpCQxqUZhAECCJ4XgMl493ug21ZD+aDAXH0WLM4A9MZPXJkJIIAwTAR5pQMalaCABQUULttBGCCAGCnNzgABBgAMJ5THwGvJLAAAAABJRU5ErkJggg=='>加入进来</A> <DT><A HREF='http://www.mozilla.com/zh-CN/about/' ADD_DATE='1396418467' LAST_MODIFIED='1396418467' ICON_URI='http://www.mozilla.org/2005/made-up-favicon/3-1396418467371' ICON='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHWSURBVHjaYvz//z8DJQAggJiQOe/fv2fv7Oz8rays/N+VkfG/iYnJfyD/1+rVq7ffu3dPFpsBAAHEAHIBCJ85c8bN2Nj4vwsDw/8zQLwKiO8CcRoQu0DxqlWrdsHUwzBAAIGJmTNnPgYa9j8UqhFElwPxf2MIDeIrKSn9FwSJoRkAEEAM0DD4DzMAyPi/G+QKY4hh5WAXGf8PDQ0FGwJ22d27CjADAAIIrLmjo+MXA9R2kAHvGBA2wwx6B8W7od6CeQcggKCmCEL8bgwxYCbUIGTDVkHDBia+CuotgACCueD3TDQN75D4xmAvCoK9ARMHBzAw0AECiBHkAlC0Mdy7x9ABNA3obAZXIAa6iKEcGlMVQHwWyjYuL2d4v2cPg8vZswx7gHyAAAK7AOif7SAbOqCmn4Ha3AHFsIDtgPq/vLz8P4MSkJ2W9h8ggBjevXvHDo4FQUQg/kdypqCg4H8lUIACnQ/SOBMYI8bAsAJFPcj1AAEEjwVQqLpAbXmH5BJjqI0gi9DTAAgDBBCcAVLkgmQ7yKCZxpCQxqUZhAECCJ4XgMl493ug21ZD+aDAXH0WLM4A9MZPXJkJIIAwTAR5pQMalaCABQUULttBGCCAGCnNzgABBgAMJ5THwGvJLAAAAABJRU5ErkJggg=='>关于我们</A> </DL> <DT><H3 ADD_DATE='1396418470' LAST_MODIFIED='1396418470'>Lenovo Recommended Websites</H3> <DL> <DT><A HREF='http://www.lenovo.com/welcome/thinkpad' ADD_DATE='1396418470' LAST_MODIFIED='1396418470'>Home</A> <DT><A HREF='http://www.mylenovocloud.com/' ADD_DATE='1396418470' LAST_MODIFIED='1396418470'>My Lenovo Cloud</A> <DT><A HREF='http://www.lenovo.com/news/cn/zh' ADD_DATE='1396418470' LAST_MODIFIED='1396418470'>News</A> <DT><A HREF='http://www.lenovo.com/register' ADD_DATE='1396418470' LAST_MODIFIED='1396418470'>Product Registration</A> <DT><A HREF='http://www.lenovo.com/products/cn/zh' ADD_DATE='1396418470' LAST_MODIFIED='1396418470'>Products</A> <DT><A HREF='http://www.lenovo.com/accessories' ADD_DATE='1396418470' LAST_MODIFIED='1396418470'>Services, Software, and Accessories</A> <DT><A HREF='http://www.lenovo.com/support' ADD_DATE='1396418470' LAST_MODIFIED='1396418470'>Support and Downloads</A> <DT><A HREF='http://www.intel.com/go/getwimax' ADD_DATE='1396418470' LAST_MODIFIED='1396418470'>The Intel WiMAX website</A> <DT><A HREF='http://www.lenovo.com/thinkvantage' ADD_DATE='1396418470' LAST_MODIFIED='1396418470'>ThinkVantage Technologies</A> </DL> <DT><H3 ADD_DATE='1396418466' LAST_MODIFIED='1411870796' PERSONAL_TOOLBAR_FOLDER='true'>书签工具栏</H3> <DD>添加到此文件夹的书签会被显示到书签工具栏中 <DL> <DT><A HREF='place:sort=8&maxResults=10' ADD_DATE='1411870796' LAST_MODIFIED='1411870796'>访问最多</A> <DT><H3 ADD_DATE='1396418467' LAST_MODIFIED='1396418468'>火狐官方站点</H3> <DL> <DT><A HREF='http://mozilla.com.cn/?src=ffpage' ADD_DATE='1396418467' LAST_MODIFIED='1396418467'>火狐社区</A> <DT><A HREF='http://diy.mozilla.com.cn/?src=ffpage' ADD_DATE='1396418467' LAST_MODIFIED='1396418467'>火狐DIY</A> <DT><A HREF='http://mozilla.com.cn/topic/1/?src=ffpage' ADD_DATE='1396418467' LAST_MODIFIED='1396418467'>火狐扩展精选</A> <DT><A HREF='http://firefox01.taobao.com/' ADD_DATE='1396418467' LAST_MODIFIED='1396418467'>火狐商店</A> <DT><A HREF='http://www.firefox.com.cn/' ADD_DATE='1396418468' LAST_MODIFIED='1396418468'>谋智网络官方网站</A> <DT><A HREF='http://www.firefoxchina.cn/' ADD_DATE='1396418468' LAST_MODIFIED='1396418468'>火狐中文网</A> <DT><A HREF='http://i.firefoxchina.cn/?src=ffpage' ADD_DATE='1396418468' LAST_MODIFIED='1396418468'>火狐主页</A> </DL> <DT><A HREF='http://www.mozilla.com/zh-CN/firefox/central/' ADD_DATE='1396418467' LAST_MODIFIED='1396418467'>新手上路</A> <DT><H3 ADD_DATE='1396418468' LAST_MODIFIED='1396418469'>常用网址</H3> <DL> <DT><A HREF='http://www.baidu.com/index.php?tn=monline_5_dg' ADD_DATE='1396418468' LAST_MODIFIED='1396418468'>百度</A> <DT><A HREF='http://www.sina.com.cn/' ADD_DATE='1396418468' LAST_MODIFIED='1396418468'>新浪</A> <DT><A HREF='http://weibo.com/' ADD_DATE='1396418468' LAST_MODIFIED='1396418468'>新浪微博</A> <DT><A HREF='http://www.163.com/' ADD_DATE='1396418468' LAST_MODIFIED='1396418468'>网易</A> <DT><A HREF='http://youku.com/' ADD_DATE='1396418469' LAST_MODIFIED='1396418469'>优酷网</A> <DT><A HREF='http://www.renren.com/' ADD_DATE='1396418469' LAST_MODIFIED='1396418469'>人人网</A> <DT><A HREF='http://click.mz.simba.taobao.com/rd?w=mmp4ptest&f=http%3A%2F%2Fwww.taobao.com%2Fgo%2Fchn%2Ftbk_channel%2Fonsale.php%3Fpid%3Dmm_28347190_2425761_9313996&k=e02915d8b8ad9603' ADD_DATE='1396418469' LAST_MODIFIED='1396418469'>淘宝特卖</A> <DT><A HREF='http://www.tmall.com/go/chn/tbk_channel/tmall_new.php?pid=mm_28347190_2425761_9313996&eventid=101334' ADD_DATE='1396418469' LAST_MODIFIED='1396418469'>淘宝商城</A> <DT><A HREF='http://www.amazon.cn/?source=Mozilla' ADD_DATE='1396418469' LAST_MODIFIED='1396418469'>卓越亚马逊</A> <DT><A HREF='http://www.vancl.com/?source=mozilla' ADD_DATE='1396418469' LAST_MODIFIED='1396418469'>凡客诚品</A> <DT><A HREF='http://r.union.meituan.com/url/visit/?a=1&key=yKmOefsJ5QiYS98RvpLzMN2qxT7BFhr4&url=http://www.meituan.com' ADD_DATE='1396418469' LAST_MODIFIED='1396418469'>美团网</A> <DT><A HREF='http://www.hao123.com/?tn=12092018_12_hao_pg' ADD_DATE='1396418469' LAST_MODIFIED='1396418469'>网址大全</A> <DT><A HREF='http://www.yihaodian.com/product/index.do?merchant=1&tracker_u=1787&tracker_type=1&uid=433588_test_' ADD_DATE='1396418469' LAST_MODIFIED='1396418469'>1号店</A> <DT><A HREF='http://click.union.360buy.com/JdClick/?unionId=20&siteId=433588__&to=http://www.360buy.com' ADD_DATE='1396418469' LAST_MODIFIED='1396418469'>京东商城</A> </DL> </DL> </DL> "
     $ = cheerio.load(xml);

     $("a").each(function() {
     var folderName = $(this).parents("DL").prev().text();
     var link = $(this);

     if(link.attr("href")!=null){
     var parentFolder = link.parents("DL").prev();
     }

     var text = link.text();
     var href = link.attr("href");

     console.log(folderName+' : '+text + " - " + href);
     });

     res.send($.html());

     } */
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    console.log('error on request %d %s %s: %j', process.domain.id, req.method, req.url, err);

    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


app.listen(80);
console.log("listening on 80");
//app.listen(3000);
module.exports = app;
