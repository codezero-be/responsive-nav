var gulp        = require('gulp'),
    gutil       = require('gulp-util'),         //=> Gulp utilities (--dev, noop(), ...)
    runSequence = require('gulp-sequence'),     //=> Run tasks synchronously
    del         = require('del'),               //=> Remove files with patterns
    concat      = require('gulp-concat'),
    rename      = require("gulp-rename"),
    sourcemaps  = require('gulp-sourcemaps'),
    browserify  = require('gulp-browserify'),   //=> Compile JavaScript files with their dependencies
    uglify      = require('gulp-uglify'),
    sass        = require('gulp-sass'),
    combineMq   = require('gulp-combine-media-queries'),
    prefix      = require('gulp-autoprefixer'),
    cssmin      = require('gulp-cssmin'),
    iconfont    = require('gulp-iconfont'),
    iconfontcss = require('gulp-iconfont-css'),
    phpspec     = require('gulp-phpspec'),
    imagemin    = require('gulp-imagemin'),
    newer       = require('gulp-newer'),
    browserSync = require('browser-sync'),
    notifier    = require('node-notifier'),     //=> For notifications not via .pipe()
    notify      = require('gulp-notify');       //=> For notifications via .pipe()

// ====================================================================================
// ~~~ CONFIGURATION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ====================================================================================

var dev = !! gutil.env.dev;
var production = ! dev;
var config = {};

/**
 * CSS Configuration
 */

config.css = {
    sourceMaps: dev,
    combineMediaQueries: production,

    // Auto-Prefix Settings
    autoPrefix: {
        enabled: true,
        browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
    },

    // SASS Settings
    sass: {
        minify: false,
        src: 'assets/sass/',
        dest: 'public/css/',
        clearCompiled: false //=> This will delete all *.css files from the dest folder when all tasks are done!
    },

    // Concatenation Settings
    concat: {
        minify: false,
        files: [],
        outputFilename: 'styles.css',
        dest: 'public/css/'
    },

    // Minify Files Settings
    minify: {
        enabled: true,
        files: [
            'public/css/*.css',
            '!public/css/*.min.css' //=> Not already minified files
        ],
        suffix: '.min',
        dest: 'public/css/'
    }
};

/**
 * JS Configuration
 */

config.js = {
    sourceMaps: dev,

    // Browserify Settings
    browserify: {
        uglify: false,
        src: 'assets/js/',
        mainFilename: 'main.js',
        dest: 'compiled/',
        clearCompiled: production //=> This will delete all *.js files from the dest folder when all tasks are done!
    },

    // Concatenation Settings
    concat: {
        uglify: false,
        files: [],
        outputFilename: 'scripts.js',
        dest: 'public/js/'
    },

    // Minify Files Settings
    uglify: {
        enabled: true,
        files: [
            'assets/js/*.js',
            '!assets/js/*.min.js' //=> Not already minified files
        ],
        suffix: '.min',
        dest: 'public/js/'
    }
};

/**
 * Copy Files Configuration
 */

config.copy = {
    enabled: true,
    files: {
        // To avoid task naming conflicts, always start
        // your files object name with "Copy":
        // CopyJS, CopyCSS, CopyWhatever
        CopyJS: {
            src: [
                "bower_components/rem-unit-polyfill/js/rem.min.js",
                "bower_components/html5shiv/dist/html5shiv.min.js"
                //'assets/js/*.js'
            ],
            dest: "public/js/"
        },
        CopyCSS: {
            src: [
                "bower_components/normalize.css/normalize.css"
            ],
            dest: "public/css/"
        }
    }
};

/**
 * Icon Font Configuration
 */

config.iconFont = {
    name : 'icon-font',
    src: 'assets/icon-font/',
    dest: 'public/fonts/',
    css : {
        template: 'assets/icon-font-template.scss',
        dest: config.css.sass.src + '_icon-font.scss',
        fontPath: '../fonts/' //=> Relative path from the CSS file to the font
    }
};

