var gulp = require('gulp');
var babel = require('gulp-babel');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var lint = require('gulp-eslint');
var watch = require('gulp-watch');

gulp.task('default', function(){
  return gulp.src("./src/**/*.js")
  .pipe(plumber())
  .pipe(lint())
  .pipe(lint.format())
  .pipe(babel())
  .on('error', function(err){
    gutil.log(err);
    this.end()
  })
  .pipe(gulp.dest("./dist/"));
});

gulp.task('watch', ['default'], function(){
  return gulp.watch("./src/**/*.js", function(){ return gulp.start('default') });
});