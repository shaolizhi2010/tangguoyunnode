var cheerio = require('cheerio');
var mongoose = require('mongoose');

var folder = require('../proxy').Folder;
var page = require('../proxy').Page;


exports.importPages = function (req, res, next) {

    var xml = "  <DL> <DT><A HREF='place:folder=BOOKMARKS_MENU&folder=UNFILED_BOOKMARKS&folder=TOOLBAR&queryType=1&sort=12&maxResults=10&excludeQueries=1' ADD_DATE='1411870796' LAST_MODIFIED='1411870796'>最近使用的书签</A> <DT><A HREF='place:type=6&sort=14&maxResults=10' ADD_DATE='1411870796' LAST_MODIFIED='1411870796'>最近使用的标签</A> <HR>    <DT><H3 ADD_DATE='1396418467' LAST_MODIFIED='1396418467'>Mozilla Firefox</H3> <DL> <DT><A HREF='http://www.mozilla.com/zh-CN/firefox/help/' ADD_DATE='1396418467' LAST_MODIFIED='1396418467' ICON_URI='http://www.mozilla.org/2005/made-up-favicon/0-1396418467354' ICON='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHWSURBVHjaYvz//z8DJQAggJiQOe/fv2fv7Oz8rays/N+VkfG/iYnJfyD/1+rVq7ffu3dPFpsBAAHEAHIBCJ85c8bN2Nj4vwsDw/8zQLwKiO8CcRoQu0DxqlWrdsHUwzBAAIGJmTNnPgYa9j8UqhFElwPxf2MIDeIrKSn9FwSJoRkAEEAM0DD4DzMAyPi/G+QKY4hh5WAXGf8PDQ0FGwJ22d27CjADAAIIrLmjo+MXA9R2kAHvGBA2wwx6B8W7od6CeQcggKCmCEL8bgwxYCbUIGTDVkHDBia+CuotgACCueD3TDQN75D4xmAvCoK9ARMHBzAw0AECiBHkAlC0Mdy7x9ABNA3obAZXIAa6iKEcGlMVQHwWyjYuL2d4v2cPg8vZswx7gHyAAAK7AOif7SAbOqCmn4Ha3AHFsIDtgPq/vLz8P4MSkJ2W9h8ggBjevXvHDo4FQUQg/kdypqCg4H8lUIACnQ/SOBMYI8bAsAJFPcj1AAEEjwVQqLpAbXmH5BJjqI0gi9DTAAgDBBCcAVLkgmQ7yKCZxpCQxqUZhAECCJ4XgMl493ug21ZD+aDAXH0WLM4A9MZPXJkJIIAwTAR5pQMalaCABQUULttBGCCAGCnNzgABBgAMJ5THwGvJLAAAAABJRU5ErkJggg=='>帮助和教程</A> <DT><A HREF='http://www.mozilla.com/zh-CN/firefox/customize/' ADD_DATE='1396418467' LAST_MODIFIED='1396418467' ICON_URI='http://www.mozilla.org/2005/made-up-favicon/1-1396418467360' ICON='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHWSURBVHjaYvz//z8DJQAggJiQOe/fv2fv7Oz8rays/N+VkfG/iYnJfyD/1+rVq7ffu3dPFpsBAAHEAHIBCJ85c8bN2Nj4vwsDw/8zQLwKiO8CcRoQu0DxqlWrdsHUwzBAAIGJmTNnPgYa9j8UqhFElwPxf2MIDeIrKSn9FwSJoRkAEEAM0DD4DzMAyPi/G+QKY4hh5WAXGf8PDQ0FGwJ22d27CjADAAIIrLmjo+MXA9R2kAHvGBA2wwx6B8W7od6CeQcggKCmCEL8bgwxYCbUIGTDVkHDBia+CuotgACCueD3TDQN75D4xmAvCoK9ARMHBzAw0AECiBHkAlC0Mdy7x9ABNA3obAZXIAa6iKEcGlMVQHwWyjYuL2d4v2cPg8vZswx7gHyAAAK7AOif7SAbOqCmn4Ha3AHFsIDtgPq/vLz8P4MSkJ2W9h8ggBjevXvHDo4FQUQg/kdypqCg4H8lUIACnQ/SOBMYI8bAsAJFPcj1AAEEjwVQqLpAbXmH5BJjqI0gi9DTAAgDBBCcAVLkgmQ7yKCZxpCQxqUZhAECCJ4XgMl493ug21ZD+aDAXH0WLM4A9MZPXJkJIIAwTAR5pQMalaCABQUULttBGCCAGCnNzgABBgAMJ5THwGvJLAAAAABJRU5ErkJggg=='>自定义 Firefox</A> <DT><A HREF='http://www.mozilla.com/zh-CN/firefox/community/' ADD_DATE='1396418467' LAST_MODIFIED='1396418467' ICON_URI='http://www.mozilla.org/2005/made-up-favicon/2-1396418467367' ICON='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHWSURBVHjaYvz//z8DJQAggJiQOe/fv2fv7Oz8rays/N+VkfG/iYnJfyD/1+rVq7ffu3dPFpsBAAHEAHIBCJ85c8bN2Nj4vwsDw/8zQLwKiO8CcRoQu0DxqlWrdsHUwzBAAIGJmTNnPgYa9j8UqhFElwPxf2MIDeIrKSn9FwSJoRkAEEAM0DD4DzMAyPi/G+QKY4hh5WAXGf8PDQ0FGwJ22d27CjADAAIIrLmjo+MXA9R2kAHvGBA2wwx6B8W7od6CeQcggKCmCEL8bgwxYCbUIGTDVkHDBia+CuotgACCueD3TDQN75D4xmAvCoK9ARMHBzAw0AECiBHkAlC0Mdy7x9ABNA3obAZXIAa6iKEcGlMVQHwWyjYuL2d4v2cPg8vZswx7gHyAAAK7AOif7SAbOqCmn4Ha3AHFsIDtgPq/vLz8P4MSkJ2W9h8ggBjevXvHDo4FQUQg/kdypqCg4H8lUIACnQ/SOBMYI8bAsAJFPcj1AAEEjwVQqLpAbXmH5BJjqI0gi9DTAAgDBBCcAVLkgmQ7yKCZxpCQxqUZhAECCJ4XgMl493ug21ZD+aDAXH0WLM4A9MZPXJkJIIAwTAR5pQMalaCABQUULttBGCCAGCnNzgABBgAMJ5THwGvJLAAAAABJRU5ErkJggg=='>加入进来</A> <DT><A HREF='http://www.mozilla.com/zh-CN/about/' ADD_DATE='1396418467' LAST_MODIFIED='1396418467' ICON_URI='http://www.mozilla.org/2005/made-up-favicon/3-1396418467371' ICON='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHWSURBVHjaYvz//z8DJQAggJiQOe/fv2fv7Oz8rays/N+VkfG/iYnJfyD/1+rVq7ffu3dPFpsBAAHEAHIBCJ85c8bN2Nj4vwsDw/8zQLwKiO8CcRoQu0DxqlWrdsHUwzBAAIGJmTNnPgYa9j8UqhFElwPxf2MIDeIrKSn9FwSJoRkAEEAM0DD4DzMAyPi/G+QKY4hh5WAXGf8PDQ0FGwJ22d27CjADAAIIrLmjo+MXA9R2kAHvGBA2wwx6B8W7od6CeQcggKCmCEL8bgwxYCbUIGTDVkHDBia+CuotgACCueD3TDQN75D4xmAvCoK9ARMHBzAw0AECiBHkAlC0Mdy7x9ABNA3obAZXIAa6iKEcGlMVQHwWyjYuL2d4v2cPg8vZswx7gHyAAAK7AOif7SAbOqCmn4Ha3AHFsIDtgPq/vLz8P4MSkJ2W9h8ggBjevXvHDo4FQUQg/kdypqCg4H8lUIACnQ/SOBMYI8bAsAJFPcj1AAEEjwVQqLpAbXmH5BJjqI0gi9DTAAgDBBCcAVLkgmQ7yKCZxpCQxqUZhAECCJ4XgMl493ug21ZD+aDAXH0WLM4A9MZPXJkJIIAwTAR5pQMalaCABQUULttBGCCAGCnNzgABBgAMJ5THwGvJLAAAAABJRU5ErkJggg=='>关于我们</A> </DL> <DT><H3 ADD_DATE='1396418470' LAST_MODIFIED='1396418470'>Lenovo Recommended Websites</H3> <DL> <DT><A HREF='http://www.lenovo.com/welcome/thinkpad' ADD_DATE='1396418470' LAST_MODIFIED='1396418470'>Home</A> <DT><A HREF='http://www.mylenovocloud.com/' ADD_DATE='1396418470' LAST_MODIFIED='1396418470'>My Lenovo Cloud</A> <DT><A HREF='http://www.lenovo.com/news/cn/zh' ADD_DATE='1396418470' LAST_MODIFIED='1396418470'>News</A> <DT><A HREF='http://www.lenovo.com/register' ADD_DATE='1396418470' LAST_MODIFIED='1396418470'>Product Registration</A> <DT><A HREF='http://www.lenovo.com/products/cn/zh' ADD_DATE='1396418470' LAST_MODIFIED='1396418470'>Products</A> <DT><A HREF='http://www.lenovo.com/accessories' ADD_DATE='1396418470' LAST_MODIFIED='1396418470'>Services, Software, and Accessories</A> <DT><A HREF='http://www.lenovo.com/support' ADD_DATE='1396418470' LAST_MODIFIED='1396418470'>Support and Downloads</A> <DT><A HREF='http://www.intel.com/go/getwimax' ADD_DATE='1396418470' LAST_MODIFIED='1396418470'>The Intel WiMAX website</A> <DT><A HREF='http://www.lenovo.com/thinkvantage' ADD_DATE='1396418470' LAST_MODIFIED='1396418470'>ThinkVantage Technologies</A> </DL> <DT><H3 ADD_DATE='1396418466' LAST_MODIFIED='1411870796' PERSONAL_TOOLBAR_FOLDER='true'>书签工具栏</H3> <DD>添加到此文件夹的书签会被显示到书签工具栏中 <DL> <DT><A HREF='place:sort=8&maxResults=10' ADD_DATE='1411870796' LAST_MODIFIED='1411870796'>访问最多</A> <DT><H3 ADD_DATE='1396418467' LAST_MODIFIED='1396418468'>火狐官方站点</H3> <DL> <DT><A HREF='http://mozilla.com.cn/?src=ffpage' ADD_DATE='1396418467' LAST_MODIFIED='1396418467'>火狐社区</A> <DT><A HREF='http://diy.mozilla.com.cn/?src=ffpage' ADD_DATE='1396418467' LAST_MODIFIED='1396418467'>火狐DIY</A> <DT><A HREF='http://mozilla.com.cn/topic/1/?src=ffpage' ADD_DATE='1396418467' LAST_MODIFIED='1396418467'>火狐扩展精选</A> <DT><A HREF='http://firefox01.taobao.com/' ADD_DATE='1396418467' LAST_MODIFIED='1396418467'>火狐商店</A> <DT><A HREF='http://www.firefox.com.cn/' ADD_DATE='1396418468' LAST_MODIFIED='1396418468'>谋智网络官方网站</A> <DT><A HREF='http://www.firefoxchina.cn/' ADD_DATE='1396418468' LAST_MODIFIED='1396418468'>火狐中文网</A> <DT><A HREF='http://i.firefoxchina.cn/?src=ffpage' ADD_DATE='1396418468' LAST_MODIFIED='1396418468'>火狐主页</A> </DL> <DT><A HREF='http://www.mozilla.com/zh-CN/firefox/central/' ADD_DATE='1396418467' LAST_MODIFIED='1396418467'>新手上路</A> <DT><H3 ADD_DATE='1396418468' LAST_MODIFIED='1396418469'>常用网址</H3> <DL> <DT><A HREF='http://www.baidu.com/index.php?tn=monline_5_dg' ADD_DATE='1396418468' LAST_MODIFIED='1396418468'>百度</A> <DT><A HREF='http://www.sina.com.cn/' ADD_DATE='1396418468' LAST_MODIFIED='1396418468'>新浪</A> <DT><A HREF='http://weibo.com/' ADD_DATE='1396418468' LAST_MODIFIED='1396418468'>新浪微博</A> <DT><A HREF='http://www.163.com/' ADD_DATE='1396418468' LAST_MODIFIED='1396418468'>网易</A> <DT><A HREF='http://youku.com/' ADD_DATE='1396418469' LAST_MODIFIED='1396418469'>优酷网</A> <DT><A HREF='http://www.renren.com/' ADD_DATE='1396418469' LAST_MODIFIED='1396418469'>人人网</A> <DT><A HREF='http://click.mz.simba.taobao.com/rd?w=mmp4ptest&f=http%3A%2F%2Fwww.taobao.com%2Fgo%2Fchn%2Ftbk_channel%2Fonsale.php%3Fpid%3Dmm_28347190_2425761_9313996&k=e02915d8b8ad9603' ADD_DATE='1396418469' LAST_MODIFIED='1396418469'>淘宝特卖</A> <DT><A HREF='http://www.tmall.com/go/chn/tbk_channel/tmall_new.php?pid=mm_28347190_2425761_9313996&eventid=101334' ADD_DATE='1396418469' LAST_MODIFIED='1396418469'>淘宝商城</A> <DT><A HREF='http://www.amazon.cn/?source=Mozilla' ADD_DATE='1396418469' LAST_MODIFIED='1396418469'>卓越亚马逊</A> <DT><A HREF='http://www.vancl.com/?source=mozilla' ADD_DATE='1396418469' LAST_MODIFIED='1396418469'>凡客诚品</A> <DT><A HREF='http://r.union.meituan.com/url/visit/?a=1&key=yKmOefsJ5QiYS98RvpLzMN2qxT7BFhr4&url=http://www.meituan.com' ADD_DATE='1396418469' LAST_MODIFIED='1396418469'>美团网</A> <DT><A HREF='http://www.hao123.com/?tn=12092018_12_hao_pg' ADD_DATE='1396418469' LAST_MODIFIED='1396418469'>网址大全</A> <DT><A HREF='http://www.yihaodian.com/product/index.do?merchant=1&tracker_u=1787&tracker_type=1&uid=433588_test_' ADD_DATE='1396418469' LAST_MODIFIED='1396418469'>1号店</A> <DT><A HREF='http://click.union.360buy.com/JdClick/?unionId=20&siteId=433588__&to=http://www.360buy.com' ADD_DATE='1396418469' LAST_MODIFIED='1396418469'>京东商城</A> </DL> </DL> </DL> "

    xml = xml.replace('<p>', '');
    xml = xml.replace('<DT>', '');
    xml = xml.replace('<DD>', '');
    xml = xml.replace('<HR>', '');

    $ = cheerio.load(xml, {
        normalizeWhitespace: true,
        xmlMode: true
    });

    var dlList = $('DL'); //.children
    if (dlList && dlList[0] ) {

            //网址
            //var aList = dl.children;
            // console.log(dl);
            // console.log(dl.name);
            //console.log(dl.attr('type'));
            importSub(dlList[0] , null);

            /*
             aList.each(function(a){
             console.log('insert page : '+ a );
             });
             console.log('insert page end '  );

             //文件夹名称
             var folderNameList = $('this').children("H3");
             aList.each(function(index,folderNameElement){
             console.log('insert page : '+ folderNameElement.text() );
             });
             */

            //子list元素
            // var subDL = dl.children("DL");
            // console.log('handle sublist todo' );

            //dl.children("DL");
            // callback();

        res.send('ok');
    }

    //从根节点向下逐层查找


//
//    $("a").each(function () {
//        var folderName = $(this).parents("DL").prev().text();
//        var link = $(this);
//
//        if (link.attr("href") != null) {
//            var parentFolder = link.parents("DL").prev();
//        }
//
//        var text = link.text();
//        var href = link.attr("href");
//
//        console.log(folderName + ' : ' + text + " - " + href);
//    });


};

