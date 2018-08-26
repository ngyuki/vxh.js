const gulp = require('gulp');
const babel = require('gulp-babel');
const debug = require('gulp-debug');
const changed = require('gulp-changed');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

gulp.task('default', ['watch', 'bs']);

gulp.task('watch', () => {
    gulp.watch(['src/**/*.html'], ['html']);
    gulp.watch(['src/**/*.js'], ['js']);
});

gulp.task('html', () => gulp.src('src/**/*.html')
    .pipe(changed('dist'))
    .pipe(gulp.dest('dist'))
    .pipe(debug({title: 'html'}))
    .pipe(reload({stream: true}))
);

gulp.task('js', () => gulp.src('src/**/*.js')
    .pipe(plumber())
    .pipe(changed('dist'))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
    .pipe(debug({title: 'js'}))
    .pipe(reload({stream: true}))
);

gulp.task('js:min', () => gulp.src('src/**/*.js')
    .pipe(changed('dist'))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(rename({extname: '.min.js'}))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
    .pipe(debug({title: 'js'}))
    .pipe(reload({stream: true}))
);

gulp.task('bs', () => {
    browserSync({
        server: "dist/",
        open: false,
        ghostMode: false,
    });
});

gulp.task('bs:reload', () => {
    browserSync.reload();
});