/**
 * Image Optimalization Configuration
 */

config.images = {
    src: 'assets/images/',
    dest: 'public/images/'
};

/**
 * PHPSpec Configuration
 */

// Make sure you also set the correct
// mappings in phpspec.yml
config.phpspec = {
    spec: 'spec/',
    php: 'src/'
};

/**
 * Browser Sync Configuration
 */

config.sync = {
    root: 'public/',
    proxy: null, //=> Don't start a server but use an existing host (ex.: "app.dev")
    open: "external" //=> Open browser automatically (false|"local"|"external")
};

// ====================================================================================
// ~~~ DEFAULT TASK ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ====================================================================================

if (dev) {
    gulp.task('default', function (cb) {
        runSequence('copy', 'images', 'icon-font', 'css', 'js', 'watch', cb);
    });
} else {
    gulp.task('default', function (cb) {
        runSequence('copy', 'images', 'icon-font', 'css', 'js', cb);
    });
}

gulp.task('watch', ['serve', 'watch-copy', 'watch-images', 'watch-icon-font', 'watch-css', 'watch-js']);

// ====================================================================================
// ~~~ BROWSER SYNC ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ====================================================================================

/**
 * Sync Browsers
 */

var bsOptions = {
    // Watch these files for changes
    files: [
        config.sync.root + "**/*.css",
        config.sync.root + "**/*.html",
        config.sync.root + "**/*.php",
        config.sync.root + "**/*.js"
    ],
    // Don't show any notifications in the browser
    notify: false,
    // Open browser automatically
    open: config.sync.open
};

if (config.sync.proxy) {
    bsOptions.proxy = config.sync.proxy
} else {
    bsOptions.server = {
        baseDir: config.sync.root
    }
}

gulp.task('serve', function () {
    gutil.log(gutil.colors.green('Starting BrowserSync...'));
    browserSync(bsOptions);
});

// ====================================================================================
// ~~~ CSS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ====================================================================================

/**
 * Compile SASS:
 * - Compile SASS with source maps (dev)
 * - Compile SASS without source maps (production)
 * - Combine media queries (production) (source maps won't work well with this)
 * - Add browser prefixes
 * - Minify CSS
 */

gulp.task('compile-sass', function () {
    // Fetch SASS files
    return gulp.src(config.css.sass.src + '**/*.scss')

        // Start SASS source map
        .pipe(config.css.sourceMaps ? sourcemaps.init() : gutil.noop())

        // Compile SASS
        .pipe(sass())
        .on('error', notifySASSError)

        // Save SASS source map
        .pipe(config.css.sourceMaps ? sourcemaps.write() : gutil.noop())

        // Start new source map and load SASS source map
        .pipe(config.css.sourceMaps ? sourcemaps.init({loadMaps: true}) : gutil.noop())

        // Combine media queries (source maps won't work well with this)
        .pipe(config.css.combineMediaQueries ? combineMq() : gutil.noop())

        // Add browser prefixes
        .pipe(config.css.autoPrefix.enabled ? prefix(config.css.autoPrefix.browsers) : gutil.noop())

        // Minify CSS
        .pipe(config.css.sass.minify ? cssmin({keepSpecialComments: 0}) : gutil.noop())

        // Save source map
        .pipe(config.css.sourceMaps ? sourcemaps.write() : gutil.noop())

        // Save compiled CSS file
        .pipe(gulp.dest(config.css.sass.dest));
});

/**
 * SASS Task with notification
 */

gulp.task('sass', function (cb) {
    runSequence('compile-sass', 'css-notification', cb);
});

/**
 * SASS Watcher
 */

gulp.task('watch-sass', function () {
    gulp.watch(config.css.sass.src + '**/*.scss', ['sass']);
});

/**
 * Concatenate CSS:
 * - Concatenate CSS files with source maps (dev)
 * - Concatenate CSS files without source maps (production)
 * - Combine media queries (production) (source maps won't work well with this)
 * - Add browser prefixes
 * - Minify CSS
 */

