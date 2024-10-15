import gulp from 'gulp';

// Configuration
import mode from '../mode.js';
import paths from '../paths.js';

// Plugins
import browser from 'browser-sync';
import gulpIf from 'gulp-if';
import rename from 'gulp-rename';
import { stacksvg } from 'gulp-stacksvg';
import svgmin from 'gulp-svgmin';

export default function createVectorStack() {
  return gulp.src(paths.createVectorStack.src)
    .pipe(stacksvg())
    .pipe(gulpIf(mode.isProd, svgmin()))
    .pipe(rename('icons.svg'))
    .pipe(gulp.dest(paths.createVectorStack.dest))
    .pipe(gulpIf(mode.isDev, browser.stream()));
}
