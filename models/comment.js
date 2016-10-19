var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Comment = new Schema({

	content: {type: String, require:true},   //评论内容
	author: {type: Schema.Types.ObjectId,ref:'User'}, //作者，定义外键
	time : Date   //评论发布时间

});


module.exports = mongoose.model('comment', Comment);
