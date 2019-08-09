define(['jquery'], function($) {
    var page = {
        //默认值
        defaults : {
            pageCount : 10,
            allCount : 0,
            el : '',
            bindBack : ''
        },
        htmls : {
            ellipsis : '<span>...</span>'
        },
        //初始化
        init: function(opts) {
            var options = $.extend({},this.defaults,opts||{});
            if(options.allCount == 0){
                return;
            }
            //html初始化
            this.htmlInit(options);
        },
        //html初始化
        htmlInit : function(opts){
            var self = this;
            var pageCount = opts.pageCount,
                allCount = opts.allCount,
                el = opts.el;
            var pageNum = Math.ceil(allCount/pageCount);
            var html = '',
                choose = '';
            if(pageNum == 1){
				el.hide();
                return;
            }
            else if(pageNum <= 4){
                for(var i = 1;i<= pageNum;i++){
                    choose += '<a href="javascript:void(0)" class="page" sort ="'+i+'">'+ i +'</a>';
                }
                html = choose;
            }else{
                for(var i = 1;i<= 3;i++){
                    choose += '<a href="javascript:void(0)" class="page" sort ="'+i+'">'+ i +'</a>';
                }
                var chooseEnd = '<a href="javascript:void(0)" class="page" sort = "'+pageNum+'">'+ pageNum +'</a>';
                html = choose + self.htmls.ellipsis + chooseEnd;
            }
            el.find('.page-box').html(html).find('.page[sort=1]').addClass('current');
            el.show();
            self.eventBind(opts,pageNum);
            self.btnBind(opts,pageNum);
        },
        //事件绑定
        eventBind : function(opts,pageNum){
            var self = this,
                $pages = opts.el.find('.page'),
                $prev = opts.el.find('a.prev'),
                $next = opts.el.find('a.next'),
                $jump = opts.el.find('.pagesubmit'),
                $input = opts.el.find('.snInput');
            //页数事件
            $pages.click(function(){
                $pages.removeClass('current');
                $(this).addClass('current');
                var pageNow = parseInt(opts.el.find('.current').attr('sort'));
                //html调整
                self.htmlMod(pageNow,pageNum,opts);
                //回调函数
                opts.bindBack.call(this,pageNow);
            })
        },
        //html调整
        htmlMod : function(pageNow,pageNum,opts){
            var self = this,
                html = '',
                el = opts.el;
            var residue = pageNow%3,
                chooseStart = '<a href="javascript:void(0)" class="page" sort="1">1</a>',
                chooseEnd = '<a href="javascript:void(0)" class="page" sort = "'+pageNum+'">'+ pageNum +'</a>',
                choose = '';
            if(pageNum > 4){
                if(pageNow <= 3){
                    for(i=1;i<=3;i++){
                        choose += '<a href="javascript:void(0)" class="page" sort ="'+i+'">'+ i +'</a>';
                    }
                    html = choose + self.htmls.ellipsis + chooseEnd;
                    el.find('.page-box').html(html).find('.page[sort='+pageNow+']').addClass('current');
                }else{
                    if(residue == 0){
                        for(i=pageNow-2;i<=pageNow;i++){
                            choose += '<a href="javascript:void(0)" class="page" sort ="'+i+'">'+ i +'</a>';
                        }
                        if(pageNow == pageNum){
                            html = chooseStart + self.htmls.ellipsis + choose;
                        }else{
                            html = chooseStart + self.htmls.ellipsis + choose + self.htmls.ellipsis + chooseEnd;
                        }
                        el.find('.page-box').html(html).find('.page[sort='+pageNow+']').addClass('current');
                    }else if(residue == 2){
                        if(pageNow == pageNum){
                            for(i=pageNow-1;i<=pageNow;i++){
                                choose += '<a href="javascript:void(0)" class="page" sort ="'+i+'">'+ i +'</a>';
                            }
                            html = chooseStart + self.htmls.ellipsis + choose;
                        }else if(pageNow == pageNum - 1){
                            for(i=pageNow-1;i<=pageNow+1;i++){
                                choose += '<a href="javascript:void(0)" class="page" sort ="'+i+'">'+ i +'</a>';
                            }
                            html = chooseStart + self.htmls.ellipsis + choose;
                        }else{
                            for(i=pageNow-1;i<=pageNow+1;i++){
                                choose += '<a href="javascript:void(0)" class="page" sort ="'+i+'">'+ i +'</a>';
                            }
                            html = chooseStart + self.htmls.ellipsis + choose + self.htmls.ellipsis + chooseEnd;
                        }
                        el.find('.page-box').html(html).find('.page[sort='+pageNow+']').addClass('current');
                    }else if(residue == 1){
                        if(pageNow == pageNum){
                            html = chooseStart + self.htmls.ellipsis + chooseEnd;
                        }else if(pageNow == pageNum-1){
                            for(i=pageNow;i<=pageNow+1;i++){
                                choose += '<a href="javascript:void(0)" class="page" sort ="'+i+'">'+ i +'</a>';
                            }
                            html = chooseStart + self.htmls.ellipsis + choose;
                        }else if(pageNow == pageNum-2){
                            for(i=pageNow;i<=pageNow+2;i++){
                                choose += '<a href="javascript:void(0)" class="page" sort ="'+i+'">'+ i +'</a>';
                            }
                            html = chooseStart + self.htmls.ellipsis + choose;
                        }else{
                            for(i=pageNow;i<=pageNow+2;i++){
                                choose += '<a href="javascript:void(0)" class="page" sort ="'+i+'">'+ i +'</a>';
                            }   
                            html = chooseStart + self.htmls.ellipsis + choose + self.htmls.ellipsis + chooseEnd;
                        }
                        el.find('.page-box').html(html).find('.page[sort='+pageNow+']').addClass('current');
                    }
                }
                el.show();
            }else{
                //btn调整
                self.btnMod(pageNow,pageNum,opts.el);
                el.show();
                return false;
            }
            //btn调整
            self.btnMod(pageNow,pageNum,opts.el);
            //事件绑定
            self.eventBind(opts,pageNum);
            el.show();
            return true;
        },
        //btn调整
        btnMod : function(pageNow,pageNum,el){
            var self = this;
            if(pageNow == 1){
                el.find('a.prev').hide();
                el.find('span.prev').show();
                el.find('a.next').show();
                el.find('span.next').hide();
            }else if(pageNow == pageNum){
                el.find('a.prev').show();
                el.find('span.prev').hide();
                el.find('a.next').hide();
                el.find('span.next').show();
            }else{
                el.find('a.prev').show();
                el.find('span.prev').hide();
                el.find('a.next').show();
                el.find('span.next').hide();
            }
        },
        //btn事件
        btnBind : function(opts,pageNum){
            var self = this,
                $pages = opts.el.find('.page'),
                $prev = opts.el.find('a.prev'),
                $next = opts.el.find('a.next'),
                $jump = opts.el.find('.pagesubmit'),
                $input = opts.el.find('.snInput');
            //上一页事件
            $prev.click(function(){
                var pageNow = parseInt(opts.el.find('.current').attr('sort'));
                $pages.removeClass('current');
                $('.page[sort='+(pageNow-1)+']').addClass('current');
                //html调整
                self.htmlMod(pageNow-1,pageNum,opts);  
                //回调函数
                opts.bindBack.call(this,pageNow-1);
            })
            //下一页事件
            $next.click(function(){
                var pageNow = parseInt(opts.el.find('.current').attr('sort'));
                $pages.removeClass('current');
                $('.page[sort='+(pageNow+1)+']').addClass('current');
                //html调整
                self.htmlMod(pageNow+1,pageNum,opts);
                //回调函数
                opts.bindBack.call(this,pageNow+1);
            })
            //跳转事件
            $jump.click(function(){
                var pageNow = $input.val();
                if(pageNow == '' || pageNow > pageNum || pageNow == 0){
                    alert('请输入正确的页数！');
                }else{
                    //html调整
                    var result = self.htmlMod(parseInt(pageNow),pageNum,opts);
                    if(!result){
                        $pages.removeClass('current');
                        $('.page[sort='+(pageNow)+']').addClass('current');
                    }
                    //回调函数
                    opts.bindBack.call(this,parseInt(pageNow));
                }
            })
        },
        //重置
        reset : function(el){
            var self = this,
                $pages = el.find('.page'),
                $prev = el.find('a.prev'),
                $next = el.find('a.next'),
                $jump = el.find('.pagesubmit'),
                $input = el.find('.snInput');
            $prev.unbind("click");
            $next.unbind("click");
            $jump.unbind("click");
            el.find('a.prev').hide();
            el.find('span.prev').show();
            el.find('a.next').show();
            el.find('span.next').hide();
        }
    }
    return {
        //初始化
        init: function(opts) {
            page.init(opts);
        },
        //重置
        reset : function(el){
            page.reset(el);
        }
    };
});