'use strict';

const gulp = require('gulp'),
    watch = require('gulp-watch'),
	batch = require('gulp-batch'),
	htmlmin = require('gulp-htmlmin'),
	csso = require('gulp-csso'),
	bump = require('gulp-bump'),
	uglify = require('gulp-uglify'),
	pump = require('pump'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	browserSync = require('browser-sync'),
	sourcemaps = require('gulp-sourcemaps'),
	rimraf = require('rimraf'),
    babel = require('gulp-babel'),
    csscomb = require('gulp-csscomb'),
    cleanCSS = require('gulp-clean-css'),
    reload = browserSync.reload;

let path = {    
    dist: {
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/'
    },
    app: { 
        html: 'app/*.html', 
        js: 'app/js/main.js',
        css: 'app/css/main.css',
        img: 'app/img/*.*'
    },
    watch: { 
        html: 'app/*.html',
        js: 'app/js/main.js',
        css: 'app/css/main.css',
        img: 'app/img/*.*'
    },
    clean: './dist'
};

let config = {
    server: {
        baseDir: "./dist"
    },
    tunnel: true,
    host: 'localhost',
    port: 8081,
    logPrefix: "ola"
};

gulp.task('bump', function(){ 
  gulp.src('./package.json')
  .pipe(bump())
  .pipe(gulp.dest('./'));
});

gulp.task('html:build', function () {
    gulp.src(path.app.html) 
    	.pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(path.dist.html)) 
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    return gulp.src(path.app.js)
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(path.dist.js));
});

gulp.task('css:build', function () {
    return gulp.src(path.app.css) 
    	.pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(path.dist.css)) 
});

gulp.task('image:build', function () {
    gulp.src(path.app.img) 
        .pipe(imagemin({ 
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.dist.img)) 
        .pipe(reload({stream: true}));
});

gulp.task('build', [
    'html:build',
    'js:build',
    'css:build',
    'image:build'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.css], function(event, cb) {
        gulp.start('css:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
});

gulp.task('webserver', function () {
    browserSync(config);
});


gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});


gulp.task('default', ['build', 'webserver', 'watch']);


