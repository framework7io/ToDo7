(function(){
    'use strict';    
    var gulp = require('gulp'),
        connect = require('gulp-connect'),
        open = require('gulp-open'),
        less = require('gulp-less'),
        jade = require('gulp-jade'),
        path = require('path'),
        fs = require('fs'),
        paths = {
            root: './',
            css: 'css/',
            js: 'js/',
            source: {
                less: 'src/less/',
                jade: 'src/jade/'
            }
        },
        app = {
            filename: 'todo7',
            pkg: require('./bower.json'),
            banner: [
                '/**',
                ' * <%= pkg.name %> <%= pkg.version %>',
                ' * <%= pkg.description %>',
                ' * ',
                ' * <%= pkg.homepage %>',
                ' * ',
                ' * Copyright <%= date.year %>, <%= pkg.author %>',
                ' * The iDangero.us',
                ' * http://www.idangero.us/',
                ' * ',
                ' * Licensed under <%= pkg.license.join(" & ") %>',
                ' * ',
                ' * Released on: <%= date.month %> <%= date.day %>, <%= date.year %>',
                ' */',
                ''].join('\n'),
            date: {
                year: new Date().getFullYear(),
                month: ('January February March April May June July August September October November December').split(' ')[new Date().getMonth()],
                day: new Date().getDate()
            },

        };
        
    /* ==================================================================
    Build App
    ================================================================== */
    gulp.task('styles', function (cb) {
        gulp.src([paths.source.less + app.filename + '.less'])
            .pipe(less({
                paths: [ path.join(__dirname, 'less', 'includes') ]
            }))
            .pipe(gulp.dest(paths.css))
            .pipe(connect.reload())
            .on('end', function () {
                cb();
            });
    });
    gulp.task('jade', function (cb) {
        gulp.src([paths.source.jade + '*.jade'])
            .pipe(jade({
                pretty: true,
            }))
            .pipe(gulp.dest(paths.root))
            .pipe(connect.reload())
            .on('end', function () {
                cb();
            });
    });

    gulp.task('build', ['styles', 'jade'], function (cb) {
        cb();
    });

    /* =================================
    Watch
    ================================= */
    gulp.task('watch', function () {
        gulp.watch(paths.source.less + '*.less', [ 'styles' ]);
        gulp.watch(paths.source.jade + '*.jade', [ 'jade' ]);

        gulp.watch(paths.css + '*.css', function () {
            gulp.src(paths.css)
                .pipe(connect.reload());
        });
        gulp.watch(paths.js + '*.js', function () {
            gulp.src(paths.js)
                .pipe(connect.reload());
        });
        gulp.watch(paths.root + '*.html', function () {
            gulp.src(paths.root)
                .pipe(connect.reload());
        });
        
    });

    gulp.task('connect', function () {
        return connect.server({
            root: [ paths.root ],
            livereload: true,
            port:'3000'
        });
    });
    
    gulp.task('open', function () {
        return gulp.src(paths.root + 'index.html').pipe(open('', { url: 'http://localhost:3000/index.html'}));
    });

    gulp.task('server', [ 'watch', 'connect', 'open' ]);

    gulp.task('default', [ 'server' ]);
    
    gulp.task('test', [ 'build' ]);
})();