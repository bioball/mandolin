var gulp = require('gulp');
var babel = require('gulp-babel');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');

gulp.task('default', function(){
  return gulp.src("./src/**/*.js")  
  .pipe(babel())
  .pipe(gulp.dest("./dist/"));
});