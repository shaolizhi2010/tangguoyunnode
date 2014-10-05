var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var schema = new Schema({
    pid: {type: ObjectId, ref: 'Folder' },
    bookmarkId: { type: String, ref: 'Bookmark' },
    userId: { type: String },
    historyUserId: { type: String },
    name: { type: String },
    link: { type: String }
});

mongoose.model('Page', schema);
