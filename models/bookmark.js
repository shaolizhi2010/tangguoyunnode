var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Schema = new Schema({
    name: { type: String },
    userId: { type: String },
    historyUserId: { type: String },
    folders : [{ type: Schema.Types.ObjectId, ref: 'Folder' }],
    pages : [{ type: Schema.Types.ObjectId, ref: 'Page' }],
    default: { type: Boolean }
});

mongoose.model('Bookmark', Schema);
