// Gulp is a task manager for web projects
// It was installed via "npm install --save-dev -gulp"
var gulp = require('gulp');
// Usage of JSHint for code quality enforcement
// It was installed via "npm install --save-dev -gulp-jshint jshint-stylish"
var jshint = require('gulp-jshint');
// Usage of JSCS for code style enforcement
// It was installed via "npm install --save-dev -gulp-jscs"
var jscs = require('gulp-jscs');
// Nodemon is a utility that will monitor for any changes in the source and
// automatically restart the server
// It was installed via "npm install --save-dev -gulp-nodemon"
var nodemon = require('gulp-nodemon');

var jsFiles = ['*.js', 'src/**/*.js'];

// All js-Files should be checked for code quality and for code style
gulp.task('style', function() {
    return gulp.src(jsFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', {
        verbose: true
    }))
    .pipe(jscs());
});

// Automatically inject dependencies in the right order into the source files
gulp.task('inject', function() {
    // Wiredep injects dependencies from bower files in the right order into the
    // source code. In the options the bower file and where to find dependencies
    // is defined
    // It was installed via "npm install --save-dev -wiredep"
    var wiredep = require('wiredep').stream;
    var options = {
        bowerJson: require('./bower.json'), // with require the json object is returned
        directory: './public/lib', // where can all the dependencies be found
        ignorePath: '../../public' // removes that path-part from the injected path
    };

    // With Gulp-inject local dependencies (our css and javascript) get injected
    // into the source code.
    // It was installed via "npm install --save-dev -gulp-inject"
    var inject = require('gulp-inject');
    var injectSrc = gulp.src(['./public/css/*.css',
                              './public/js/*.js'],
                              {read: false}); // gulp.src reads all files, but only the filename is needed here. Therefore the read-flag is set to false.
    var injectOptions = {
        ignorePath: '/public' // removes that path-part from the injected path
    };

    // Inject
    return gulp.src(['./src/views/*.ejs', './src/views/*.jade', './src/views/*.html']) // Pull in all files which needs to be injected
        .pipe(wiredep(options)) // Inject bower dependencies
        .pipe(inject(injectSrc,injectOptions)) // Inject local dependencies
        .pipe(gulp.dest('./src/views')); // Save injected files into this directory
});

// Automatically restarts the server if there are any changes in the javascript
// files. It will always chheck for code quality and code style and injects
// dependencies on a restart.
gulp.task('serve', ['style','inject'], function() {
    var options = {
        script: 'app.js', // what is it going to run
        delayTime: 1, // It will wait a second before it runs the restart
        env: { // environment specific parameters like port or database connection
            'PORT': 3000
        },
        watch: jsFiles // changes on which files trigger a restart
    };
    return nodemon(options)
        .on('restart', function(ev) { // when nodemon restarts the server a function will log this on the console
            console.log('Restarting...');
        });
});
