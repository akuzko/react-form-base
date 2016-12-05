var gulp = require('gulp'),
  gutil = require('gulp-util')
  watchify = require('watchify'),
  browserify = require('browserify'),
  babelify = require('babelify'),
  source = require('vinyl-source-stream'),
  notify = require('gulp-notify'),
  connect = require('gulp-connect'),
  prettyHrtime = require('pretty-hrtime');

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

  gutil.log(gutil.colors.green('Bundling. Please wait...'));

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

  function handleError(err) {
    var args = Array.prototype.slice.call(arguments);

    notify.onError({
      title: 'Compile Error',
      message: '<%= error %>'
    }).apply(this, args);

    this.emit('end');
  }

  function bundled() {
    var prettyTime = prettyHrtime(process.hrtime(startTime));
    gutil.log('Bundled in ' + gutil.colors.magenta(prettyTime));
  }
});

gulp.task('default', ['browserify', 'server']);
