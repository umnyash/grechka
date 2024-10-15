import gulp from 'gulp';

// Configuration
import mode from '../mode.js';
import paths from '../paths.js';

// Plugins
import browser from 'browser-sync';
import gulpIf from 'gulp-if';
import pug from 'gulp-pug';

export default function processMarkup() {
  return gulp.src(paths.processMarkup.src)
    .pipe(pug({
      pretty: mode.isDev,
    }))
    .pipe(gulp.dest(paths.processMarkup.dest))
    .pipe(gulpIf(mode.isDev, browser.stream()));
}
