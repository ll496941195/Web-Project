define(['jquery'], function($) {
	function addTimeStamp(url){
		if(url.indexOf('?') > 0){
			return url + "&ts=" + new Date().getTime();
		}
		else{
			return url + "?ts=" + new Date().getTime();
		}
		
	}
	function ajax(url, success, fail){
		$.ajax(addTimeStamp(url),{dataType:"json"})
	　　.done(function(data){
			if(success){
				success(data);
			}
		})
	　　.fail(function(){
			if(fail){
				fail();
			}
		});
	}
	if(typeof ajaxUrl == 'undefined'){
		ajaxUrl = {
			// 资产
			queryAccountAssets: "scripts/data/data-opened/easyPayAsset.js?ajax=true",
		};
	}
	return {
		// 资产获取
		getEasePayAsset: function(success, fail){
			var url = ajaxUrl.queryAccountAssets;
			ajax(url, success, fail);
		}
	}
});