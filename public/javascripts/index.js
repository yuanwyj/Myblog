/**
*author: yuanzp
*date : 2016/10/21
**/
$(function() {
	var errorTip = '<div id="errorTip" class="alert alert-warning">{0}</div> ',
		errmessage = '<div id="errmessage" class="alert">{0}</div>',
        title = $('#blog-title'),
        titleval = $.trim(title.val()),
        content = $('.form-control'),
        contentval = $.trim(content.val()),
        currentURL = window.location.origin;

    String.prototype.format = function (args) {
            var result = this;
            if (arguments.length > 0) {
                if (arguments.length == 1 && typeof (args) == "object") {
                    for (var key in args) {
                        if (args[key] != undefined) {
                            var reg = new RegExp("({" + key + "})", "g");
                            result = result.replace(reg, args[key]);
                        }
                    }
                }
                else {
                    for (var i = 0; i < arguments.length; i++) {
                        if (arguments[i] != undefined) {
                            var reg = new RegExp("({)" + i + "(})", "g");
                            result = result.replace(reg, arguments[i]);
                        }
                    }
                }
            }
            return result;
    }

	$("#issue-blog").on('click',function() {
		$("#errorTip").remove();
		$("#post-blog").toggle();
	});
	$("#form-close").on('click',function() {
		$("#errorTip").remove();
		$("#post-blog").toggle();
	});

	/*
	* 在点击发布按钮之后验证博客内容
	*/
	
	$("#issue").on('click',function() {
		var
		title = $('#blog-title'),
        titleval = $.trim(title.val()),
        content = $('.form-control'),
        contentval = $.trim(content.val());

		$("#errorTip").remove();

		if (titleval.length == 0) {
			$(".err-message").prepend(errorTip.format('文章标题不能为空')); 	
			return false;
		}

		if ( contentval.length == 0) {
			$(".err-message").prepend(errorTip.format('文章内容不能为空')); 
			return false;
		}
	});
	
		/*
		* 博客输入框文本设置
		*/

		// 重置文本
		$("#resetting").on('click',function() {
			contentval = "";
			content.val(contentval); 
			content.focus();

		});

		// 文本居中
		$("#center").on('click',function() {
			content.css("text-align","center");
			content.focus();
		});

		// 文本居右
		$("#right").on('click',function() {
			content.css("text-align","right");
			content.focus();
		});

		// 文本居左
		$("#left").on('click',function() {
			content.css("text-align","left");
			content.focus();
		});

		// 查找博客
		$("#searchblog").on('click',function() {
			var searchInfo = $('.searchInfo'),
        		searchInfoval = $.trim(searchInfo.val()); 
        		errmessage = '<div id="errmessage" class="alert">{0}</div>';

        	$(".infosearch #errmessage").remove();	
			if (searchInfoval.length == 0) {
				
				$(".infosearch").prepend(errmessage.format('搜索内容不能为空')); 
				return false;
			} else {
				// $.post(currentURL+ "/search/"+searchInfoval,function(err,blog) {
				// 	if (blogs == false) {
				// 		$("infosearch").prepend(errmessage.format('未找到搜索内容')); 
				// 		alert(blogs);
				// 	} else {
				// 		var blog = JSON.parse(blog);
				// 		alert(blog);

				// 		for(var i = 0; i < blogs.length; i++) {
				// 			var li = $("<li>");

				// 		}
						
				// 	}
				// });


         $.ajax({  
             url: currentURL+ "/search/"+searchInfoval,  
             type: 'POST',  
             dataType: 'json',  
             timeout: 1000,  
             cache: false,  
             beforeSend: LoadFunction, //加载执行方法    
             error: erryFunction,  //错误执行方法    
             success: succFunction //成功执行方法    
        });
         function LoadFunction() {  
             $("#list").html('加载中...');  
         }  
         function erryFunction() {  
             alert("error");  
         }  
         function succFunction(blogs) {  
         	alert(blogs[0].title);
             $("#list").html('');  
  
             //eval将字符串转成对象数组  
             //var json = { "id": "10086", "uname": "zhangsan", "email": "zhangsan@qq.com" };  
             //json = eval(json);  
             //alert("===json:id=" + json.id + ",uname=" + json.uname + ",email=" + json.email);  
  
             var json = eval(blogs); //数组         
             $.each(json, function (index, item) {  
                 //循环获取数据    
                 var name = json[index].Name;  
                 var idnumber = json[index].IdNumber;  
                 var sex = json[index].Sex;  
                 $("#list").html($("#list").html() + "<br>" + name + " - " + idnumber + " - " + sex + "<br/>");  
             });  
         }  

			}
		});
});