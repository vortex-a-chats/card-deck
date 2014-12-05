var gulp = require("gulp");
var gutil = require("gulp-util");
var plumber = require("gulp-plumber");
var myth = require("gulp-myth");
var csso = require("gulp-csso");
var coffee = require("gulp-coffee");
var options = require("minimist")(process.argv.slice(2));
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var sources ={
  sass : "src/sass/*.scss",
  html : "src/html/*.html",
  coffee : "src/coffee/*.coffee"
};
var destinations ={
  sass : "dist/sass/",
  html : "dist/html/",
  coffee : "dist/coffee/"
};

gulp.task("styles", function () {
  gulp.src("./src/css/*.css")
          .pipe(options.production ? plumber() : gutil.noop())
          .pipe(myth({sourcemap: !options.production}))
          .pipe(options.production ? csso() : gutil.noop())
          .pipe(gulp.dest("./dist/css/"));
});
gulp.task("hello", function () {
  console.log("hello le monde!");
});
gulp.task('browser-sync', function () {
  return browserSync.init(null, {
    open: false,
    server: {
      baseDir: "./dist"
    }
  });
});
gulp.task("html", function () {
  console.log("html was changed");
  gulp.src("./src/html/*.html")
          .pipe(gulp.dest("./dist/"))
          .pipe(reload({stream: true}));
});
gulp.task("sass2css", function () {
  gulp.src("./src/sass/*.scss")
          .pipe(sass({outputStyle: 'compressed', errLogToConsole: true}))
          .pipe(gulp.dest("./dist/css/"))
          .pipe(reload({stream: true}))
          .on('error', gutil.log);
});
gulp.task("coffee2js", function () {
  gulp.src("./src/coffee/*.coffee")
          .pipe(coffee())
          .pipe(plumber())
          .pipe(gulp.dest("./dist/js/"))
          .pipe(reload({stream: true}))
});
gulp.task('watch', function() {
  gulp.watch(sources.sass, ['sass2css']);
  gulp.watch(sources.html, ['html']);
  gulp.watch(sources.coffee, ['coffee2js']);
  
});
gulp.task("default", ["coffee2js", "sass2css", "html", "browser-sync", "watch"], function () {
  console.log("spartiiiii");
});