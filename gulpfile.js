var gulp = require('gulp'),
    less = require('gulp-less'),
    prefix = require('gulp-autoprefixer'),
    minifyCss = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    fs = require('fs'),
    paths = require('path'),
    rjs = require('requirejs');

gulp.task('Less', function (done) {
    gulp.src('style/less/**/*.less')//需要编译的less文件路径
        .pipe(sourcemaps.init())
        .pipe(less())//编译
        .pipe(prefix(['last 4 versions'], { cascade: true }))
        .pipe(minifyCss({
            keepSpecialComments: 0,//保留所有特殊前缀
            compatibility:'ie7'//保留ie7及以下兼容写法
        }))
        .pipe(gulp.dest('style/css'))//生成目录
        .on('end', done);//结束
    gulp.watch('style/less/**/*.less', ['Less']); //当所有less文件发生改变时，调用Less任务
});