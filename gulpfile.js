const gulp = require('gulp');
const htmlreplace = require('gulp-html-replace');

gulp.task('default', function() {
    console.log("hello world");
})

gulp.task('copy', function() {
    gulp.src(['dev/**/*','!dev/index.html','!dev/dev.js', '!dev/17-objects'])
        .pipe(gulp.dest('prod'));
})

gulp.task('switchjs', function() {
    gulp.src('dev/index.html')
        .pipe(htmlreplace({
            'js': 'prod.js',
            'form': ''
        }))
        .pipe(gulp.dest('prod'));
})

gulp.task('prod', ['copy', 'switchjs']);

gulp.task('watch', ['copy', 'switchjs'], function() {
    gulp.watch(['dev/**/*','!dev/index.html','!dev/dev.js'], ['copy']);
    gulp.watch('dev/index.html', ['switchjs']);
})