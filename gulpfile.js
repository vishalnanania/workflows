var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    sass = require('gulp-sass'),
    connect = require('gulp-connect');

var env,
    coffeeSource,
    jsSource,
    sassSource,
    htmlSource,
    jsonSource,
    outputDir,
    sassStyle;

env = process.env.NODE_ENV || 'development';

if(env === 'development'){
    outputDir = 'builds/development/';
    sassStyle = 'expanded';
}else{
    outputDir = 'builds/production/';
    sassStyle = 'compressed';
}

coffeeSource = ['components/coffee/*.coffee'];
jsSource = ['components/scripts/*.js'];
sassSource = ['components/sass/style.scss'];
htmlSource = [outputDir + '*.html'];
jsonSource = [outputDir + 'js/*.json'];

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
        .pipe(gulp.dest(outputDir + 'js'))
        .pipe(connect.reload())
});

gulp.task('compass', function(){
    gulp.src(sassSource)
        .pipe(compass({
            sass : 'components/sass',
            images : outputDir + 'images',
            style : 'expanded'
         }))
        .on('error', gutil.log)
        .pipe(gulp.dest(outputDir + 'css'))
});

gulp.task('sass', function(){
    gulp.src(sassSource)
        .pipe(sass({
            outputStyle : sassStyle
         }))
        .on('error', gutil.log)
        .pipe(gulp.dest(outputDir + 'css'))
        .pipe(connect.reload())
});

gulp.task('html', function(){
    gulp.src(htmlSource)
        .pipe(connect.reload())
});

gulp.task('json', function(){
    gulp.src(jsonSource)
        .pipe(connect.reload())
});

gulp.task('watch', function(){
    gulp.watch(coffeeSource, ['coffee']);
    gulp.watch(jsSource, ['js']);
    gulp.watch('components/sass/*.scss', ['sass']);
    gulp.watch(htmlSource, ['html']);
    gulp.watch(jsonSource, ['json']);
});

gulp.task('connect', function(){
    connect.server({
        root : outputDir,
        livereload : true
    })
});

gulp.task('default', ['log', 'html', 'json', 'coffee', 'js', 'sass', 'connect', 'watch']);