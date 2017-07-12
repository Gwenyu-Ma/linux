$(function(){
	var winWidth = $(window).width();
	var $downPageNav = $(".down-page-nav");
	var $downPageContent = $(".down-page-content");
	var $navBtn = $(".header a");
	var $userWrap = $(".userWrap");
	var $passWrap = $(".passWrap");
	var $loginBtn = $(".last button");	
	var $errorTip = $(".shadowBox,.errorTip");
	var $errorText = $errorTip.find("span");
	var $errorTipClose = $errorTip.find("a");
	var $downNav = $(".down-page-nav");
	var $downPageContent = $(".down-page-content");
	var isInsert = false;
	var isShowMenu = true;
	/**
	  *适配小屏幕*
	**/
	function adapter(){
		setTimeout(function(){
			if(winWidth <= 768){
				menuHide();
				menuBtn();
			}else{
				menuShow();
				$(document).off("click");
			}
		},500);		
	}
	
	/**
	  *显示菜单*
	*/
	function menuShow(){
		$downPageNav.css({
			"left":"0"
		});
		$downPageContent.css({
			"margin-left":"240px"
		});
		$navBtn.css("display","none");
	}
	
	/**
	  *隐藏菜单*
	*/
	function menuHide(){
		$downPageNav.css({
		   "left":"-240px"
		});
		$downPageContent.css({
			"margin-left":"0"
		});
		$navBtn.css("display","block");
	}
	
	/**
	  *显示菜单按钮*
	*/
	function menuBtn(){
		$navBtn.off("click").on("click",function(){
			menuShow();
			$(document).off("click").on("click",function(e){				
				if($(e.target).closest(".down-page-nav").attr("class") != "down-page-nav" && $(e.target).closest(".fa-bars").attr("class") != "fa fa-bars fa-2x"){
					menuHide();
					$(document).off("click");
				}
			});
		});
	}
	
	/**
	  *缩放窗口*
	*/
	$(window).on("resize",function(){
		winWidth = $(this).width();
		adapter();
	});
	
	/**
	  *创建placehoder*
	*/
	
	function placeholder(){
		var input = document.createElement("input");
		var isPlaceHolder = "placeholder" in input;
		var $userPlaceHolder = null;
		var $passPlaceHolder = null;
		var $userName = null;
		var $pwd = null;
		var ulen = 0;
		var plen = 0;
			
			if(!isPlaceHolder){
				$alphaEle = $("#username,#pwd");
				$userPlaceHolder = $userWrap.find("span").eq(0);
				$passPlaceHolder = $passWrap.find("span").eq(0);
				$userPlaceHolder.removeClass("hide");
				$passPlaceHolder.removeClass("hide");				
				$alphaEle.addClass("alpha");
				
				$alphaEle.on("keyup",function(){
					
					ulen = $(this).val().length;
					
					if(ulen){
						$(this).removeClass("alpha");
					}else{
						$(this).addClass("alpha");
					}
					
				});				
				
			}
	};
	
	/**
	*登录*
	**/
	function login(){
		var isSubmit = false;
		var $uName = $("#username");
		var $uPwd = $("#pwd");
		var $uTip = $userWrap.find(".tip");
		var $pTip = $passWrap.find(".tip");
		
		$uName.on("keyup blur",function(e){
			var val = $.trim($(this).val()).length;
			
			if(val){
				$uTip.addClass("hide");
			}else{
				$uTip.removeClass("hide");
			}
			
			if(e.keyCode == "13"){
				$loginBtn.trigger("click");
			}
		});
		
		$uPwd.on("keyup blur",function(e){
			var val = $.trim($(this).val()).length;
			
			if(val){
				$pTip.addClass("hide");
			}else{
				$pTip.removeClass("hide");
			}
			
			if(e.keyCode == "13"){
				$loginBtn.trigger("click");
			}
		});
		
		$loginBtn.on("click",function(){
			var userName = $.trim($uName.val());
			var password = $.trim($uPwd.val());
			
			if(!userName.length){
				$uTip.removeClass("hide");
			}
			
			if(!password.length){
				$pTip.removeClass("hide");
			}
			
			if(userName.length && password.length){
				isSubmit = true;
				$(".tip").addClass("hide");
			}
			
			if(isSubmit){
				$.ajax({
					url:"../api/auth.php",
					data:{
						"username":userName,
						"password":password
					},
					type:"post",
					dataType:"json",
					success:function(data){
						
						if(data.error){
							errTipBox(data.error);
							return;
						}
						
						location.href = 'index.html';
					}
				});
			}				
		});
	}
	
	/**
	*获取当前包*
	**/
	function currentPack(){
		var $curPack = $("#curPack");
		var strArr = [];
		$.ajax({
			url:"../api/getbase.php",
			type:"post",
			dataType:"json",
			success:function(data){
				var result = data.result;
				var len = result.length;
				var i = 0;
				
				for(i;i < len;i++){
					strArr.push("<tr><td>" + result[i].platform + "</td><td>" + result[i].name + "</td></tr>");
				}

				$curPack.html(strArr.join(""));				
			},error:function(err){
				if(err.status == "401"){
					errTipBox("请先登录！","../public/auth.html");	
				}else{
					errTipBox("服务器端错误！");
				}
			}
		});
	}
	
	/**
	*获取eit*
	**/
	function getEidList(){
		var $curPack = $(".editlist");
		var next = $("tfoot button").eq(1);
		var prev = $("tfoot button").eq(0);
		var windowLink = "javascript:void(0)";
		var strArr = [];
		var page = 1;
		
		function getPage(page){
			
			if(typeof page == "undefined"){
				page = 1;
			}
			
			$.ajax({
				url:"../api/geteids.php",
				type:"get",
				data:{
					"page":page
				},
				dataType:"json",
				success:function(data){
					var result = data.result;
					var len = 0;
					var i = 0;
					strArr = [];
					
					if(result){
						len = result.length
					}else{
						errTipBox(data.error);
						return;
					}
					
					for(i;i < len;i++){
						if(result[i].windows_link){
							windowLink = result[i].windows_link;
						}
						strArr.push("<tr><td>" + result[i].eid + "</td><td><a href='" + result[i].android_link + "'>" + result[i].android_name + "</a></td><td><a href='" + result[i].linux_link + "'>" +  result[i].linux_name + "</a></td><td><a href='" + windowLink + "'>" + result[i].windows_name + "</a></td><td>" + result[i].updated_at + "</td></tr>");
					}
					$curPack.html(strArr.join(""));	
				},error:function(err){
					if(err.status == "401"){
						errTipBox("请先登录！","../public/auth.html");	
					}else{
						errTipBox("服务器端错误！");
					}
				}
			});
		}
		
		next.on("click",function(){
			page++;
			getPage(page)
		});
		
		prev.on("click",function(){
			if(page > 1){
				page--;
				getPage(page)
			}else{
				page = 1;
			}
		});
		getPage();
	}
	
	/**
	*添加eit*
	**/
	function addEid(){
		var $addEid = $(".addEid");
		var $eid = $("#eid");
		
		$addEid.on("click",function(){
			var eid = $.trim($eid.val());
			
			if(eid != ""){
				$.ajax({
					url:"../api/addeid.php",
					type:"get",
					data:{
						"eid":eid
					},
					dataType:"json",
					success:function(data){
						if(data.error){
							errTipBox(data.error);
							return;
						}else{
							errTipBox("添加成功！");
						}						
					}
				});
			}else{
				errTipBox("eid不能为空");
			}
			
		});	
	}
	
	/**
	*上传*
	*/
	function upload(){
		var $platForm = $("#platForm");
		var platFormValue = $platForm.val();
		var $uploadBtn = $(".uploadBtn");
		var $base = $(".upbase");
		var fileName = $base.val();
		var $filePath = $(".filePath");
		var $uploadForm = $("#uploadForm");
		var isSubmit = true;
		
		$(document).on("change",".upbase",function(){
			fileName = $(this).val();
			$filePath.html($(this).val());
		});		 
		
		$uploadBtn.on("click",function(){
			platFormValue = $platForm.val();
			
			if(!platFormValue){
				errTipBox("请选择平台!");
				isSubmit = false;
			}
			
			if(!fileName){
				errTipBox("请选择包!");
				isSubmit = false;
			}
			
			if(platFormValue && fileName){
				isSubmit = true;
			}
			
			if(!isSubmit){
				return false;
			}else{
				$.ajaxFileUpload({  
					fileElementId:"base",  
					url:'../api/upload.php',  
					dataType:"json",  
					data:{
						"platform": platFormValue
					},success: function (data, textStatus) {  
						if(data.error){
							errTipBox(data.error);
						}else{
							errTipBox("上传成功！");
						}	
					},error: function () {  
						errTipBox("服务器端错误！");
					}
			  });  					  
			}
		});
	}
	
	/*
	*错误提示*
	*/
	function errTipBox(text,url){
		$errorTip.removeClass("hide");
		$errorText.text(text);
		$errorTipClose.on("click",function(){
			$errorTip.addClass("hide");
			if(url){
				location.href = url;
			}			
		});			
	}
	
	if(typeof currentPage != "undefined"){
		if(currentPage == "index"){
			currentPack();
		}else if(currentPage == "eids"){
			getEidList();
		}
		
	}	
	
	upload();
	addEid();
	placeholder();
	adapter();
	login();
});