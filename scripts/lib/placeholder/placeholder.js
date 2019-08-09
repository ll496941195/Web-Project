/** 
 * ========================================================== 
 * Copyright
 * placeholder
 * Author: ghj
 * Date: 2015-01-28 11:52:47 291268 
 * ========================================================== 
 */

(function($) {
    'use strict';
    var pluginName = 'placeholder',
        defaults = {
            css: {},
            onInput: true,
            callback: $.noop
        },
        HTML = '<span class="ui-placeholder"></span>';

    var methods = {
        reset: function() {
            var $this = $(this);
            if ($this.data('plugin_' + pluginName)) {
                $this.data('plugin_' + pluginName).reset();
            }
        },
        show: function() {
            var $this = $(this);
            var opts = typeof arguments[0] === 'object' ? arguments[0] : {};
            if (!$this.data('plugin_' + pluginName)) {
                $this.data('plugin_' + pluginName, new Placeholder(this, opts));
            }
            $this.data('plugin_' + pluginName).show();
        },
        hide: function() {
            var $this = $(this);
            if ($this.data('plugin_' + pluginName)) {
                $this.data('plugin_' + pluginName).hide();
            }
        },
        destroy: function() {
            var $this = $(this);
            if ($this.data('plugin_' + pluginName)) {
                $this.data('plugin_' + pluginName).destroy();
            }            
        }
    };
    var support = 'placeholder' in document.createElement('input');
    var Placeholder = function(element, options) {     
        this.$elem = $(element);
        this.$span = $(HTML);

        this.value = this.$elem.attr('placeholder');
        if (!this.value) return;
        this.opts = $.extend(true, {}, defaults, options);
        this.init();
    }

    Placeholder.prototype = {
        constructor: Placeholder,

        init: function() {
            this.imitate();
        },

        events: {
            resize: function() {
                var that = this;
                $(window).on('resize', function() {
                    that.reset();
                });
            },

            click: function() {
                var that = this;
                this.$span.on('click', function(e) {
                    e.stopPropagation();
                    that.$elem.trigger('focus');
                    if (typeof that.opts.callback === 'function') {
                        that.opts.callback.call(this);
                    }
                });
            },

            onInput: function() {
                var that = this;
                if (this.opts.onInput && typeof this.opts.onInput === 'boolean') {
                    this.$elem.on('input propertychange', function() {
                        that.$span[0].style.display = this.value ? 'none' : 'block';
                    });
                } else {
                    this.$elem.on('focus blur', function(e) {
                        if (e.type === 'focus') {
                            that.$span.hide();
                        } else {
                            !this.value && that.$span.show();
                        }
                    });
                }
            }
        },

        reset: function() {
            this.$span.css({
                left: this.$elem.offset().left,
                top: this.$elem.offset().top
            });
        },

        show: function() {
            if (!this.value) return;
            this.$span.css({
                left: this.$elem.offset().left,
                top: this.$elem.offset().top,
                display: this.$elem.val() ? 'none' : 'block'
            });
        },

        hide: function() {
            this.$span.hide();
        },

        destroy: function() {
            this.$span.remove();
            this.$elem.off('input propertychange');
        },

        style: function() {
            function px2int(str) {
                return parseInt(str.replace('px', ''), 10);
            }
            var nodename = this.$elem[0].nodeName.toLowerCase();
            var c = $.extend({}, {
                'overflow': 'hidden',
                'position': 'absolute',
                'left': this.$elem.offset().left,
                'top': this.$elem.offset().top,
                'z-index': 1,
                'display': this.$elem.val() ? 'none' : 'block',
                'color': '#a9a9a9',
                'width': this.$elem.outerWidth(),
                'height': nodename === 'textarea' ? this.$elem.outerHeight() - px2int(this.$elem.css('padding-top')) - px2int(this.$elem.css('border-top-width')) : this.$elem.outerHeight(),
                'cursor': 'text',
                'text-indent': px2int(this.$elem.css('padding-left')) + px2int(this.$elem.css('border-left-width')),
                'font-family': this.$elem.css('font-family'),
                'font-size': this.$elem.css('font-size'),
                'font-weight': this.$elem.css('font-weight'),
                'padding-top': nodename === 'textarea' ? px2int(this.$elem.css('padding-top')) + px2int(this.$elem.css('border-top-width')) : 0,
                'line-height': nodename === 'textarea' ? this.$elem.css('line-height') : this.$elem.outerHeight() + 'px'
            }, this.opts.css);
            return c;
        },

        imitate: function() {
            this.$span.text(this.value).css(this.style());
            $('body').append(this.$span);

            this.events.resize.call(this);
            this.events.click.call(this);
            this.events.onInput.call(this);
        }
    };

    $.fn[pluginName] = function(options) {
        if (support) return;
        if (typeof options === 'string') {
            var args = Array.prototype.slice.call(arguments, 1);
            this.each(function() {
                return methods[options].apply(this, args);
            });
        } else if (typeof options === 'object' || !options) {
            this.each(function() {
                var $this = $(this);
                if (!$this.data('plugin_' + pluginName)) {
                    $this.data('plugin_' + pluginName, new Placeholder(this, options));
                }
            });
        }
        return this;
    };
})(jQuery);