gulp.task('concat-css', function () {
    // Fetch CSS files
    return gulp.src(config.css.concat.files)

        // Start source map
        .pipe(config.css.sourceMaps ? sourcemaps.init({loadMaps: true}) : gutil.noop())

        // Concatenate files
        .pipe(concat(config.css.concat.outputFilename))

        // Combine media queries (source maps won't work well with this)
        .pipe(config.css.combineMediaQueries ? combineMq() : gutil.noop())

        // Add browser prefixes
        .pipe(config.css.autoPrefix.enabled ? prefix(config.css.autoPrefix.browsers) : gutil.noop())

        // Minify CSS
        .pipe(config.css.concat.minify ? cssmin({keepSpecialComments: 0}) : gutil.noop())

        // Save source map
        .pipe(config.css.sourceMaps ? sourcemaps.write() : gutil.noop())

        // Save output to destination folder
        .pipe(gulp.dest(config.css.concat.dest));
});

/**
 * Minify CSS Files
 */

gulp.task('minify-css', function (cb) {
    // Only run if minify is enabled
    if (config.css.minify.enabled) {
        // Fetch CSS files
        return gulp.src(config.css.minify.files)

            // Start source map
            .pipe(config.css.sourceMaps ? sourcemaps.init({loadMaps: true}) : gutil.noop())

            // Minify CSS
            .pipe(cssmin({keepSpecialComments: 0}))

            // Add file suffix
            .pipe(rename({suffix: config.css.minify.suffix}))

            // Save source map
            .pipe(config.css.sourceMaps ? sourcemaps.write() : gutil.noop())

            // Save files to destination folder
            .pipe(gulp.dest(config.css.minify.dest));
    }

    cb();
});

/**
 * Clean Up CSS Output (production)
 */

gulp.task('cleanup-css', function (cb) {
    config.css.sass.clearCompiled
        ? del([config.css.sass.dest + '*.css'], cb)
        : cb();
});

/**
 * Default CSS Task:
 * - Compile SASS
 * - Concatenate
 * - Minify
 * - Clean Up Output
 */

gulp.task('css', function (cb) {
    runSequence('compile-sass', 'concat-css', 'minify-css', 'cleanup-css', 'css-notification', cb);
});

/**
 * CSS Watcher
 */

gulp.task('watch-css', function () {
    gulp.watch(config.css.sass.src + '**/*.scss', ['css']);
});

/**
 * Show CSS Success Notification
 */

gulp.task('css-notification', function () {
    notifySuccess('CSS Compiled Successfully!');
});

// ====================================================================================
// ~~~ JAVASCRIPT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ====================================================================================

/**
 * Browserify JS:
 * - Compile the main JS file with it's dependencies/modules
 * - Use source maps (dev)
 * - Uglify JS
 */

gulp.task('browserify-js', function () {
    // Fetch JS files
    return gulp.src(config.js.browserify.src + config.js.browserify.mainFilename)

        // Compile main JS file with dependencies/modules
        .pipe(browserify({debug: config.js.sourceMaps}))
        .on('error', notifyJSError)

        // Start source map
        .pipe(config.js.sourceMaps ? sourcemaps.init({loadMaps: true}) : gutil.noop())

        // Uglify JS (production)
        .pipe(config.js.browserify.uglify ? uglify() : gutil.noop())

        // Save source map
        .pipe(config.js.sourceMaps ? sourcemaps.write() : gutil.noop())

        // Save output to destination folder
        .pipe(gulp.dest(config.js.browserify.dest));
});

/**
 * Browserify JS Task with notification
 */

gulp.task('browserify', function (cb) {
    runSequence('browserify-js', 'js-notification', cb);
});

/**
 * Browserify JS Watcher
 */

gulp.task('watch-browserify', function () {
    gulp.watch(config.js.browserify.src + '**/*.js', ['browserify']);
});

/**
 * Concatenate JS:
 * - Concatenate JS files with source maps (dev)
 * - Concatenate JS files without source maps (production)
 * - Uglify JS
 */

