const bookshelf = require('bookshelf');
const connect = require('./connect');
module.exports = bookshelf(connect());
