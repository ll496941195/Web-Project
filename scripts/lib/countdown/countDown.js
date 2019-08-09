/*倒计时 start*/
function CountDown(opts){
    this.opts = opts || {};
    this.endTime = this.opts.endTime;
    this.serviceTime = this.opts.serviceTime;
    this.timeParentEl = this.opts.timeParentEl;
    this.type = this.opts.type;
    this.firstLocalTime = new Date();//第一次执行时间
    this.lastLocalTime = new Date();//上一次执行时间
    this.first = true;
    this.setT = [];
    this.clearT = null;
    /**剩余时间是否格式化*/
    this.isFormatter = this.opts.isFormatter; 
}
CountDown.prototype = {
    init: function(){
        var self = this, nowTime = new Date();
        /**初始化时，如果传入的是日期类型，统一转化秒*/
        if(self.type === 'msDate'){//传的是日期毫秒级别的服务器事件
            self.serviceTime = self.serviceTime - (self.serviceTime%1000);
            var seconds = self.endTime - (nowTime.getTime() - self.firstLocalTime.getTime() + self.serviceTime);
            self.endTime = seconds;
        }else if(self.type === 'Date'){//传的是日期秒级别的服务器事件
            var seconds = self.endTime - (nowTime.getTime() - self.firstLocalTime.getTime() + self.serviceTime.getTime());
            self.endTime = seconds; 
        }else{
            //换算成ms
            self.endTime = self.endTime * 1000; 
        }
        self.timer(self.opts);
        self.setT.push(setInterval(function(){
            self.timer(self.opts);
        },1000));
        self.opts.clearT = self.setT.length - 1;
    },
    getTime: function(){
        var self = this, nowTime = new Date(),
        runtime = nowTime.getTime() - self.lastLocalTime.getTime();
        self.endTime = self.endTime - runtime;
        self.formatTime();
    },
    checkTime: function(i){
        var self = this;
        if (i < 10) {i = "0" + i;}  
       return i;  
    },
    formatTime: function(){
        var self = this;
        var time = self.endTime;
        /**如果不需要格式化，则只保留秒数*/
        if(!self.isFormatter){
            self.opts.hh = "0";
            self.opts.mm = "0";
            self.opts.ss = Math.round(time / 1000);
            return ;
        }

        var secs = Math.round(time / 1000);
        var days = Math.floor(secs / (60 * 60 * 24)),
            hour = Math.floor((secs - days * 24 * 60 * 60) / 3600),
            minute = Math.floor((secs - days * 24 * 60 * 60 - hour * 3600) / 60),
            second = Math.round(secs - days * 24 * 60 * 60 - hour * 3600 - minute * 60);
        self.opts.dd = self.checkTime(days);
        self.opts.hh = self.checkTime(hour);
        self.opts.mm = self.checkTime(minute);
        self.opts.ss = self.checkTime(second);
    },
    timer: function(){
        var self = this, nowTime = new Date();
        /**如果采用统一为秒计算的情况下，这里应该也可以改*/
        if(self.endTime > 0){
           self.getTime();
        }else{
            this.destory(self.opts);
            this.endCallback();
            return;
        }
        this.callback();
        self.lastLocalTime = nowTime;
    },
    callback: function(){
        if(this.opts.callback){
            this.opts.callback({
                days: this.opts.dd,
                hour: this.opts.hh,
                minute: this.opts.mm,
                second: this.opts.ss
            });
        }
    },
    endCallback: function(){
        if(this.opts.endCallback){
            this.opts.endCallback();
        }
    },
    destory: function(){
        var self = this;
        clearInterval(self.setT[self.opts.clearT]);
        self.formatTime();
    }
};
/*倒计时 end*/