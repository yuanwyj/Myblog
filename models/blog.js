/*
* comment.js
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user.js');


var BlogSchema = new Schema({
	title: {type: String, require: true},    //博客标题
	content: {type: String, require: true},    //博客内容
	author: {type: Schema.Types.ObjectId,ref:'user'}, //作者，定义外键
	time : Date, //博客发布时间
	recommend: Number   //博客被赞次数
});


module.exports = mongoose.model('blog', BlogSchema);
