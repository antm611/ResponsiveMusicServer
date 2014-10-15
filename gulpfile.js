'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var jshintStylish = require('jshint-stylish');
var del = require('del');
var express = require('express');
var lrserver = require('tiny-lr')();
var pngcrush = require('imagemin-pngcrush');
var path = require('path');
var runSequence = require('run-sequence');

var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
};

var server = express();
server.use(require('connect-livereload')({
    port: 35729
}));
server.use(express.static('.tmp'));
server.use('/bower_components', express.static('./bower_components'));
server.use(express.static(appConfig.app));

function getErrorHandler(prefix) {
    return function(error) {
        $.notify.onError({
            title: prefix,
            message: prefix + ': <%=error.message%>'
        })(error);
        this.emit('end');
    };
}

function notifyLivereload(event) {
    var fileName = path.relative(appConfig.app, event.path);

    lrserver.changed({
        body: {
            files: [fileName]
        }
    });
}

gulp.task('express', function() {
    server.listen(9000);
    lrserver.listen(35729);
});

gulp.task('clean:server', function() {
    return del([
        '.tmp'
    ]);
});

gulp.task('clean:dist', function() {
    return del([
        '.tmp',
        appConfig.dist + '/{,*/}*.*'
    ]);
});

gulp.task('wiredep:serve', function() {
    return gulp.src([appConfig.app + '/index.html'])
        .pipe(wiredep({
            ignorePath: /\.\.\//,
            exclude: [/es5-shim/, /json3/, /jquery/],
            dependencies: true,
            devDependencies: true
        }))
        .pipe(gulp.dest(appConfig.app));
});

gulp.task('wiredep:dist', function() {
    return gulp.src([appConfig.app + '/index.html'])
        .pipe(wiredep({
            ignorePath: /\.\.\//,
            exclude: [/es5-shim/, /json3/],
            dependencies: true,
            devDependencies: false
        }))
        .pipe(gulp.dest(appConfig.app));
});

gulp.task('jshint:all', function() {
    return gulp.src([
            'gulpfile.js',
            appConfig.app + '/scripts/{,*/}*.js'
        ])
        .pipe($.jshint())
        .pipe($.jshint.reporter(jshintStylish));
});

gulp.task('jshint:test', function() {
    return gulp.src(['test/spec/{,*/}*.js'])
        .pipe($.jshint())
        .pipe($.jshint.reporter(jshintStylish));
});

gulp.task('usemin', function() {
    return gulp.src([appConfig.app + '/index.html'])
        .pipe($.usemin({
            css: [$.minifyCss(), $.rev(), $.rename({suffix: '.min'})],
            js: [$.uglify(), $.rev(), $.rename({suffix: '.min'})],
            outputRelativePath: '../dist/'
        }))
        .pipe(gulp.dest(appConfig.dist));
});

gulp.task('imagemin', function() {
    return gulp.src([appConfig.app + '/images/{,*/}*.{png,jpg,jpeg,gif,svg}'])
        .pipe($.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest(appConfig.dist + '/images'));
});

gulp.task('html2js', function() {
    return gulp.src([appConfig.app + '/views/{,*/}*.html'])
        .pipe($.minifyHtml({empty: true}))
        .pipe($.ngHtml2js({
            moduleName: 'musicServerApp.views',
            prefix: 'views/'
        }))
        .pipe($.concat('app.views.js'))
        .pipe(gulp.dest(appConfig.app + '/scripts'));
});

gulp.task('htmlmin', function() {
    return gulp.src([appConfig.app + '/views/{,*/}*.html'])
        .pipe($.minifyHtml({empty: true}))
        .pipe(gulp.dest(appConfig.dist + '/views'));
});

gulp.task('copy:dist', function() {
    return gulp.src([
        appConfig.app + '/*.{ico,png,txt}',
        appConfig.app + '/.htaccess',
        appConfig.app + '/*.html',
        appConfig.app + '/views/{,*/}*.html',
        appConfig.app + '/images/{,*/}*.{webp}',
        appConfig.app + '/fonts/*'
    ])
        .pipe($.copy(appConfig.dist, {
            prefix: 1
        }));
});

gulp.task('copy:bootstrap', function() {
    return gulp.src([
        'bower_components/bootstrap/dist/fonts/*'
    ])
        .pipe($.copy(appConfig.dist, {
            prefix: 3
        }));
});

gulp.task('copy:fontawesome', function() {
    return gulp.src([
        'bower_components/fontawesome/fonts/*'
    ])
        .pipe($.copy(appConfig.dist, {
            prefix: 2
        }));
});

gulp.task('karma', function() {
    return gulp.src('./UNUSED')
        .pipe($.karma({
            configFile: 'test/karma.conf.js',
            action: 'run'
        }))
        .on('error', getErrorHandler('JS Testing Failed'));
});

gulp.task('sass', function() {
    return gulp.src(appConfig.app + '/styles/main.scss')
        .pipe($.sass({style: 'nested'})
            .on('error', getErrorHandler('SASS Build Failed')))
        .pipe($.autoprefixer('last 10 version'))
        .pipe($.rename('main.css'))
        .pipe(gulp.dest('.tmp/styles'));
});

gulp.task('watch', function() {
    gulp.watch('bower.json', ['wiredep:serve']);
    gulp.watch(appConfig.app + '/scripts/{,*/}*.js', ['jshint:all']);
    gulp.watch('test/spec/{,*/}*.js', ['jshint:test', 'karma']);
    gulp.watch(appConfig.app + '/styles/{,*/}*.scss', ['sass']);
    gulp.watch([
        appConfig.app + '/{,*/}*.html',
        '.tmp/styles/style.css',
        appConfig.app + '/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
    ], notifyLivereload);
});

gulp.task('serve', function() {
    return runSequence(
        ['clean:server', 'wiredep:serve'],
        ['sass', 'html2js', 'express'],
        'watch'
    );
});

gulp.task('build', function() {
    runSequence(
        ['clean:dist', 'wiredep:dist'],
        ['sass', 'copy:fontawesome', 'copy:bootstrap', 'copy:dist'],
        ['imagemin', 'htmlmin', 'html2js'],
        'usemin'
    );
});

gulp.task('default', ['serve']);
