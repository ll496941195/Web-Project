/** 
 * ==========================================================
 * Copyright
 * Dialog弹窗组件
 * Author: ghj
 * Date: 2014-11-10 10:07:47 318169
 * ==========================================================
 */
;(function($, window, document, undefined) {
	'use strict';
	var defaults = {
		title: '',				// 标题
		content: '',			// 内容
		modal: true,			// 显示遮罩
		fixed: true,			// 固定在页面中间
		width: 450,				// 宽度
		zIndex: 10001,			// zindex
		onMask: $.noop, 		// todo
		onShow: $.noop,			// 显示回调
		onClose: $.noop,		// 关闭回调
		onReset: $.noop,		// 重新计算位置
		css: {},				// css
		maskCss: {				// 遮罩层背景
			opacity: 0.5
		},
		footCss: {},			// 底部css
		showClose: true,		// 显示右上角关闭按钮
		draggable: true, 		// todo
		container: '',			// 容器
		buttonsAlign: 'right',	// 按钮对齐
		buttons: [				// 按钮
			/*{
				value: '取消',
				className: 'btn',
				iconClass: '',
				css: {},
				disabled: false,
				callback: $.noop
			}, {
				value: '确认',
				className: 'btn',
				iconClass: '',
				css: {},
				disabled: false,
				callback: $.noop
			}*/
		]
	};
	var isIE6 = !('minWidth' in $('html')[0].style);
	var HTML = '<div class="ui-dialog-wrap"><div class="ui-dialog-outer"><div class="ui-dialog-inner"><div class="ui-dialog-cont"></div></div></div></div>',
		HEAD = '<div class="ui-dialog-head"><div class="ui-dialog-title"></div><a class="ui-dialog-close">×</a></div>',
		FOOT = '<div class="ui-dialog-foot"></div>',
		MASK = '<div class="ui-dialog-mask"></div>';

	var Dialog = function(options) {
		this.$body = $('body');
		this.$html = $(HTML);
		this.$head = $(HEAD);
		this.$cont = $('.ui-dialog-cont', this.$html);
		this.$foot = $(FOOT);
		this.$mask = $(MASK);

		this.opts = $.extend({}, defaults, options || {});

		this.zIndex = !isNaN(this.opts.zIndex) ? this.opts.zIndex : 1000;

		this.init();
	};

	Dialog.prototype = {

		/** 
		 * 页面初始化
		 * time: 2014-11-10 15:38:29
		 */
		init: function() {
			this.render();
		},

		/** 
		 * 页面渲染
		 * time: 2014-11-10 15:38:34
		 */
		render: function() {
			this.create();
			this.events.close.call(this);
			this.events.resize.call(this);
		},

		/** 
		 * 事件绑定
		 * time: 2014-11-10 15:38:37
		 */
		events: {
			/** 
			 * 右上角关闭事件
			 * time: 2014-11-28 16:15:34
			 */
			close: function() {
				var that = this;
				var $close = $('.ui-dialog-close', this.$head);
				if (!$close) return false;
				$close.click(function() {
					that.close();
				});
			},

			/** 
			 * 改变窗口时重置蒙板/弹窗位置
			 * time: 2014-11-28 16:15:54
			 */
			resize: function() {
				var that = this;
				$(window).resize(function() {
					that.reset();
					that.mask();
				});
			}

			/*drag: function() {
				var that = this;
				var $document = $(document),
					start;
				this.$head.mousedown(function(e) {
					var x = e.pageX,
						y = e.pageY,
						offset = that.$html.offset(),
						maxTop = 0,
						maxRight = $(window).width() - that.$html.outerWidth(),
						maxBottom = $(window).height() - that.$html.outerHeight(),
						maxLeft = 0;

					start = function() {
						$document.on('mousemove', function(e) {
							var style = that.$html[0].style;
							var left = Math.max(Math.min(e.pageX - (x - offset.left), maxRight), maxLeft),
								top = Math.max(Math.min(e.pageY - (y - offset.top), maxBottom), maxTop);
							style.left = left + 'px';
							style.top = top + 'px';
						});
					};
					start();
				});
				this.$head.mouseup(function() {
					start = null;
					$document.off('mousemove');
				});
			}*/
		},

		create: function() {
			this.head();
			this.cont();
			this.foot();
			this.mask();
		},

		show: function() {
			var that = this;		

			this.showMask();
			this.showCont();

			if (typeof this.opts.onShow === 'function') {
				this.opts.onShow.call(this.$html, this.$html, {
					close: function() {
						that.close();
					},
					reset: function() {
						that.reset();
					}
				});
			}
		},
		
		close: function() {
			var self = this;
			this.$html.fadeOut(150);
			this.$mask.fadeOut(150);

			setTimeout(function() {
				self.$html.remove();
				self.$mask.remove();
			}, 250);

			if (typeof this.opts.onClose === 'function') {
				this.opts.onClose.call(this.$html);
			}
		},

		reset: function() {
			/*this.$html.css({
				marginLeft: -(this.$html.outerWidth() / 2),
				marginTop: -(this.$html.outerHeight() / 2)
			});*/
			var fixed = isIE6 ? false : this.opts.fixed,
				pos = (typeof fixed === 'boolean' && fixed) || (typeof fixed === 'string' && fixed === 'true') ? 'fixed' : 'absolute',
				top = (pos === 'absolute' && $(window).scrollTop() > 0) ? $(window).scrollTop() : 0;
			this.$html.css({
				left: ($(window).width() - this.$html.outerWidth()) / 2,
				top: ($(window).height() - this.$html.outerHeight()) / 2 + top
			});

			if (typeof this.opts.onReset === 'function') {
				this.opts.onReset.call(this.$html);
			}
		},

		showMask: function() {
			var modal = this.opts.modal,
			$iframe = $('<iframe style="position:absolute;left:0;top:0;border:0;filter:alpha(opacity=0);width:100%;height:100%;z-index:0;" src="javascript:false;"></iframe>');
			modal = (typeof modal === 'boolean' && modal) || (typeof modal === 'string' && modal === 'true') ? true : false;
			if (!modal) return false;

			if (isIE6) {
				this.$mask.html($iframe);
			}

			this.$body.append(this.$mask.fadeIn(150));
		},

		showCont: function() {
			this.$body.append(this.$html.fadeIn(150));
			this.reset();
		},

		/** 
		 * head内容
		 * time: 2014-11-28 16:07:41
		 */
		head: function() {
			var title = this.opts.title,
				close = this.opts.showClose;
			if (typeof title === 'string' && !title) return false;
			this.$head.find('.ui-dialog-title').html(title);

			if ((typeof close === 'boolean' && !close) || (typeof close === 'string' && close !== 'true')) {
				this.$head.find('.ui-dialog-close').remove();
			}

			this.$cont.before(this.$head);
		},

		/** 
		 * cont内容
		 * time: 2014-11-28 16:08:43
		 */
		cont: function() {
			// set content
			var content = this.opts.content;
			
			if (typeof content === 'string' && content) {
				content = content;
			} else if (typeof content === 'object' && content[0] && content[0].outerHTML) {
				content = content[0].outerHTML;
			} else {
				content = '';
			}			
			this.$cont.html(content);

			// set css
			var fixed = this.opts.fixed;
			var pos = (typeof fixed === 'boolean' && fixed) || (typeof fixed === 'string' && fixed === 'true') ? 'fixed' : 'absolute',
				css = Object.prototype.toString.call(this.opts.css) === '[object Object]' ? this.opts.css : {};
			css = $.extend({
				width: this.opts.width,
				zIndex: this.zIndex + 2,
				position: isIE6 ? 'absolute' : pos
			}, css);

			this.$html.css(css);
		},

		/** 
		 * foot内容
		 * time: 2014-11-28 16:09:00
		 */
		foot: function() {
			var that = this;
			var btns = this.opts.buttons;
			if (Object.prototype.toString.call(btns) === '[object Array]' && btns.length > 0) {
				$.each(btns, function(i, item) {
					that.button(this);
				});				
			}
		},

		/** 
		 * foot按钮
		 * @param {obj} [btn] [{value:'文字', className:'btn', iconClass:'', disabled:false, callback: $.noop}]
		 * time: 2014-11-28 16:09:20
		 */
		button: function(btn) {
			var that = this;
			if (typeof btn.value === 'string' && !btn.value) return false;
			var disabled = typeof btn.disabled === 'boolean' && btn.disabled ? 'disabled' : '',				
				callback = typeof btn.callback === 'function' ? btn.callback : $.noop,				
				iconNode = typeof btn.iconClass === 'string' && btn.iconClass !== '' ? '<i class="' + btn.iconClass + '"></i>' : '',
				className = typeof btn.className === 'string' && btn.className !== '' ? (btn.className + ' ' + disabled) : disabled,
				buttonCss = Object.prototype.toString.call(btn.css) === '[object Object]' && !$.isEmptyObject(btn.css) ? btn.css : {},
				btnAlign;
			switch (this.opts.buttonsAlign) {
				case 'left':
					btnAlign = 'left';
					break;
				case 'center':
					btnAlign = 'center';
					break;
				case 'right':
					btnAlign = 'right';
					break;
				default:
					btnAlign = 'right';
			}
			var $button = $('<a href="javascript:;" class="' + className + '">' + iconNode + btn.value + '</a>').css(buttonCss).click(function(e) {
				e.preventDefault();
				// api
				if (disabled) return false;
				callback.call(that.$html, {
					close: function() {
						that.close();
					},
					reset: function() {
						that.reset();
					}
				});
			});
			var footCss = Object.prototype.toString.call(this.opts.footCss) === '[object Object]' ? this.opts.footCss : {};
			var css = $.extend({}, {'text-align': btnAlign}, footCss);
			this.$foot.css(css).append($button);
			this.$cont.after(this.$foot);
		},

		mask: function() {
			var maskCss = this.opts.maskCss;
			var width = document.body.clientWidth <= document.body.scrollWidth ? document.body.clientWidth : document.body.scrollWidth;
			maskCss = Object.prototype.toString.call(maskCss) === '[object Object]' ? maskCss : {};
			maskCss = $.extend({}, {
				zIndex: this.zIndex + 1,
				width: width,
				height: $(document).height()
			}, maskCss);
			this.$mask.css(maskCss);
		}
	};

	$.dialog = function(options) {
		return new Dialog(options);
	};

}(jQuery, window, document));