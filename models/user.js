var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: { type: String },
    userId: { type: String },
    historyUserId: { type: String },
    password: { type: String },
    type: { type: String }
});

mongoose.model('User', schema);