gulp.task('concat-js', function () {
    // Fetch CSS files
    return gulp.src(config.js.concat.files)

        // Start source map
        .pipe(config.js.sourceMaps ? sourcemaps.init({loadMaps: true}) : gutil.noop())

        // Concatenate files
        .pipe(concat(config.js.concat.outputFilename))

        // Uglify JS (production)
        .pipe(config.js.concat.uglify ? uglify() : gutil.noop())

        // Save source map
        .pipe(config.js.sourceMaps ? sourcemaps.write() : gutil.noop())

        // Save output to destination folder
        .pipe(gulp.dest(config.js.concat.dest));
});

/**
 * Uglify JS:
 */

gulp.task('uglify-js', function () {
    // Fetch CSS files
    return gulp.src(config.js.uglify.files)

        // Start source map
        .pipe(config.js.sourceMaps ? sourcemaps.init({loadMaps: true}) : gutil.noop())

        // Uglify JS
        .pipe(uglify())

        // Add file suffix
        .pipe(rename({suffix: config.js.uglify.suffix}))

        // Save source map
        .pipe(config.js.sourceMaps ? sourcemaps.write() : gutil.noop())

        // Save output to destination folder
        .pipe(gulp.dest(config.js.uglify.dest));
});

/**
 * Clean Up JS Output (production)
 */

gulp.task('cleanup-js', function (cb) {
    config.js.browserify.clearCompiled
        ? del([config.js.browserify.dest + '*.js'], cb)
        : cb();
});

/**
 * Show JS Success Notification
 */

gulp.task('js-notification', function () {
    notifySuccess('JS Compiled Successfully!');
});

/**
 * Default JS Task:
 * - Browserify
 * - Concatenate
 * - Uglify
 * - Clean Up Output
 */

gulp.task('js', function (cb) {
    runSequence('browserify-js', 'concat-js', 'uglify-js', 'cleanup-js', 'js-notification', cb);
});

/**
 * JS Watcher
 */

gulp.task('watch-js', function () {
    gulp.watch(config.js.browserify.src + '**/*.js', ['js']);
});

// ====================================================================================
// ~~~ COPY FILES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ====================================================================================

/**
 * Generate Tasks:
 * - Create a task for each object in config.copy.files
 */

// Get the key names of the objects in config.copy.files
var copyTasks = Object.keys(config.copy.files);

if (config.copy.enabled) {
    // Loop through the objects in config.copy.files
    copyTasks.forEach(function (taskName) {

        // Fetch the src files array from the current object
        var files = config.copy.files[taskName];

        // Create task
        return gulp.task(taskName, function () {

            // Load files
            var stream = gulp.src(files.src)

                // Only process the ones that changed
                .pipe(newer(files.dest))

                // Save files in destination folder
                .pipe(gulp.dest(files.dest));

            notifySuccess(taskName + ': Files Copied Successfully!');

            return stream;
        });
    });
}

/**
 * Run Generated Tasks
 */

gulp.task('copy', function (cb) {
    config.copy.enabled
        ? runSequence(copyTasks, cb)
        : cb();
});

/**
 * Copy Files Watcher
 */

gulp.task('watch-copy', function (cb) {
    config.copy.enabled
        ? addCopyFileWatchers()
        : cb();
});

function addCopyFileWatchers() {
    // For some reason, if you run the copy and watch-copy tasks in a row (default gulp task),
    // then "copyTasks" is at this point an array of empty objects instead of an array of strings. Weird....?
    // If you run the tasks separately, the "copyTasks" var stays intact...
    // For now let's just redefine the array...
    copyTasks = Object.keys(config.copy.files);

    copyTasks.forEach(function (taskName) {
        gulp.watch(config.copy.files[taskName].src, [taskName]);
    });
}

// ====================================================================================
// ~~~ ICON FONT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ====================================================================================

/**
 * Compile Icon Font
 */

