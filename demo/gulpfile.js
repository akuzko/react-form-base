var gulp = require('gulp'),
  gutil = require('gulp-util')
  watchify = require('watchify'),
  browserify = require('browserify'),
  babelify = require('babelify'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  uglify = require('gulp-uglify'),
  notify = require('gulp-notify'),
  connect = require('gulp-connect'),
  prettyHrtime = require('pretty-hrtime'),

  postcss = require('gulp-postcss'),
  cssImport = require('postcss-import'),
  discard = require('postcss-discard-comments'),
  mixins = require('postcss-mixins'),
  nested = require('postcss-nested'),
  simpleVars = require('postcss-simple-vars'),
  colorFunction = require('postcss-color-function'),
  autoprefixer = require('autoprefixer');

var startTime;

gulp.task('server', function() {
  connect.server({
    livereload: true
  });
});

gulp.task('browserify', function () {
  var config = Object.assign({
    entries: ['./src/demo.jsx'],
    dest: './dist',
    extensions: ['.js', '.jsx']
  }, watchify.args);
  var bundler = watchify(browserify(config))
    .transform(babelify, { presets: ['es2015', 'react', 'stage-1'] });

  bundler.on('update', bundle);

  gutil.log(gutil.colors.yellow('Bundling. Please wait...'));

  bundle();

  function bundle() {
    startTime = process.hrtime();

    return bundler
      .bundle()
      .on('error', handleError)
      .pipe(source('demo.js'))
      .pipe(gulp.dest('./dist'))
      .on('end', bundled)
      .pipe(connect.reload());
  }

  function bundled() {
    var prettyTime = prettyHrtime(process.hrtime(startTime));
    gutil.log(gutil.colors.yellow('Bundled in ') + gutil.colors.magenta(prettyTime));
  }
});

gulp.task('css', function() {
  var processors = [
    cssImport({ path: ['./src/styles'] }),
    discard,
    mixins,
    nested,
    simpleVars,
    colorFunction,
    autoprefixer({ browsers: ['last 2 version'] })
  ];

  return gulp.src('./src/styles/demo.css')
    .pipe(postcss(processors))
    .on('error', handleError)
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});

gulp.task('bundle', function() {
  return browserify({ entries: './src/demo.jsx', dest: './dist', extensions: ['.js', '.jsx'] })
    .transform('babelify', { presets: ['es2015', 'react', 'stage-1'] })
    .bundle()
    .pipe(source('demo.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['css', 'bundle'])
gulp.task('default', ['css', 'browserify', 'server']);
gulp.watch('./src/styles/*.css', ['css']);

function handleError(err) {
  var args = Array.prototype.slice.call(arguments);

  notify.onError({
    title: 'Compile Error',
    message: '<%= error %>'
  }).apply(this, args);

  this.emit('end');
}
