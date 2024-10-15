import gulp from 'gulp';

// Configuration
import mode from '../mode.js';
import paths from '../paths.js';

// Plugins
import browser from 'browser-sync';
import gulpIf from 'gulp-if';
import newer from 'gulp-newer';
import svgmin from 'gulp-svgmin';

export default function optimizeVector() {
  return gulp.src(paths.optimizeVector.src)
    .pipe(newer(paths.optimizeVector.dest))
    .pipe(gulpIf(mode.isProd, svgmin()))
    .pipe(gulp.dest(paths.optimizeVector.dest))
    .pipe(gulpIf(mode.isDev, browser.stream()));
}
