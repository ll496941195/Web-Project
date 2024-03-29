({
	// app顶级目录，非必选项。如果指定值，baseUrl则会以此为相对路径
	appDir: './',
	// 模块根目录。默认情况下所有模块资源都相对此目录。
    // 若该值未指定，模块则相对build文件所在目录。
    // 若appDir值已指定，模块根目录baseUrl则相对appDir。
	baseUrl: 'scripts',
	// 指定输出目录，若值未指定，则相对 build 文件所在目录
	dir: '../publish/program',
	// 设置模块别名
    // RequireJS 2.0 中可以配置数组，顺序映射，当前面模块资源未成功加载时可顺序加载后续资源
	paths: {
		jquery: 'empty:',
		core:'empty:'
	},
	// 默认保留模块的 license 注释
	preserveLicenseComments: false,
	// 不优化某些文件
	fileExclusionRegExp: /^(test|r\.js|build|output|node_modules|todo|WEB-INF|commons|ocx)/,
	// CSS 优化方式，目前支持以下几种：
    // none: 不压缩，仅合并
    // standard: 标准压缩，移除注释、换行，以及可能导致 IE 解析出错的代码
    // standard.keepLines: 除标准压缩外，保留换行
    // standard.keepComments: 除标准压缩外，保留注释 (r.js 1.0.8+)
    // standard.keepComments.keepLines: 除标准压缩外，保留注释和换行 (r.js 1.0.8+)
	optimizeCss: 'standard',
	modules: [{
		name: "main/finance-menu"
	},{
		name: "base"
	}]
})