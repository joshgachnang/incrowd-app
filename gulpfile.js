var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var jade = require('gulp-jade');
var print = require('gulp-print');
var wiredep = require('wiredep').stream;
var inject = require('gulp-inject');
var angularFilesort = require('gulp-angular-filesort');


var paths = {
  src: './www',
  tmp: './.tmp',
  sass: ['./scss/**/*.scss'],
  jade: ['./www/templates/*.jade', './www/components/**/*.jade', './.tmp/index.jade'],
  js: [
    './www/lib/ionic/js/ionic.bundle.js',
    './www/{app,components}/**/*.js',
    './www/js/*.js',
    './www/incrowd/*.js',
    '!./www/angular.js',
    '!./www/settings.js',
    '!./www/app/js/config.js',
    '!./www/{app,components}/**/*.spec.js',
    '!./www/{app,components}/**/*.mock.js'
  ],
  css: [
    './www/css/*.css'
  ]
};

gulp.task('default', ['sass']);

gulp.task('partials', function () {
});

gulp.task('inject', ['partials'], function () {
  var wiredepOptions = {
    directory: './www/lib/',
    devDependencies: true,
    //exclude: [/bootstrap\.css/, /foundation\.css/],
    //name: 'bower'
  };

  // Sort scripts for angular before injecting
  var injectScripts = gulp.src(paths.js).pipe(angularFilesort());

  return gulp.src('./www/index.jade')
    .pipe(print())
    .pipe(inject(
      gulp.src(paths.css, {read: false}), {
        ignorePath: './www',
        addRootSlash: false,
        name: 'styles'
      }))
    .pipe(inject(injectScripts, {
      ignorePath: [paths.src],
      addRootSlash: false,
      name: 'angular'
    }))

    // Use relative here so it gets picked up a findable file in assets() in
    // 'html'.
    //.pipe(inject(gulp.src(paths.src + '/cache/templateCacheHtml.js',
    //  {read: false}), {name: 'cache', addRootSlash: false, relative: true}))
    //.pipe(inject(gulp.src(paths.src + '/app/js/config.js',
    //  {read: false}), {name: 'config', addRootSlash: false, relative: true}))
    .pipe(print())
    .pipe(wiredep(wiredepOptions))
    .pipe(gulp.dest(paths.tmp));
});

gulp.task('jade', ['inject'], function () {
  gulp.src(paths.jade)
    .pipe(print())
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest('./www/'));
});

gulp.task('sass', function (done) {
  gulp.src(['./scss/*.scss', './www/components/**/.scss'])
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    //.pipe(minifyCss({
    //  keepSpecialComments: 0
    //}))
    //.pipe(rename({extname: '.min.css'}))
    //.pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function () {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.jade, ['jade']);
});

gulp.task('install', ['git-check'], function () {
  return bower.commands.install()
    .on('log', function (data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function (done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
