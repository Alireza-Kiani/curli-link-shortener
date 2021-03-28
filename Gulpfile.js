var gulp = require('gulp');
var concatCss = require('gulp-concat-css');

gulp.task('default', function () {
    return gulp.src('src/public/style/*.css')
        .pipe(concatCss("bundle.css"))  
        .pipe(gulp.dest('out/'));
});