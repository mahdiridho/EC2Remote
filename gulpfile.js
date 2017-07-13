/*!
 * Gulp services for web optimize and local webserver
 * Mahdi Ridho
 */

'use strict';

// Include Gulp & tools we'll use
var gulp = require('gulp'),
    server = require("gulp-server-livereload");

gulp.task('webserver', function() {
  gulp.src('app')
    .pipe(server({
      fallback:   'index.html',
      livereload:       true,
      open:             true,
      log:              'debug',
      clientConsole:    true
    }));
});

gulp.task('default',['webserver']);
