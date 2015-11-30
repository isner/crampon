
/**
 * Dependencies
 */

var duo = require('gulp-duojs');
var fs = require('fs-extra');
var path = require('path');
var gulp = require('gulp');

/**
 * Constants
 */

var FILENAME = 'crampon';
var DIST = 'dist';

/**
 * Tasks
 */

gulp.task('default', ['clean', 'scripts', 'styles']);

gulp.task('clean', function () {
  fs.emptyDirSync(DIST);
});

gulp.task('scripts', function () {
  gulp.src('crampon.js')
    .pipe(duo({ standalone: 'Crampon' }))
    .pipe(gulp.dest(DIST));
});

gulp.task('styles', function () {
  fs.copySync(FILENAME + '.css', path.join(DIST, FILENAME + '.css'));
});
