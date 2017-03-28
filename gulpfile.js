const gulp = require('gulp'),
      sourcemaps = require('gulp-sourcemaps'),
      source = require('vinyl-source-stream'),
      buffer = require('vinyl-buffer'),
      browserify = require('browserify'),
      watchify = require('watchify'),
      insert = require('gulp-insert'),
      babelify = require('babelify'),
      eslint = require('gulp-eslint'),
      stripComments = require('gulp-strip-comments'),
      rename = require('gulp-rename'),
      webserver = require('gulp-webserver'),
      uglify = require('gulp-uglify'),
      gutil = require('gulp-util'),
      sass = require('gulp-sass'),
      debug = require('gulp-debug');

const FILENAME = "videojs-annotation-comments.js",
      PACKAGE = require('./package.json');

const ATTIBUTION = "/* Version "+PACKAGE.version+" videojs-annotation-comments (https://github.com/contently/videojs-annotation-comments.git), Authored by Evan Carothers & Jack Pope */"+"\n\n";

//compilation function for browserify/bundler/transpilation
function compile(watch, cb){
  var bundler = watchify(browserify('./src/main.js', { debug: true }));
                  //.transform(babelify, {presets: ["es2015-script"]} );

  function rebundle() {
    bundler.bundle()
      .on('log', gutil.log)
      .on('error', gutil.log.bind(gutil.colors.red, 'Browserify Error'))
      .pipe(source('src/main.js'))
      .pipe(rename(FILENAME))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./build'));
  }

  if (watch) {
    rebundle();
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  }else{
    rebundle();
    cb();
  }
}

// Get bundler from bundlify
function getBundler(path, options){
  var bundler = browserify(path, { debug: options.debug, cache: {}, packageCache: {} });
  bundler.transform(babelify, {presets: ["es2015"]})
  bundler.on('log', gutil.log);
  bundler.on('error', gutil.log.bind(gutil.colors.red, 'Browserify Error'));
  return bundler;
};


gulp.task('lint', () => {
  return gulp.src('./src/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('dev_webserver', () => {
  console.log(":::: > Test page at http://localhost:3004/test.html");
  return gulp.src(['build','test','node_modules'])
      .pipe(webserver({ port: 3004 })
    );
});

gulp.task('sass', () => {
  return gulp.src('src/css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/css'));
});
 
gulp.task('sass:watch', () => {
  gulp.watch('./src/css/**/*.scss', ['sass']);
});

gulp.task('build', ['transpile'], () => {
  return gulp.src('build/videojs-annotation-comments.js')
    .pipe(rename(FILENAME.replace(".js",".min.js")))
    .pipe( stripComments() )
    .pipe(uglify())
    .pipe( insert.prepend(ATTIBUTION) )
    .pipe( gulp.dest("./build") )
});

gulp.task('transpile', (cb) => compile(false, cb) );
gulp.task('bundle_watch', (cb) => compile(true, cb) );
gulp.task('watch', ['bundle_watch', 'dev_webserver', 'sass:watch']);
gulp.task('default', ['watch']);