/**
*author: yuanzp
*date : 2016/10/26
**/

$(function() {
	var currentURL = window.location.origin;
	var blogId = $("#zan img").attr("name");
	$("#zan").on('click',function() {
		$.post(currentURL + '/zanblog/'+ blogId,function(err,blog) {

		});
		$(this).css({'background-color':'#555'});
	});
});