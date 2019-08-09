if(typeof resRoot == 'undefined'){
	resRoot = '';
}
if(require)require.config({
    baseUrl: (resRoot ? context +"/":'') +'scripts',
    paths: {
        jquery: 'http://script.suning.cn/public/js/jquery.1.7.2',
        base: 'base',
        core: 'core'
    },
    shim: {
        base: ['jquery']
    }
});

require(['jquery', 'mod/menu'], function($, menu) {
    menu.init();
});