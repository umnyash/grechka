import gulp from 'gulp';

// Configuration
import paths from '../paths.js';
import mode from '../mode.js';

// Plugins
import * as dartSass from 'sass';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import csso from 'postcss-csso';
import gulpIf from 'gulp-if';
import gulpSass from 'gulp-sass';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';
import sassGlob from 'gulp-sass-glob';

const sass = gulpSass(dartSass);

export default function processStyles() {
  return gulp.src(paths.processStyles.src, { sourcemaps: mode.isDev })
    .pipe(plumber())
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest(paths.processStyles.dest, { sourcemaps: mode.isDev }))
    .pipe(gulpIf(mode.isDev, browser.stream()));
}
