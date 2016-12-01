/* jshint node: true */
"use strict";

var fs = require('fs');
var path = require('path');

var gulp = require('gulp');

// Load all gulp plugins automatically
// and attach them to the `plugins` object
var plugins = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'merge-stream'],
    replaceString: /\bgulp[\-.]/,
    rename: {'merge-stream': 'merge'}
});

// Temporary solution until gulp 4
// https://github.com/gulpjs/gulp/issues/355
var runSequence = require('run-sequence');

var pkg = require('./package.json');
var dirs = pkg['h5bp-configs'].directories;

// ---------------------------------------------------------------------
// | Helper tasks                                                      |
// ---------------------------------------------------------------------

gulp.task('archive:create_archive_dir', function () {
    fs.mkdirSync(path.resolve(dirs.archive), '0755');
});

gulp.task('archive:zip', function (done) {

    var archiveName = path.resolve(dirs.archive, pkg.name + '_v' + pkg.version + '.zip');
    var archiver = require('archiver')('zip');
    var files = require('glob').sync('**/*.*', {
        'cwd': dirs.dist,
        'dot': true // include hidden files
    });
    var output = fs.createWriteStream(archiveName);

    archiver.on('error', function (error) {
        done();
        throw error;
    });

    output.on('close', done);

    files.forEach(function (file) {

        var filePath = path.resolve(dirs.dist, file);

        // `archiver.bulk` does not maintain the file
        // permissions, so we need to add files individually
        archiver.append(fs.createReadStream(filePath), {
            'name': file,
            'mode': fs.statSync(filePath).mode
        });

    });

    archiver.pipe(output);
    archiver.finalize();

});

gulp.task('clean', function (done) {
    require('del')([
        dirs.archive,
        dirs.dist
    ]).then(function () {
        done();
    });
});

gulp.task('copy', [
    'copy:.htaccess',
    'copy:html',
    'copy:angular',
    'copy:jquery',
    'copy:bootstrap-js',
    'copy:bootstrap-css',
    'copy:bootstrap-fonts',
    'copy:license',
    'copy:main.css',
    'copy:misc'
]);

gulp.task('copy:.htaccess', function () {
    return gulp.src('node_modules/apache-server-configs/dist/.htaccess')
               .pipe(plugins.replace(/# ErrorDocument/g, 'ErrorDocument'))
               .pipe(gulp.dest(dirs.dist));
});

gulp.task('copy:html', function () {
    return gulp.src(dirs.src + '/*.html')
               .pipe(plugins.replace(/{{JQUERY_VERSION}}/g, pkg.dependencies.jquery))
               .pipe(plugins.replace(/\^/g, ''))
               .pipe(gulp.dest(dirs.dist));
});

gulp.task('copy:angular', function () {
    return gulp.src(['node_modules/angular/angular.js'])
               .pipe(gulp.dest(dirs.dist + '/js/vendor'));
});

gulp.task('copy:jquery', function () {
    return gulp.src(['node_modules/jquery/dist/jquery.min.js'])
               .pipe(plugins.rename('jquery-' + pkg.dependencies.jquery + '.min.js'))
               .pipe(gulp.dest(dirs.dist + '/js/vendor'));
});

gulp.task('copy:bootstrap-js', function () {
    return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js'])
               .pipe(gulp.dest(dirs.dist + '/js/vendor'));
});

gulp.task('copy:bootstrap-css', function () {
    return gulp.src(['node_modules/bootstrap/dist/css/bootstrap.min.css'])
               .pipe(gulp.dest(dirs.dist + '/css'));
});

gulp.task('copy:bootstrap-fonts', function () {
    return gulp.src(['node_modules/bootstrap/dist/fonts/*'])
               .pipe(gulp.dest(dirs.dist + '/fonts'));
});

gulp.task('copy:license', function () {
    return gulp.src('LICENSE.txt')
               .pipe(gulp.dest(dirs.dist));
});

gulp.task('copy:main.css', function () {
    var banner = '/*! HTML5 Boilerplate v' + pkg.version +
        ' | ' + pkg.license.type + ' License' +
        ' | ' + pkg.homepage + ' */\n\n';

    var sassStream,
        cssStream;

    //compile sass
    sassStream = gulp.src(dirs.src + '/css/scss/**/*.scss')
        .pipe(plugins.sass({
            errLogToConsole: true
        }));

    //select additional css files
    cssStream = gulp.src(dirs.src + '/css/main.css');

    //merge the two streams and concatenate their contents into a single file
    return plugins.merge(sassStream, cssStream)
        .pipe(plugins.concat('main.css'))
        .pipe(plugins.header(banner))
        .pipe(plugins.autoprefixer({
            browsers: ['last 2 versions', 'ie >= 8', '> 1%'],
            cascade: false
        }))
        .pipe(gulp.dest(dirs.dist + '/css'));
});

gulp.task('copy:misc', function () {
    return gulp.src([

        // Copy all files
        dirs.src + '/**/*',

        // Exclude the following files
        // (other tasks will handle the copying of these files)
        '!' + dirs.src + '/css/main.css',
        '!' + dirs.src + '/css/{scss,scss/**}',
        '!' + dirs.src + '/*.html'

    ], {

        // Include hidden files by default
        dot: true

    }).pipe(gulp.dest(dirs.dist));
});

gulp.task('lint:js', function () {
    return gulp.src([
        'gulpfile.js',
        dirs.src + '/js/*.js',
        dirs.test + '/*.js'
    ]).pipe(plugins.jscs())
      .pipe(plugins.jshint())
      .pipe(plugins.jshint.reporter('jshint-stylish'))
      .pipe(plugins.jshint.reporter('fail'));
});


// ---------------------------------------------------------------------
// | Main tasks                                                        |
// ---------------------------------------------------------------------

gulp.task('archive', function (done) {
    runSequence(
        'build',
        'archive:create_archive_dir',
        'archive:zip',
    done);
});

gulp.task('build', function (done) {
    runSequence(
        ['clean', 'lint:js'],
        'copy',
    done);
});

gulp.task('default', ['build']);
