define(['jquery'], function($) {
	var cache = {cssSupport:{}};
	var Sys = {};
	var ua = navigator.userAgent.toLowerCase();
	var s;
	(s = ua.match(/msie ([\d]+)/)) ? Sys.ie = s[1] :
	(s = ua.match(/firefox\/([\d]+)/)) ? Sys.firefox = s[1] :
	(s = ua.match(/chrome\/([\d]+)/)) ? Sys.chrome = s[1] :
	(s = ua.match(/opera.([\d]+)/)) ? Sys.opera = s[1] :
	(s = ua.match(/version\/([\d]+).*safari/)) ? Sys.safari = s[1] : 0;
	var util = {
		isTouch: function(){
			return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)?true:false;
		},
		/*
		* 判断css属性是否支持
		*/
		cssSupports : (function() { 
			var support = cache.cssSupport;
			return function(prop) {
				var div = document.createElement('div'),
				vendors = 'Khtml O Moz Webkit'.split(' '),
				len = vendors.length, ret = false;
				prop = prop.replace(/-[\w]/g, function(val) {
					return val.toUpperCase().substring(1);
				});
				if(prop in support) return support[prop];
				
				if ('-ms-' + prop in div.style) ret = '-ms-' + prop;
				else{
					prop = prop.replace(/^[a-z]/, function(val) {
						return val.toUpperCase();
					});
					while(len=len-1){
						if (vendors[len] + prop in div.style ){
							ret = vendors[len] + prop;
						};
					}
				}
				
				return support[prop] = ret;
			}
		})(),
		/*
		* 设置css
		*/
		css:  function(element, prop, val) {
			var ret = this.cssSupports(prop);
			if(val === undefined)return element[0] && element[0].style[ret];
			else{
				for(var i=0; i<element.length; i++){
					element[i].style[ret] = val;
				}
			}
		},
		getTop: function(e){ 
			var offset = 0, a = jQuery(e);
			//alert(a.css("position"));
			if(e.offsetParent != null){
				 offset = e.offsetTop;
				 offset += arguments.callee(e.offsetParent); 
				 //alert("relative absolute fixed".indexOf(a.css("position")) + "		"+offset);
			}
			else if(e.offsetParent != null){
				 //alert("relative absolute fixed".indexOf(a.css("position")) + "		"+offset);
			}
			return offset; 
		}, 
		getLeft: function(e){ 
			var offset = 0, a = jQuery(e);; 
			if(e.offsetParent != null/* && "relative absolute fixed".indexOf(a.css("position")) == -1*/){
				offset = e.offsetLeft;
				offset += arguments.callee(e.offsetParent);
			}
			return offset; 
		},
		getVersion:function(){
			return Sys;
		},
		/**
		* 气泡效果的浏览器兼容性处理，有注册事件功能
		* @param: {jQuery} $trigger 触发器元素
		* @param: {jQuery} $target 气泡元素
		* @param: {String} $bindTriggerInEvent 触发显示的事件名称
		* @param: {String} $bindTriggerOutEvent 触发隐藏的事件名称
		* @param: {String/Function} $fadeInAnimate 触发显示的动画
		* @param: {String/Function} $fadeOutAnimate 触发隐藏的动画
		* @param: {Function} $preInCallBack 触发显示的动画的预处理回调
		* @param: {Function} $preOutCallBack 触发隐藏的动画的预处理回调
		*/
		convertFade: function($trigger, $target, bindTriggerInEvent, bindTriggerOutEvent, fadeInAnimate, fadeOutAnimate, preInCallBack, preOutCallBack){
			var timer = 0, self = this;;
			if(bindTriggerInEvent && $trigger[bindTriggerInEvent])$trigger[bindTriggerInEvent](function(){
				self.convertFadeCore($trigger, $target, bindTriggerInEvent, '', fadeInAnimate, fadeOutAnimate, preInCallBack, preOutCallBack);
            })
			if(bindTriggerOutEvent && $trigger[bindTriggerOutEvent])$trigger[bindTriggerOutEvent](function(){
                self.convertFadeCore($trigger, $target, '', bindTriggerOutEvent, fadeInAnimate, fadeOutAnimate, preInCallBack, preOutCallBack);
            });
		},
		/**
		* 气泡效果的浏览器兼容性处理，无注册事件功能
		* @param: {jQuery} $trigger 触发器元素
		* @param: {jQuery} $target 气泡元素
		* @param: {String} $bindTriggerInEvent 触发显示的事件名称
		* @param: {String} $bindTriggerOutEvent 触发隐藏的事件名称
		* @param: {String/Function} $fadeInAnimate 触发显示的动画
		* @param: {String/Function} $fadeOutAnimate 触发隐藏的动画
		* @param: {Function} $preInCallBack 触发显示的动画的预处理回调
		* @param: {Function} $preOutCallBack 触发隐藏的动画的预处理回调
		*/
		convertFadeCore: function($trigger, $target, bindTriggerInEvent, bindTriggerOutEvent, fadeInAnimate, fadeOutAnimate, preInCallBack, preOutCallBack){
			if(bindTriggerInEvent && $trigger[bindTriggerInEvent]){
                var timer = $target.data('convertTimer');
                if(timer){
                    clearTimeout(timer);
                }
                if(preInCallBack)preInCallBack.call($target, $target);
                $target.convert(function(){
					this.show().removeClass(fadeOutAnimate).addClass('animated').addClass(fadeInAnimate);
				}, 'show', 'show');
            }
			if(bindTriggerOutEvent && $trigger[bindTriggerOutEvent]){
                if(preOutCallBack)preOutCallBack.call($target, $target);
                 $target.convert(function(){

					this.removeClass(fadeInAnimate).addClass('animated').addClass(fadeOutAnimate);
					var self = this;
					var timer = setTimeout(function(){
						self.hide();
					}, 150);
                    $target.data('convertTimer', timer);
				}, 'hide', 'hide');
            };
		},

		/*
		 * @param: d 父节点
		 *
		 */
		timeLeft: function(d){
		    var c = d, 
		    	// 服务器当前时间
		    	st = parseInt(c.attr("server-time")), 
		    	// 倒计时剩余时间
		    	srt = parseInt(c.attr("remaining-time")),
		    	// 服务器结束时间
		    	b = st + srt,
		    	e;
		    function a(i) {
		        var g = (new Date()).getTime(), 
		            l = i,
		            // 剩余毫秒数 
		            f = l - g, 
		            // 剩余秒数
		            n = parseInt(f / 1000), 
		            // 剩余天数
		            m = Math.floor((n / (24 * 60 * 60))), 
		            // 小时数
		            k = Math.floor(((n - m * 24 * 60 * 60) / (60 * 60))), 
		            // 分钟数
		            j = Math.floor((n - m * 24 * 60 * 60 - k * 3600) / 60), 
		            // 秒数
		            h = Math.floor(n - m * 24 * 60 * 60 - k * 3600 - j * 60);
		        if (f < 0) {
		            clearInterval(e);
		            c.find(".days").text("00").end().find(".hours").text("00").end().find(".minutes").text("00").end().find(".secs").text("00");
		        } else {
		            c.find(".days").text(m < 10 ? ("0" + m) : m).end().find(".hours").text(k < 10 ? ("0" + k) : k).end().find(".minutes").text(j < 10 ? ("0" + j) : j).end().find(".secs").text(h < 10 ? ("0" + h) : h);
		        }
		    }
		    e = setInterval(function() {
		        a(b);
		    }, 1000);
		},
		/*
		 *	倒计时控件
		 *	html定义格式，可以定义多个这种类型的html
		 *	<div class="J-time" server-time="1425281766132" remaining-time="55555555">
		 *		<i class="days">00</i>天
		 *		<i class="split"></i>
		 *		<i class="hours">00</i>
		 *		<i class="split">:</i>
		 *		<i class="minutes">00</i>
		 *		<i class="split">:</i>
		 *		<i class="secs">00</i>
		 *	</div>
		 *
		 * 	调用方法
		 *
		 *	$(function() {
		 *		util.timeLeftShow();
		 *	});
		 */
		timeLeftShow: function() {
			// 父标签
		    var a = $(".J-time");
		    a.each(function(b) {
		        RemainingTime.timeLeft(a.eq(b));
		    });
		},

		/*
		* 页面初始化操作，解决ie6 a标签不能提交及设置按钮使用间隔2s
		*/
		init:function(){
			var self = this;
            /*hover事件延迟执行
             * @param handlerIn 淡入回调
             * @param handlerOut 淡出回调
             * @param delayInTime 淡入延迟时间
             * @param delayOutTime 淡出延迟时间
             * @param [showHideElement] 固定的气泡元素
             * @param [showHideElementParent] 固定的气泡元素移入触发元素的
             */
            $.fn.delayHover = function (handlerIn, handlerOut, delayInTime, delayOutTime, showHideElement, showHideElementParent) {
                var detailTimer = 0, stopTimer = false, lastTime = new Date(), self = this;
                this.hover(function (event) {
                    if (detailTimer)clearTimeout(detailTimer);
                    var self = this;
                    detailTimer = setTimeout(function () {
                        var current = event.toElement || event.target || event.currentTarget;
                        if (current == self){
                            if (detailTimer)clearTimeout(detailTimer);
                            handlerIn();
                        }
                    }, delayInTime || 0);
                }, function (event) {
                    if (detailTimer)clearTimeout(detailTimer);
                    detailTimer = setTimeout(function () {
                        handlerOut();
                    }, delayOutTime || 150);
                });
                if (showHideElement)showHideElement.hover(function () {
                    if (detailTimer)clearTimeout(detailTimer);
                }, function (event) {
                    if (detailTimer)clearTimeout(detailTimer);
                    detailTimer = setTimeout(function () {
                        var current = event.relatedTarget || event.toElement || event.fromElement;
                        if (current != self[0]
                            && current != showHideElement[0]){
                            if (detailTimer)clearTimeout(detailTimer);
                            handlerOut();
                        }
                    }, delayOutTime || 150);
                });
            }
			$.fn.css3 = function(prop, val){
				this.each(function(i, e){
					self.cssSet(e, prop, val);
				});
				return this;
			}
			/**
			* 浏览器兼容性处理，新浏览器使用css3的animate， 普通浏览器使用js的animate， ie6使用直接隐藏或显示
			* @param: {String/Function} css3Animate css3的动画
			* @param: {String/Function} jsAnimate js的动画
			* @param: {String/Function} ie6Animate ie6的动画
			*/
			$.fn.convert = function(css3Animate, jsAnimate, ie6Animate){
				if(Sys.ie<=6){
					if(typeof ie6Animate === 'string'){
						if(this[ie6Animate])this[ie6Animate]();
					}
					else if(typeof ie6Animate === 'function'){
						if(this[ie6Animate])this[ie6Animate].apply(this);
					}
				}
				else if(self.cssSupports('animation')){
					if(typeof css3Animate === 'string'){
						this.addClass(css3Animate);
					}
					else if(typeof css3Animate === 'function'){
						if(css3Animate)css3Animate.apply(this);
					}
				}
				else{
					if(typeof jsAnimate === 'string'){
						if(this[jsAnimate])this[jsAnimate]();
					}
					else if(typeof jsAnimate === 'function'){
						if(jsAnimate)jsAnimate.apply(this);
					}
				}
			}
		}
	}
	util.init();
	return util;
});
