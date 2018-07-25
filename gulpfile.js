var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

// Compilation dev
gulp.task('dev', function() {
    return gulp.src([
        'less/module.less',
    ])
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.plumber({
            errorHandler: plugins.notify.onError("Error: <%= error.message %>")
        }))
        .pipe(plugins.less().on('error', function(err){
            this.emit('end');
        }))
        .pipe(plugins.autoprefixer())
        .pipe(plugins.sourcemaps.write())
        .pipe(plugins.rename(function(path){
            path.dirname = path.dirname + '/../css';
            path.extname = '.css';
        }))
        .pipe(plugins.debug({title: 'Done :'}))
        .pipe(gulp.dest(function(path){
            return path.base;
        }));
});

gulp.task('watch', function () {
    gulp.watch('less/*.less', gulp.series('dev'));
});