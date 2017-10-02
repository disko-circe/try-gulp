var gulp = require ('gulp'); // on va chercher le package gulp dans les node modules afin d'avoir l'API Gulp
var sass = require('gulp-sass'); // on cherche le package gulp-sass
var browserSync = require ('browser-sync').create(); // on utilise le package browser afin de reload en live la page
var useref = require ('gulp-useref'); // on utilise le package gulp useref pour générer un fichier JS regroupant le JS d'autres fichiers
var notify = require ('gulp-notify'); // on utilise le package notify afin d'envoyer des notifations/des messages
var plumber = require ('gulp-plumber'); // plumber permet de patcher le problème de stream, il remplace la méthode pipe
var sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function() {
  return gulp.src('app/scss/*.scss')
    .pipe(plumber({ errorHandler: function(err) { // on étend le plugin plumber en passant un object avec la propriété errorHandler puis on appelle le plugin de notification
      notify.onError({
        title: "Gulp error in "+ err.plugin,
        message: err.toString()
      })(err);
    }}))
    .pipe(sass()) //on utilise le gulp-sass qui compile le sass dans le css
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('watch', ['browserSync', 'sass'], function() {
  gulp.watch('app/scss/*scss', ['sass']); //syntax du watch gulp : on watch tous les fichiers en .scss du dossier scss
  gulp.watch('app/*.html',browserSync.reload);  // on reload automatiquement le browser lorsque le html est modifié
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
});

gulp.task('useref', function() {
  return gulp.src('app/*.html') // dossier source
    .pipe(useref()) // permet de compiler dans un seul fichier les fichier encadrés dans les commentaires JS
    .pipe(gulp.dest('dist')) // dossier de destination
});
