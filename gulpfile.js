'use strict';

var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');//帮助自动加载package.json文件里的gulp插件
var browserSync = require('browser-sync');//实时快速响应文件更改
var wiredep = require('wiredep').stream;//将bower中的文件引入到html
var $ = gulpLoadPlugins();
var reload = browserSync.reload;

/*
 版本控制
 */
var pkg = require('./package.json');
var config = {
    base: 'card-h5',
    dist: pkg.version + '/card-h5',
   // proxyUrl: 'http://10.118.202.104:9005/',
    changeOrigin: true,
    proxyUrl: 'http://localhost:8080/'
};

// //编译sass文件
// gulp.task('sass', function () {
//     return gulp.src('app/scss/*.scss')
//         .pipe($.plumber())//gulp-plumber错误管理
//         .pipe($.sourcemaps.init())//当scss有各种引入关系时，编译后不容易找到对应scss文件，所以需要生成sourcemap文件，方便修改
//         .pipe($.sass.sync({
//             outputStyle: 'expanded',
//             precision: 10,
//             includePaths: ['.']
//         })).pipe($.sourcemaps.write())
//         .pipe(gulp.dest('card-h5/styles'))
//         .pipe(reload({stream: true}));
// });

gulp.task('css', function () {
    return gulp.src('card-h5/styles/*.css').pipe(gulp.dest(config.dist + '/styles'));
});

gulp.task('fonts', function () {
    return gulp.src(['card-h5/fonts/*.ttf', 'card-h5/fonts/*.eot', 'card-h5/fonts/*.svg', 'card-h5/fonts/*.woff'])
        .pipe(gulp.dest(config.dist + '/fonts'));
});

function lint(files, options) {
    return function () {
        return gulp.src(files)
            .pipe(reload({stream: true, once: true}))
            .pipe($.eslint(options))
            .pipe($.eslint.format())
            .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
    };
}

var testLintOptions = {
    env: {
        mocha: true
    }
};

gulp.task('lint', lint('card-h5/scripts/**/*.js'));

gulp.task('lint:test', lint('test/spec/**/*.js', testLintOptions));

gulp.task('home', function () {
    var assets = $.useref({searchPath: ['.tmp', 'card-h5', '.']});
    return gulp.src('card-h5/*.html')
        .pipe(assets)
        //.pipe($.if('*.js', $.ngAnnotate()))
        //.pipe($.if('*.js', $.uglify()))
        //.pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
        .pipe($.useref())
        //.pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
        .pipe(gulp.dest(config.dist));
});

gulp.task('html', function () {
    return gulp.src(['card-h5/**/*.html', '!card-h5/*.html'])
        .pipe($.minifyHtml({conditionals: true, loose: true}))
        .pipe(gulp.dest(config.dist))
        .pipe(reload({stream: true}));
});

gulp.task('images', function () {
    return gulp.src('card-h5/images/**/*')
        .pipe($.if($.if.isFile, $.cache($.imagemin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [{cleanupIDs: false}]
        }))
            .on('error', function (err) {
                console.log(err);
                this.end();
            })))
        .pipe(gulp.dest(config.dist + '/images'));
});

gulp.task('wiredep', function () {
    gulp.src('card-h5/scss/*.scss')
        .pipe(wiredep({
            directory: './bower_components/',
            ignorePath: /^(\.\.\/)+/
        }))
        .pipe(gulp.dest('card-h5/scss'));

    gulp.src('card-h5/*.{html,htm}')
        .pipe(wiredep({
            directory: './bower_components/',
            //exclude: ['ionic'],
            ignorePath: /^(\.\.\/)*\.\./
        }))
        .pipe(gulp.dest('app'));
});

var proxyMiddleware = require('http-proxy-middleware');
var proxy = proxyMiddleware('/card-h5', {target: config.proxyUrl});

gulp.task('js', function () {
    return gulp.src('card-h5/scripts/*/**.*').pipe($.uglify()).pipe(gulp.dest(config.dist + '/scripts'));
});

gulp.task('uglifyJs', function () {
    return gulp.src('card-h5/scripts/controllers/*/**.*').pipe($.uglify()).pipe(gulp.dest(config.dist + '/scripts/controllers'));
});

gulp.task('serve', function () {
    browserSync({
        notify: false,
        port: 8088,
        server: {
            baseDir: ['card-h5'],
            routes: {
                '/bower_components': 'bower_components'
            }
        },
        charset: "utf-8",
        middleware: [proxy]
    });

    /* gulp.watch([
     'card-h5/!*.html',
     'card-h5/scripts/tpls/!*.html',
     'card-h5/scripts/!**!/!*.js',
     'card-h5/utils/!**!/!*.js',//add
     'card-h5/images/!*',
     'card-h5/fonts/!*',
     'card-h5/styles/!*',
     //'card-h5/scss/!**!/!*'
     ]).on('change', reload);
     //gulp.watch(['card-h5/scss/!**!/!*.scss', 'card-h5/scss/card-h5/!*.scss'], ['sass']);
     gulp.watch('card-h5/fonts/!**!/!*', ['fonts']);
     //gulp.watch('bower.json', ['wiredep', 'fonts']);*/
});

gulp.task('serve:dist', function () {
    browserSync({
        notify: false,
        port: 9001,
        server: {
            baseDir: [config.dist]
        }
    });

    gulp.watch([
        config.dist + '/**/*.html',
        config.dist + '/scripts/**/*.js',
        config.dist + '/utils/**/*.js', //add
        config.dist + '/images/*',
        config.dist + '/fonts/*',
        config.dist + '/styles/*',
        //config.dist + '/scss/**/*'
    ]).on('change', reload());
});

gulp.task('build:production', function () {
    return gulp.src(config.dist + '/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('build', $.sequence('lint', ['css', 'fonts', 'uglifyJs', 'js', 'images', 'html', 'home'], 'build:production'));

gulp.task('default', ['clean'], function () {
    gulp.start('serve');
});



