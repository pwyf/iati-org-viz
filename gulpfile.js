const gulp = require('gulp')
const del = require('del')
const fs = require('fs')
const request = require('request')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const cleanCSS = require('gulp-clean-css')
const zip = require('gulp-zip')
const gutil = require('gulp-util')

const outPath = gutil.env.env === 'prod' ? './dist' : './dev'

const jsFiles = [
  './node_modules/jquery/dist/jquery.js',
  './node_modules/bootstrap/dist/js/bootstrap.js',
  './node_modules/chart.js/dist/Chart.js',
  './node_modules/numeral/numeral.js',
  './node_modules/underscore/underscore.js',
  './node_modules/xlsx/dist/xlsx.full.min.js',
  './src/js/helpers.js',
  './src/js/TimeGraph.js',
  './src/js/graphSetup.js',
  './src/js/documents.js',
  './src/js/summary.js',
  './src/js/action.js'
]

const cssFiles = [
  './node_modules/bootstrap/dist/css/bootstrap.css',
  './node_modules/@fortawesome/fontawesome-free/css/solid.css',
  './node_modules/@fortawesome/fontawesome-free/css/brands.css',
  './node_modules/@fortawesome/fontawesome-free/css/fontawesome.css',
  './src/css/**'
]

const codelists = [
  // 'Country', // TODO
  'Region',
  'Language',
  'DocumentCategory'
]

gulp.task('clean', () => {
  return del(outPath)
})

gulp.task('zip', (done) => {
  if (gutil.env.env === 'prod') {
    return gulp.src(outPath + '/**')
      .pipe(zip('extension.zip'))
      .pipe(gulp.dest('.'))
  }
  return done()
})

gulp.task('build:codelists', (done) => {
  var baseUrl = 'http://reference.iatistandard.org/203/codelists/downloads/clv2/json/en/'
  codelists.map(function (codelist) {
    return request(baseUrl + codelist + '.json')
      .pipe(fs.createWriteStream('./src/static/json/' + codelist + '.json'))
  })
  return done()
})

gulp.task('build:_core_js', () => {
  return gulp.src(jsFiles)
    .pipe(concat('js.js'))
    .pipe(gutil.env.env === 'prod' ? uglify() : gutil.noop())
    .pipe(gulp.dest(outPath + '/js'))
})

gulp.task('build:_bg_js', () => {
  return gulp.src('background.js', { cwd: './src/js' })
    .pipe(gutil.env.env === 'prod' ? uglify() : gutil.noop())
    .pipe(gulp.dest(outPath + '/js'))
})

gulp.task('build:js', gulp.parallel('build:_core_js', 'build:_bg_js'))

gulp.task('build:css', () => {
  return gulp.src(cssFiles)
    .pipe(concat('css.css'))
    .pipe(gutil.env.env === 'prod' ? cleanCSS() : gutil.noop())
    .pipe(gulp.dest(outPath + '/css'))
})

gulp.task('build:assets', () => {
  return gulp.src([
    './src/static/**',
    './node_modules/bootstrap/dist/fonts*/*',
    './node_modules/@fortawesome/fontawesome-free/webfonts*/fa-solid-*',
    './node_modules/@fortawesome/fontawesome-free/webfonts*/fa-brands-*'
  ])
    .pipe(gulp.dest(outPath))
})

gulp.task('build',
  gulp.series(
    gulp.parallel('clean', 'build:codelists'),
    gulp.parallel('build:css', 'build:js', 'build:assets'),
    'zip'))

gulp.task('watch', gulp.series(['build'], () => {
  gulp.watch('./src/**', gulp.parallel('build'))
}))

gulp.task('default', gulp.parallel('build'))
