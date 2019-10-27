const gulp = require("gulp"),
  sourcemaps = require("gulp-sourcemaps"),
  source = require("vinyl-source-stream"),
  buffer = require("vinyl-buffer"),
  browserify = require("browserify"),
  watchify = require("watchify"),
  insert = require("gulp-insert"),
  babelify = require("babelify"),
  stripComments = require("gulp-strip-comments"),
  rename = require("gulp-rename"),
  webserver = require("gulp-webserver"),
  uglify = require("gulp-uglify"),
  gutil = require("gulp-util"),
  sass = require("gulp-sass"),
  debug = require("gulp-debug"),
  pump = require("pump"),
  mocha = require("gulp-mocha"),
  jshint = require("gulp-jshint"),
  stylish = require("jshint-stylish"),
  handlebars = require("gulp-handlebars"),
  wrap = require("gulp-wrap"),
  concat = require("gulp-concat"),
  declare = require("gulp-declare"),
  autoprefixer = require("gulp-autoprefixer");

const FILENAME = "videojs-annotation-comments.js";
const CJSFILENAME = "videojs-annotation-comments.cjs.js";
const PACKAGE = require("./package.json");

//compilation function for browserify/bundler/transpilation
function compile(watch, cb) {
  var bundlerDefault = {
    entry: "./src/js/index.js",
    browserifyOptions: { debug: true },
    transformOptions: {},
    filename: FILENAME
  };

  var bundlerCjs = {
    entry: "./src/js/annotation_comments.js",
    browserifyOptions: {
      debug: true,
      standalone: "AnnotationComments"
    },
    transformOptions: {
      presets: ["es2015"],
      plugins: ["babel-plugin-transform-es2015-modules-simple-commonjs"]
    },
    filename: CJSFILENAME
  };

  function buildStream(bundler) {
    return browserify(bundler.entry, bundler.browserifyOptions).transform(
      babelify,
      bundler.transformOptions
    );
  }

  function rebundle(bundlers) {
    for (b of bundlers) {
      var browserifyStream = watch ? watchify(buildStream(b)) : buildStream(b);

      browserifyStream
        .bundle()
        .on("log", gutil.log)
        .on("error", gutil.log.bind(gutil.colors.red, "Browserify Error"))
        .pipe(source("src/js/index.js"))
        .pipe(buffer())
        .pipe(rename(b.filename))
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./build"));
    }
  }

  if (watch) {
    rebundle([bundlerDefault]);
    buildStream(bundlerDefault).on("update", function() {
      console.log("-> bundling...");
      rebundle([bundlerDefault]);
    });
  } else {
    rebundle([bundlerDefault, bundlerCjs]);
    cb();
  }
}

gulp.task("dev_webserver", () => {
  console.log(":::: > Test page at http://localhost:3004/test.html");
  return gulp
    .src(["build", "test", "node_modules"])
    .pipe(webserver({ port: 3004 }));
});

gulp.task("sass", () => {
  return gulp
    .src("src/css/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        browsers: ["defaults", "not ie <= 9"],
        cascade: false
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./build/css"))
    .pipe(gulp.dest("./docs/build/css"));
});

gulp.task("templates:watch", () => {
  gulp.watch("./src/templates/**/*.hbs", ["templates"]);
});

gulp.task("sass:watch", () => {
  gulp.watch("./src/css/**/*.scss", ["sass"]);
});

gulp.task("transpile:watch", () => {
  gulp.watch("./src/js/**/*", ["transpile"]);
});

gulp.task("templates", () => {
  gulp
    .src("./src/templates/**/*.hbs")
    .pipe(
      handlebars({
        handlebars: require("handlebars")
      })
    )
    .pipe(wrap("Handlebars.template(<%= contents %>)"))
    .pipe(
      declare({
        root: "exports",
        noRedeclare: true, // Avoid duplicate declarations
        processName: function(filePath) {
          // Allow nesting based on path using gulp-declare's processNameByPath()
          // You can remove this option completely if you aren't using nested folders
          // Drop the templates/ folder from the namespace path by removing it from the filePath
          return declare.processNameByPath(
            filePath.replace("src/templates/", "")
          );
        }
      })
    )
    .pipe(concat("templates.js"))
    .pipe(
      wrap('var Handlebars = require("handlebars/runtime");\n <%= contents %>')
    )
    .pipe(gulp.dest("./src/js/compiled/"));
});

gulp.task("build", ["templates", "sass", "transpile"], cb => {
  pump([
    gulp.src("build/videojs-annotation-comments.js"),
    rename(FILENAME.replace(".js", ".min.js")),
    stripComments(),
    uglify(),
    gulp.dest("./build")
  ]);

  pump(
    [
      gulp.src("build/videojs-annotation-comments.cjs.js"),
      rename(CJSFILENAME.replace(".js", ".min.js")),
      stripComments(),
      uglify(),
      gulp.dest("./build"),
      gulp.dest("./docs/build")
    ],
    cb
  );
});

gulp.task("test", () => {
  gulp.src(["test/mocha/components/*.js"], { read: false }).pipe(mocha());
});

gulp.task("tdd", function() {
  gulp.watch(
    ["src/**/*.js", "src/**/.hbs", "test/mocha/components/*.js"],
    ["test"]
  );
});

gulp.task("lint", function() {
  return gulp
    .src("./src/*/*.js")
    .pipe(jshint(".jshintrc"))
    .pipe(jshint.reporter(stylish));
});

gulp.task("transpile", cb => compile(false, cb));
gulp.task("bundle_watch", cb => compile(true, cb));
gulp.task("watch", [
  "dev_webserver",
  "templates:watch",
  "sass:watch",
  "transpile:watch",
  "tdd"
]);
gulp.task("default", ["watch"]);
