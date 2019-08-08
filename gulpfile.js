const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');

sass.compiler = require('node-sass');

const cssMatch = ['**/*.scss', '!node_modules/**/*.scss'];

gulp.task('scss', function () {
  var processors = [
    autoprefixer
  ];
  return gulp.src(cssMatch, {base: './'})
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(gulp.dest(''));
});

/* Watch Files For Changes */
gulp.task('watch', function () {
  gulp.start('scss');
  gulp.watch(cssMatch, ['scss']);
});

gulp.task('default', ['watch']);
