var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('build', function () {
    return gulp.src('./src/**')
        .pipe(babel({
            plugins: ['transform-object-rest-spread'],
            presets: ['es2015', 'react']
        }))
        .pipe(gulp.dest('./lib'));
});

gulp.task('default', ['build']);
