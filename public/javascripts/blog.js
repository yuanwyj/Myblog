/**
*author: yuanzp
*date : 2016/10/26
**/

$(function() {
	var currentURL = window.location.origin;
	var blogId = $("#zan img").attr("name");
	var commendId = $("#commendzan").attr("name");
	$("#zan").on('click',function() {
		if ($("#reg").length > 0) {
			alert("您还没登陆，请登录");
			return false;
		}
		$.post(currentURL + '/zanblog/'+ blogId,function(err,blog) {

		});
		$(this).css({'background-color':'#555'});
	});
	$("#btncomment").on('click',function() {
		if ($("#reg").length > 0) {
			alert("您还没登陆，请登录");
			return false;
		} else {
			return true;
		}
	});

	$("#commendzan").on('click',function() {
		if ($("#reg").length > 0) {
			alert("您还没登陆，请登录");
			return false;
		} else {
			$.post(currentURL + '/commendzan/' + commendId,function(err,result) {
				
			});

		}
	});
});