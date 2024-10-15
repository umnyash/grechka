import gulp from 'gulp';

// Configuration
import paths from './gulp/paths.js';
import mode from './gulp/mode.js';

// Plugins
import browser from 'browser-sync';

// Tasks
import processStyles from './gulp/tasks/process-styles.js';
import copyAssets from './gulp/tasks/copy-assets.js';
import createVectorStack from './gulp/tasks/create-vector-stack.js';
import createWebp from './gulp/tasks/create-webp.js';
import deleteBuild from './gulp/tasks/delete-build.js';
import optimizeVector from './gulp/tasks/optimize-vector.js';
import processMarkup from './gulp/tasks/process-markup.js';
import processScripts from './gulp/tasks/process-scripts.js';

export function startServer(done) {
  browser.init({
    server: {
      baseDir: paths.root,
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

function watchFiles() {
  gulp.watch(paths.copyAssets.watch, copyAssets);
  gulp.watch(paths.createVectorStack.watch, createVectorStack);
  gulp.watch(paths.createWebp.watch, createWebp);
  gulp.watch(paths.optimizeVector.watch, optimizeVector);
  gulp.watch(paths.processMarkup.watch, processMarkup);
  gulp.watch(paths.processScripts.watch, processScripts);
  gulp.watch(paths.processStyles.watch, processStyles);
}

function compileProject(done) {
  gulp.parallel(
    copyAssets,
    createVectorStack,
    createWebp,
    optimizeVector,
    processMarkup,
    processScripts,
    processStyles,
  )(done);
}

function build(done) {
  gulp.series(
    deleteBuild,
    compileProject
  )(done);
}

function runDev(done) {
  gulp.series(
    build,
    startServer,
    watchFiles
  )(done);
}

export default mode.isProd ? build : runDev;