//TODO 解决递归异步协调的问题，子文件夹会被解析两次，一次有父文件夹，一次没有 TODO
function importSub(parentElement, parentDBModel) {

   // var model = null;

    if (parentElement.children) {
        parentElement.children.forEach(function (element, index) {
            if (element.type == 'tag') {
                if (element.name == 'A') {    //是网址
/*
                    console.log(element.attribs.HREF);
                    console.log(element.children[0].data);
                    console.log(getParentFolderName(element));

                    if (parentDBModel) { //
                        page.newAndSave( parentDBModel._id.toString()  , element.children[0].data, element.attribs.HREF, 'imp', function (err, doc) {
                            if (err) {
                                console.log(err);
                            }
                        });
                    } else {
                        page.newAndSave(null, element.children[0].data, element.attribs.HREF, 'imp', function (err, doc) {
                            if (err) {
                                console.log(err);
                            }
                        });
                    }

                    console.log('--------------');*/
                }
                else if (element.name == 'H3') { //是收藏夹
                    console.log(element.children[0].data);
                    console.log("parent folder of folder : " + getParentFolderName(element));


                    if (parentDBModel) {//子目录 或书签
                        //init model
                        folder.newAndSave(element.children[0].data, parentDBModel._id.toString(), 'imp', function (err, doc) {
                            if (err) {
                                console.log(err);
                            }
                            importSub( getNextByName(element,'DL') , doc);
                        });
                        //set parent model
                        //save

                    }
                    else {//根目录
                        //save
                        folder.newAndSave(element.children[0].data, null, 'imp', function (err, doc) {
                            if (err) {
                                console.log(err);
                            }
                            importSub(getNextByName(element,'DL') , doc);
                        });


                    }
                    console.log('----------------------------------------------------');
                }
                else{
                    importSub(element, parentDBModel);
                }

            }
            else{
              //  importSub(element, parentDBModel);
            }
            // console.log(element.name);



        });
    }
}


