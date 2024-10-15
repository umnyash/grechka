import gulp from 'gulp';

// Configuration
import mode from '../mode.js';
import paths from '../paths.js';

// Plugins
import browser from 'browser-sync';
import gulpIf from 'gulp-if';
import newer from 'gulp-newer';

export default function copyAssets () {
  return gulp.src(paths.copyAssets.src, {
    base: paths.copyAssets.base
  })
    .pipe(newer(paths.copyAssets.dest))
    .pipe(gulp.dest(paths.copyAssets.dest))
    .pipe(gulpIf(mode.isDev, browser.stream()));
}
