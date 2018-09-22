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
	cleanCSS = require('gulp-clean-css'),
	sourcemaps = require('gulp-sourcemaps'),
	rimraf = require('rimraf'),
    babel = require('gulp-babel'),
    reload = browserSync.reload;

let path = {    
    dist: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/'
    },
    app: { //Пути откуда брать исходники
        html: 'app/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'app/js/*.js',//В стилях и скриптах нам понадобятся только main файлы
        css: 'app/css/*.css',
        img: 'app/img/*.*' //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'app/*.html',
        js: 'app/js/*.js',
        css: 'app/css/*.css',
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

gulp.task('bump', function(){ //обновляет package.json
  gulp.src('./package.json')
  .pipe(bump())
  .pipe(gulp.dest('./'));
});

gulp.task('html:build', function () {
    gulp.src(path.app.html) //Выберем файлы по нужному пути
    	.pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest()) //Выплюнем их в папку build
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

gulp.task('csso', function () {
    return gulp.src('app/js/main.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dest'));
});



gulp.task('css:build', function () {
    gulp.src(path.app.css) //Выберем наш main.css
    	.pipe(csso())
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(gulp.dest(path.dist.css)) //И в build
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.app.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.dist.img)) //И бросим в build
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


