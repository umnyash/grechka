import gulp from 'gulp';

// Configuration
import mode from '../mode.js';
import paths from '../paths.js';

// Plugins
import babel from 'gulp-babel';
import browser from 'browser-sync';
import concat from 'gulp-concat';
import gulpIf from 'gulp-if';
import rename from 'gulp-rename';
import terser from 'gulp-terser';

export default function processScripts() {
  return gulp.src(paths.processScripts.src)
    .pipe(concat('script.js'))
    .pipe(babel())
    .pipe(gulp.dest(paths.processScripts.dest))
    .pipe(terser())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.processScripts.dest))
    .pipe(gulpIf(mode.isDev, browser.stream()));
}
