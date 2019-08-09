define(['jquery', 'lib/util/util','base'], function($, util,base) {
    return {
        init: function() {
            //dialog
            this.dialog();
            //calander
            this.calander();
            //pager
            this.pager();
        },
        //dialog
        dialog:function(){
            var win = $.dialog({
                content : $('#dialog').html(),
                width : 400,
                maskCss: {              // 遮罩层背景
                    opacity: 0.5
                },
                onShow : function($dialog, callback){
                    $dialog.find('.confirm').click(function(){
                        callback.close();
                    })
                },
                showClose : false
            })
            win.show();
        },
        //calander
        calander:function(){
            ECode.calendar({
                flag:false,
                inputBox:"#birth",
                count:2,
                isWeek: false,
                isSelect:true,
                range: {mindate:"1900-01-01",maxdate:"2016-12-31"},
                callback: function() {
                    
                }
            });
        },
        //pager
        pager:function(){
            //分页
            base.pager.reset($('.snPages'));
            base.pager.init({
                //每页数量
                pageCount : 10,
                //总数量
                allCount : 100,
                //分页对象
                el : $('.snPages'),
                //绑定事件
                bindBack : function(pageNum){
                    console.log(pageNum);
                }
            })
        }
    };
});