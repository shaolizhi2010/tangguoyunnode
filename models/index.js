var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/tgy_bookmark', function (err) {
  if (err) {
    console.error('connect to db error: ', err.message);
    process.exit(1);
  }
});

require('./folder');
require('./page');
require('./user');
require('./bookmark');

exports.Folder = mongoose.model('Folder');
exports.Page = mongoose.model('Page');
exports.User = mongoose.model('User');
exports.Bookmark = mongoose.model('Bookmark');