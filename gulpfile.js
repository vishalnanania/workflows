var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    sass = require('gulp-sass'),
    connect = require('gulp-connect');

var coffeeSource = ['components/coffee/*.coffee'];
var jsSource = ['components/scripts/*.js'];
var sassSource = ['components/sass/style.scss'];

gulp.task('log', function(){
    gutil.log('workflows are awesome');
});

gulp.task('coffee', function(){
    gulp.src(coffeeSource)
        .pipe(coffee({bare: true}))
        .on('error', gutil.log)
        .pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function(){
    gulp.src(jsSource)
        .pipe(concat('script.js'))
        .on('error', gutil.log)
        .pipe(browserify())
        .pipe(gulp.dest('builds/development/js'))
        .pipe(connect.reload())
});

gulp.task('compass', function(){
    gulp.src(sassSource)
        .pipe(compass({
            sass : 'components/sass',
            images : 'builds/development/images',
            style : 'expanded'
         }))
        .on('error', gutil.log)
        .pipe(gulp.dest('builds/development/css'))
});

gulp.task('sass', function(){
    gulp.src(sassSource)
        .pipe(sass({
            outputStyle : 'expanded'
         }))
        .on('error', gutil.log)
        .pipe(gulp.dest('builds/development/css'))
        .pipe(connect.reload())
});

gulp.task('watch', function(){
    gulp.watch(coffeeSource, ['coffee']);
    gulp.watch(jsSource, ['js']);
    gulp.watch('components/sass/*.scss', ['sass']);
});

gulp.task('connect', function(){
    connect.server({
        root : 'builds/development/',
        livereload : true
    })
});

gulp.task('default', ['log', 'coffee', 'js', 'sass', 'connect', 'watch']);