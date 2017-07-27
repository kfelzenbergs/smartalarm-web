var config = require('./config.json');
var gulp = require('gulp');
var bower = require('gulp-bower');
var del = require('del');
var inject = require('gulp-inject');
var less = require('gulp-less');
var ngAnnotate = require('gulp-ng-annotate');
var runSequence = require('run-sequence');
var watch = require('gulp-watch');
var bsReq = require('browser-sync');
var bsReqSPA = require("browser-sync-spa");
var concat = require('gulp-concat');
var combiner = require('stream-combiner2');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var file = require('gulp-file');
var html2js = require('gulp-html2js');
var dateFormat = require('dateformat');
var clone = require('clone');

var browserSync = bsReq.create('dev-server');

/**
 * All components that are used from bower has to be defined here - JavaScript, CSS, images, etc.
 */
var bowerComponents = [
    'bower_components/lodash/dist/lodash.min.js',
    'bower_components/angular/angular.min.js',
    'bower_components/angular/angular.min.js.map',
    'bower_components/restangular/dist/restangular.min.js',
    'bower_components/angular-translate/angular-translate.min.js',
    'bower_components/angular-ui-router/release/angular-ui-router.min.js',
    'bower_components/angular-cookies/angular-cookies.min.js',
    'bower_components/angular-cookies/angular-cookies.min.js.map',
  'bower_components/jquery/dist/jquery.min.js',
  'bower_components/moment/moment.js',
  'bower_components/bootstrap-daterangepicker/daterangepicker.js',
  'bower_components/bootstrap-daterangepicker/daterangepicker.css',
  'bower_components/ngmap/build/scripts/ng-map.min.js'
];

/**
 * All project level JavaScript has to be defined here for their placement in build folder. Order is important.
 */
var projectJsFiles = [
    'dist/locales/**/*.js',
    'dist/app/config.js',
    'dist/app/templates.js',
    'dist/app/app.js',
    'dist/app/**/*.js'
];

/**
 * All project level LESS has to be defined here. Order is important.
 */
var lessFiles = [
    'src/less/app.less',
    'src/less/**/*.less',
    'src/app/**/*.less'
];

/**
 * All project level CSS has to be defined here for their placement in build folder. Order is important.
 */
var cssFiles = [
    'dist/css/**/*.css'
];

browserSync.use(bsReqSPA({
    selector: "[ng-app]"
}));

gulp.task('default', function () {
    console.log('----------');
    console.log('Run "gulp build:dev" for development build');
    console.log('Run "gulp build:prod" for production build');
    console.log('Run "gulp watch" for running a dev build in a browser with hot reload');
    console.log('----------');
});

/**
 * Initiate hot reload server
 */
gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    });
});

/**
 * Remove all content from "dist" folder
 */
gulp.task('clean', function () {
    return del.sync(['dist/*']);
});

/**
 * Install bower components
 */
gulp.task('bower:install', function () {
    return bower('bower_components');
});

/**
 * Copy bower components to build
 */
gulp.task('bower:copy', function () {
    return gulp.src(bowerComponents).pipe(gulp.dest('dist/components'));
});

/**
 * Copy index.html to build
 */
gulp.task('copy:index', function () {
    return gulp.src(['src/index.html']).pipe(gulp.dest('dist'));
});

/**
 * Improve and copy JavaScript to development build and skip any errors that appears in the middle of compilation
 */
gulp.task('copy:js', function () {
    var tasks = combiner.obj([
        gulp.src(['src/app/**/*.js']),
        ngAnnotate(),
        gulp.dest('dist/app')
    ]);

    // Catch errors instead of failing whole task
    tasks.on('error', console.error.bind(console));

    return tasks;
});

/**
 * Improve and copy JavaScript to production build
 */
gulp.task('copy:js:prod', function () {
    return gulp.src(['src/app/**/*.js']).pipe(ngAnnotate()).pipe(concat('app.js')).pipe(uglify()).pipe(gulp.dest('dist/app'));
});

/**
 * Create template cache by copying template to single JavaScript file
 */
gulp.task('copy:html', function () {
    return gulp.src('src/**/*.html')
        .pipe(html2js('templates.js', {
            adapter: 'angular',
            base: 'src',
            name: 'templates'
        })).pipe(gulp.dest('dist/app/'));
});

/**
 * Copy app data for development to build
 */
gulp.task('copy:app', function () {
    return runSequence('copy:js', 'copy:html');
});

/**
 * Copy app data for production to build
 */
gulp.task('copy:app:prod', function () {
    return runSequence('copy:js:prod', 'copy:html');
});

/**
 * Copy assets to build
 */
