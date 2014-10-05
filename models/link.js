var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    url: { type: String },
    desc: { type: String },
    title: { type: String },
    favicon: { type: String }, //网站图标
    shows: { type: Number }, //展现次数
    clicks: { type: Number }, //点击次数
    //clickUserNumber: { type: Number }, //点击链接的会员数
    keeps: { type: Number }, //收藏次数
    ups: { type: Number }, //顶 次数
    downs: { type: Number } //踩 次数
});

mongoose.model('Link', schema);