gulp.task('icon-font', function () {
    // Fetch SVG files
    var stream = gulp.src([config.iconFont.src + '*.svg'], {base: '.'})

        // Create font CSS
        .pipe(iconfontcss({
            fontName: config.iconFont.name,
            path: config.iconFont.css.template,
            targetPath: getRoot(config.iconFont.dest) + config.iconFont.css.dest,
            fontPath: config.iconFont.css.fontPath
        }))

        // Create font
        .pipe(iconfont({fontName: config.iconFont.name, normalize: true}))

        // Save font files
        .pipe(gulp.dest(config.iconFont.dest));

    notifySuccess('Icon Font Compiled Successfully!');

    return stream;
});

/**
 * Icon Font Watcher
 */

gulp.task('watch-icon-font', function () {
    gulp.watch(config.iconFont.src + '*.svg', ['icon-font']);
});

// ====================================================================================
// ~~~ IMAGE OPTIMIZATION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ====================================================================================

/**
 * Optimize Images
 */

gulp.task('images', function () {
    // Fetch original images
    var stream = gulp.src(config.images.src + '**')

        // Only process the ones that changed
        .pipe(newer(config.images.dest))

        // Optimize images
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}]
        }))

        // Save optimized images
        .pipe(gulp.dest(config.images.dest));

    notifySuccess('All Images Optimized!');

    return stream;
});

/**
 * Image Optimization Watcher
 */

gulp.task('watch-images', function () {
    gulp.watch([config.images.src + '**'], ['images']);
});

// ====================================================================================
// ~~~ PHPSPEC ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ====================================================================================

/**
 * Run PHPSpec Tests
 */

gulp.task('run-phpspec', function () {
    // Fetch tests
    var stream = gulp.src(config.phpspec.spec + '**/*.php')

        // Run tests
        .pipe(phpspec('', {notify: true}))
        .on('error', notifyPHPSpecError);

    notifySuccess('PHPSpec: All Tests Successful!');

    return stream;
});

/**
 * PHPSpec Watcher
 */

gulp.task('phpspec', ['phpspec-once'], function () {
    gulp.watch([config.phpspec.spec + '**/*.php', config.phpspec.php + '**/*.php'], ['run-phpspec']);
});

// ====================================================================================
// ~~~ HELPER METHODS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ====================================================================================

/**
 * Get Project Root
 */

function getRoot(path) {
    var backPath = '',
        depth = (path.match(/\//g) || []).length;

    for (var i = 0; i < depth; i++) {
        backPath += '../';
    }

    return backPath;
}

/**
 * Suppress Plugin Console Output
 */

var glog = gutil.log;

gutil.log = function () {
    var args = Array.prototype.slice.call(arguments);

    if (args.length) {
        if (/^.*gulp-imagemin|gulp-svgicons2svgfont.*$/.test(args[0])){
            return;
        }
    }

    return glog.apply(console, args);
};

/**
 * Error Notification
 */

// Keep track of errors for
// success notification...
var hasErrors = false;

function notifyError(title, message, error) {
    hasErrors = true;

    notify.onError({
        title: title,
        message: message,
        sound: 'Sosumi'
        //icon: __dirname + '/fail.png'
    })(error);

    console.log(error.toString());
    gutil.log(gutil.colors.red(message));
}

/**
 * Success Notification
 */

function notifySuccess(message) {
    if (hasErrors == false) {
        notifier.notify({
            title: 'Yaaay!',
            message: message
        });

        gutil.log(gutil.colors.green(message));
    }

    hasErrors = false;
}

/**
 * Error Handlers
 */

function notifySASSError(error) {
    var title = 'Ooops...',
        message = 'Error Compiling SASS!';

    notifyError(title, message, error);

    this.emit('end');
}

function notifyJSError(error) {
    var title = 'Ooops...',
        message = 'Error Compiling JS!';

    notifyError(title, message, error);

    this.emit('end');
}

function notifyPHPSpecError(error) {
    var title = 'Ooops...',
        message = 'PHPSpec Tests Failed!';

    notifyError(title, message, error);

    this.emit('end');
}