gulp.task('copy:assets', function () {
    return gulp.src(['src/assets/**/*']).pipe(gulp.dest('dist/assets'));
});

/**
 * Copy locales to build
 */
gulp.task('copy:locale', function () {
    return gulp.src(['src/locales/**/*']).pipe(gulp.dest('dist/locales'));
});

/**
 * Inject CSS and JavaScript tags into index.html
 */
gulp.task('inject', function () {
    var target = gulp.src('dist/index.html');

    var assets = [];

    var hash = getRandomHash();

    for (var i=0; i<bowerComponents.length; i++) {
        var values = bowerComponents[i].split('/');
        var asset = 'dist/components/' + values[values.length - 1];
        assets.push(asset);
    }

    assets = assets.concat(projectJsFiles);
    assets = assets.concat(cssFiles);

    var sources = gulp.src(assets, {read: false});

    return target.pipe(inject(sources, {
        ignorePath: 'dist',
        transform: function (file_path, file) {
            var path = file_path.split('/');

            if (path[1] != 'components') {
                arguments[0] = file_path + '?v=' + hash;
                return inject.transform.apply(inject.transform, arguments);
            }

            return inject.transform.apply(inject.transform, arguments);
        }
    })).pipe(gulp.dest('dist'));
});

/**
 * Compile LESS for development and skip any errors that appears in the middle of compilation
 */
gulp.task('less', function () {
    var tasks = combiner.obj([
        gulp.src(lessFiles),
        concat('app.less'),
        less(),
        gulp.dest('dist/css')
    ]);

    // Catch errors instead of failing whole task
    tasks.on('error', console.error.bind(console));

    return tasks;
});

/**
 * Compile LESS for production
 */
gulp.task('less:prod', function () {
    return gulp.src(lessFiles).pipe(concat('app.less')).pipe(less()).pipe(cleanCSS()).pipe(gulp.dest('dist/css'));
});

/**
 * Set development data on env.json file
 */
gulp.task('env:dev', function() {
    var data = clone(config['development']);
    data['build_date'] = getBuildDate();

    var config_code = 'var CONFIG = ' + JSON.stringify(data) + ';';

    return file('config.js', config_code, { src: true }).pipe(gulp.dest('dist/app'));
});

/**
 * Set production data on env.json file
 */
gulp.task('env:prod', function() {
    var data = clone(config['production']);
    data['build_date'] = getBuildDate();

    var config_code = 'var CONFIG = ' + JSON.stringify(data) + ';';

    return file('config.js', config_code, { src: true }).pipe(gulp.dest('dist/app'));
});

/**
 * Builds code, starts hot reload server and watched files for changes
 */
gulp.task('watch', function () {
    runSequence('clean', ['copy:index', 'bower:install', 'copy:app', 'copy:assets', 'copy:locale', 'env:dev'], 'bower:copy', 'less', 'inject', 'browser-sync', function () {
        // Watch if index html has changed
        watch(['src/index.html'], function () {
            runSequence('copy:index', 'inject', function () {
                browserSync.reload({stream: false});
            });
        });

        // Watch if any HTML or JavaScript under "app" folder has changed
        watch(['src/app/**/*.js', 'src/app/**/*.html', '!src/index.html'], function () {
            runSequence('copy:app', 'inject', function () {
                browserSync.reload({stream: false});
            });
        });

        // Watch if any LESS file has changed
        watch(['src/**/*.less'], function () {
            runSequence('less', 'inject', function () {
                browserSync.reload({stream: false});
            });
        });

        // Watch is assets have changed
        watch(['src/assets/**/*'], function () {
            runSequence('copy:assets', 'less', function () {
                browserSync.reload({stream: false});
            });
        });

        // Watch if locales have changed
        watch(['src/locales/*.js'], function () {
            runSequence('copy:locale', 'inject', function () {
                browserSync.reload({stream: false});
            });
        });
    });
});

/**
 * Create a development build (not compressed code)
 */
gulp.task('build:dev', function () {
    return runSequence('clean',
        ['copy:index', 'bower:install', 'copy:app', 'copy:assets', 'copy:locale', 'env:dev'], 'bower:copy', 'less', 'inject');
});

/**
 * Create a staging build (compressed code)
 */
gulp.task('build:prod', function () {
    return runSequence('clean',
        ['copy:index', 'bower:install', 'copy:app:prod', 'copy:assets', 'copy:locale', 'env:prod'], 'bower:copy', 'less:prod', 'inject');
});

var getRandomHash = function() {
    return Math.random().toString(36).substr(2);
};

var getBuildDate = function () {
    return dateFormat(new Date(), "dd-mm-yyyy HH:MM:ss");
};