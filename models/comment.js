/*
* comment.js
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user.js');
var Blog = require('./blog.js');

var Comment = new Schema({
	author: {type: Schema.Types.ObjectId,ref:'user'}, //作者，定义外键
	content: {type: String, require:true},   //评论内容
	blog: {type: Schema.Types.ObjectId,ref:'Blog'},
	time : Date,   //评论发布时间
	recommend: Number
});


module.exports = mongoose.model('comment', Comment);
