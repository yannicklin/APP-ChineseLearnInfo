/// <binding BeforeBuild='beforeBuild' />
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'bower-files', 'del'],
    replaceString: /\bgulp[\-.]/
});

gulp.task('cleanVendor', function () {
    return plugins.del(['www/js/lib', 'www/css/lib', 'www/js/*.min.*', 'www/css/*.min.*', 'scss']);
});

gulp.task("vendor-js-css", ['cleanVendor'], function () {

    var jsFilter = plugins.filter('*.js', { restore: true }),
     cssFilter = plugins.filter('*.css', { restore: true });

    return gulp.src(plugins.bowerFiles({ dir: 'lib' })
        .self()
            .dev()
            .ext(['js', 'css'])
            .match('!**/*.min.*')
            .files)

        .pipe(jsFilter)
        .pipe(gulp.dest('www/js/lib'))
        .pipe(jsFilter.restore)

        .pipe(cssFilter)
        .pipe(gulp.dest('www/css/lib'))
        .pipe(cssFilter.restore);
});

gulp.task("ionic-scss", ['vendor-js-css'], function () {

    return gulp.src(['lib/ionic/scss/**', 'www/css/*.scss'])
        .pipe(gulp.dest('scss'));
});

gulp.task('sass-compile', ['ionic-scss'], function () {
    gulp.src('scss/chineselearn.scss')
        .pipe(plugins.sass({
            errLogToConsole: true
        }))
        .pipe(plugins.minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(plugins.rename({ extname: '.min.css' }))
        .pipe(gulp.dest('www/css'));
});

gulp.task("annoAPPJSs", ['sass-compile'], function () {

    return gulp.src('www/js/*.js')
        .pipe(plugins.ngAnnotate())
        .pipe(gulp.dest('www/js'));
});

gulp.task("minPackage", ['annoAPPJSs'], function () {

    return gulp.src('www/index-gulp.html')
        .pipe(plugins.rename("index.html"))
        .pipe(plugins.useref({}))
        .pipe(plugins.if('*.js', plugins.uglify()))
        .pipe(plugins.if('*.css', plugins.minifyCss({ keepSpecialComments: 0 })))
        .pipe(gulp.dest('www'));
});

gulp.task('beforeBuild', ['minPackage'], function () {
    return plugins.del(['www/js/lib', 'www/css/lib']);
});