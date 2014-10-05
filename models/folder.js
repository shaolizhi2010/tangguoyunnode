var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var FolderSchema = new Schema({
    name: { type: String },
    bookmarkId: { type: String, ref: 'Bookmark' },
    pid: { type: String, ref: 'Folder' },
    userId: { type: String },
    historyUserId: { type: String },
    folders : [{ type: Schema.Types.ObjectId, ref: 'Folder' }],
    pages : [{ type: Schema.Types.ObjectId, ref: 'Page' }]
});

mongoose.model('Folder', FolderSchema);
