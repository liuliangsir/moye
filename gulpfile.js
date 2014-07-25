var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var cssMin = require('gulp-minify-css');
var less = require('gulp-less');
var csslint = require('gulp-csslint');
var sourcemaps = require('gulp-sourcemaps');
var jsdoc = require('gulp-jsdoc');
var rimraf = require('gulp-rimraf');
var rename = require('gulp-rename');
var amdOptimizer = require('gulp-amd-optimizer');
var amdOptimize = require('amd-optimize');



var config = {
    js: 'src/*/*.js',
    css: 'src/css/*.css',
    less: ['src/css/*.less', '!src/css/grid.less'],
    dir: {
        js: 'src/ui',
        css: 'src/css'
    },
    asset: {
        js: 'asset/ui',
        css: 'asset/css'
    },
    clean: ['asset', 'src/moye']
};

gulp.task('clean', function () {
    gulp.src(config.clean, {read: false})
        .pipe(rimraf());
});

gulp.task('jshint', function () {
    return gulp.src(config.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('less', function () {
    return gulp.src(config.less)
        .pipe(less())
        .pipe(gulp.dest(config.dir.css));
});

gulp.task('csslint', function () {
    return gulp.src(config.less)
        .pipe(less())
        .pipe(csslint('.csslintrc'))
        .pipe(csslint.reporter());
    // return gulp.tasks['less'].fn().pipe(csslint())
    //     .pipe(csslint.reporter());
});

gulp.task('jsdoc', function () {
    gulp.src(config.js)
        .pipe(jsdoc('doc/api'));
});


gulp.task('uglify', function () {
    return gulp.src(config.js)
        .pipe(uglify())
        .pipe(gulp.dest(config.asset.js))
});

gulp.task('cssmin', function () {
    return gulp.src(config.css)
        .pipe(cssMin())
        .pipe(gulp.dest(config.asset.css));
});

gulp.task('build', ['jshint'], function () {
    return gulp.src(config.js)
        .pipe(amdOptimizer({
            baseUrl: 'src',
            exclude: [
                'jquery'
            ]
        }))
        .pipe(uglify())
        .pipe(rename({
            extname: '.js'
        }))
        .pipe(gulp.dest(config.asset.js));
});

gulp.task('build1', function () {
    return gulp.src([config.js])
        .pipe(amdOptimize('ui/City', {
            baseUrl: 'src',
            paths: {
                jquery: '../dep/jquery'
            }
        }))
        // .pipe(uglify())
        .pipe(gulp.dest(config.asset.js));
});


gulp.task('watch', function () {
    gulp.watch(config.js, ['jshint']);
    gulp.watch(config.less, ['csslint']);
});

gulp.task('minify', ['uglify', 'cssmin']);
gulp.task('lint', ['jshint', 'csslint']);
gulp.task('default', ['lint']);