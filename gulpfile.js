var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    sass = require('gulp-sass'),
    gulpif = require('gulp-if'),
    minifyHTML = require('gulp-minify-html'),
    uglify = require('gulp-uglify'),
    jsonminify = require('gulp-jsonminify'),
    imagemin = require('gulp-imagemin'),
    pngcrush = require('imagemin-pngcrush'),
    connect = require('gulp-connect');

var env,
    coffeeSource,
    jsSource,
    sassSource,
    htmlSource,
    jsonSource,
    imageSource,
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
htmlSource = ['builds/development/*.html'];
jsonSource = ['builds/development/js/*.json'];
imageSource = ['builds/development/images/**/*.*'];

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
        .pipe(gulpif(env === 'production', uglify()))
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
        .pipe(gulpif(env === 'production', minifyHTML()))
        .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
        .pipe(connect.reload())
});

gulp.task('json', function(){
    gulp.src(jsonSource)
        .pipe(gulpif(env === 'production', jsonminify()))
        .pipe(gulpif(env === 'production', gulp.dest(outputDir+'js')))
        .pipe(connect.reload())
});

gulp.task('images', function(){
    gulp.src(imageSource)
        .pipe(gulpif(env === 'production', imagemin({
            progressive: true,
            svgoPlugins: [{ removeVIewBox: false }],
            use: [pngcrush()]
        })))
        .pipe(gulpif(env === 'production', gulp.dest(outputDir+'images')))
        .pipe(connect.reload())
});

gulp.task('watch', function(){
    gulp.watch(coffeeSource, ['coffee']);
    gulp.watch(jsSource, ['js']);
    gulp.watch('components/sass/*.scss', ['sass']);
    gulp.watch(htmlSource, ['html']);
    gulp.watch(jsonSource, ['json']);
    gulp.watch(imageSource, ['images']);
});

gulp.task('connect', function(){
    connect.server({
        root : outputDir,
        livereload : true
    })
});

gulp.task('default', ['log', 'html', 'json', 'coffee', 'js', 'sass', 'images', 'connect', 'watch']);