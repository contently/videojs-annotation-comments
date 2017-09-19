const gulp          = require('gulp'),
      sourcemaps    = require('gulp-sourcemaps'),
      source        = require('vinyl-source-stream'),
      buffer        = require('vinyl-buffer'),
      browserify    = require('browserify'),
      watchify      = require('watchify'),
      insert        = require('gulp-insert'),
      babelify      = require('babelify'),
      stripComments = require('gulp-strip-comments'),
      rename        = require('gulp-rename'),
      webserver     = require('gulp-webserver'),
      uglify        = require('gulp-uglify'),
      gutil         = require('gulp-util'),
      sass          = require('gulp-sass'),
      debug         = require('gulp-debug'),
      pump          = require('pump'),
      mocha         = require('gulp-mocha'),
      eslint        = require('gulp-eslint'),
      handlebars    = require('gulp-handlebars'),
      wrap          = require('gulp-wrap'),
      concat        = require('gulp-concat'),
      declare       = require('gulp-declare'),
      autoprefixer  = require('gulp-autoprefixer'),
      autoFixTask   = require('gulp-eslint-auto-fix');

const FILENAME = "videojs-annotation-comments.js",
      PACKAGE = require('./package.json');

const ATTIBUTION = "/* Version "+PACKAGE.version+" videojs-annotation-comments (https://github.com/contently/videojs-annotation-comments.git), Authored by Evan Carothers & Jack Pope */"+"\n\n";

//compilation function for browserify/bundler/transpilation
function compile(watch, cb){
    var bundler = watchify(
        browserify('./src/js/main.js', { debug: true })
            .transform(babelify)
    );

    function rebundle() {
        bundler.bundle()
            .on('log', gutil.log)
            .on('error', gutil.log.bind(gutil.colors.red, 'Browserify Error'))
            .pipe(source('src/js/main.js'))
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
    } else {
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

gulp.task('dev_webserver', () => {
    console.log(":::: > Test page at http://localhost:3004/test.html");
    return gulp.src(['build','test','node_modules'])
        .pipe(webserver({ port: 3004 }));
});

gulp.task('sass', () => {
    return gulp.src('src/css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['defaults','not ie <= 9'],
            cascade: false
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build/css'));
});

gulp.task('templates:watch', () => {
    gulp.watch('./src/templates/**/*.hbs', ['templates']);
});

gulp.task('sass:watch', () => {
    gulp.watch('./src/css/**/*.scss', ['sass']);
});

gulp.task('templates',() => {
    gulp.src('./src/templates/**/*.hbs')
        .pipe(handlebars({
            handlebars: require('handlebars')
        }))
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            root: 'exports',
            noRedeclare: true, // Avoid duplicate declarations
            processName: function(filePath) {
                // Allow nesting based on path using gulp-declare's processNameByPath()
                // You can remove this option completely if you aren't using nested folders
                // Drop the templates/ folder from the namespace path by removing it from the filePath
                return declare.processNameByPath(filePath.replace('src/templates/', ''));
            }
        }))
        .pipe(concat('templates.js'))
        .pipe(wrap('var Handlebars = require("handlebars/runtime");\n <%= contents %>'))
        .pipe(gulp.dest('./src/js/compiled/'));
});

gulp.task('build', ['templates', 'sass', 'transpile'], (cb) => {
    pump([
        gulp.src('build/videojs-annotation-comments.js'),
        rename(FILENAME.replace(".js",".min.js")),
        stripComments(),
        uglify(),
        insert.prepend(ATTIBUTION),
        gulp.dest('./build')
    ], cb);
});

gulp.task('test', () => {
    gulp.src(['test/mocha/components/*.js'], { read: false })
        .pipe(mocha({ compilers: ['js:babel-core/register'] }));
});

gulp.task('tdd', function() {
    gulp.watch(['src/**/*.js', 'src/**/.hbs', 'test/mocha/components/*.js'], ['test']);
});

gulp.task('lint', function() {
  return gulp.src(['./src/js/*/*.js', '!./src/js/compiled/**'])
    .pipe(eslint())
    .pipe(eslint.format());
    // .pipe(eslint.failAfterError());
});

autoFixTask('fix-js', [
    './src/js/*.js',
    './src/js/*/*.js',
    '!./src/js/compiled/**'
]);

gulp.task('transpile', (cb) => compile(false, cb) );
gulp.task('bundle_watch', (cb) => compile(true, cb) );
gulp.task('watch', [
    'bundle_watch',
    'dev_webserver',
    'sass',
    'sass:watch',
    'templates',
    'templates:watch',
    'tdd'
]);
gulp.task('default', ['watch']);