//向前 递归寻找元素
function getPrevByName(element, name) {

    if (element && element.prev) {

        if (element.prev.name && element.prev.name == name) {
            return element.prev;
        }
        else {
            return getPrevByName(element.prev, name);
        }
    }
    else {
        return null;
    }

}

//向前 递归寻找元素
function getNextByName(element, name) {

    if (element && element.next) {

        if (element.next.name && element.next.name == name) {
            return element.next;
        }
        else {
            return getNextByName(element.next, name);
        }
    }
    else {
        return null;
    }

}

//向父级 递归寻找元素
function getParentByName(element, name) {

    if (element && element.parent) {

        if (element.parent.name && element.parent.name == name) {
            return element.parent;
        }
        else {
            return getParentByName(element.parent, name);
        }
    }
    else {
        return null;
    }

}


function getParentFolderName(element) {
    try {
        var parent = getParentByName(element, "DL");
        var prev = getPrevByName(parent, 'H3');
        if (prev) {
            return prev.children[0].data;
        } else {
            return '';
        }

    } catch (ex) {
        return '';
    }

}

function getParentFolder(element) {
    try {
        var parent = getParentByName(element, "DL");
        if (parent && parent.prev && parent.prev.prev && parent.prev.prev.children[0]) {
            return parent.prev.prev.children[0];
        }
    } catch (ex) {
        return null;
    }

}

function handlePages() {

}

function handleFolders(folder) {

    //check if already exist

    //handle db

    var parentFolder = link.parents("DL").prev();
    if (parentFolder) {
        handleFolders(parentFolder);
    }

}
