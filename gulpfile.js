var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var mainBowerFiles = require('main-bower-files');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
// var uglify = require('gulp-uglify');
// var pump = require('pump');
var uglifyes = require('uglify-es');
var composer = require('gulp-uglify/composer');
var uglify = composer(uglifyes, console);

gulp.task('concat_bower', function() {
  return gulp.src(mainBowerFiles({
      overrides: {
        'poly-decomp': {
          'main': 'build/decomp.js'
        }
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('vendor'))
});

// watch files for changes and reload
gulp.task('serve', ['concat_bower'], function() {
  browserSync({
    server: {
      baseDir: '.'
    },
    open: false
  });

  gulp.watch(['*.html', '*.css', '*.js'], {cwd: '.'}, reload);
});
