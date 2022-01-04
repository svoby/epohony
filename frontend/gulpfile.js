const del = require('del');
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const eslint = require('gulp-eslint');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync');
const svgSprite = require('gulp-svg-sprite');
const pug = require('gulp-pug');
const fs = require('fs');
const prettier = require('gulp-prettier');
const purgecss = require('gulp-purgecss')
const browserify = require('browserify');
const vinyl = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const babelify = require('babelify');
const gulpif = require('gulp-if');

const { reload } = browserSync;
const Promise = require('promise');
const { src, dest } = require('gulp');

// Set default build stage for sourcemaps etc.
let DEVELOPMENT_BUILD = false;

/*-----------------------------------------------
|   Paths
-----------------------------------------------*/

const JS = '../public/build/js';
const lib = '../public/build/lib';
const Paths = {
  HERE: './',
  PAGES: {
    FOLDER: '../public/'
  },
  PUG: {
    FROM: [__dirname + '/pug/**/*.pug', '!' + __dirname + '/pug/_old/**'],
    TO: __dirname + '/../public/',
    DATA: __dirname + "/data/site.json"
  },
  SVG: {
    FROM: './svg/*.svg',
    TO: '../public/build/svg/'
  },
  JS: {
    BOOTSTRAP: [
      './js/bootstrap/util.js',
      './js/bootstrap/alert.js',
      './js/bootstrap/button.js',
      './js/bootstrap/carousel.js',
      './js/bootstrap/collapse.js',
      './js/bootstrap/dropdown.js',
      './js/bootstrap/modal.js',
      './js/bootstrap/tooltip.js',
      './js/bootstrap/popover.js',
      './js/bootstrap/scrollspy.js',
      './js/bootstrap/tab.js',
      './js/bootstrap/toast.js',
    ],
    APP: 'js/app.js',
    THEME: 'js/theme/*.js',
    PLUGINS: ['js/plugins/imagesloaded.pkgd.js']
  },
  SCSS: {
    ALL: __dirname + '/scss/**/*.scss',
    THEME: __dirname + '/scss/theme.scss',
  },
  ASSETS: {
    ALL: '../public/pages/assets/**/*.*',
    FONTS: '../public/pages/assets/fonts/**/*.*',
    VIDEO: '../public/pages/assets/video/**/*.*',
    IMG: '../public/pages/assets/img/**/*.*',
    JS: '../public/build/js',
  },
  CSS: __dirname + '/../public/build/css',
  DEPENDENCIES: {
    jquery: {
      FROM: 'node_modules/jquery/dist/jquery.min.js',
      TO: JS,
    },
    popper: {
      FROM: 'node_modules/popper.js/dist/umd/popper.min.js',
      TO: JS,
    },
    'owl.carousel': {
      FROM: ['node_modules/owl.carousel/dist/owl.carousel.js', 'node_modules/owl.carousel/dist/assets/owl.carousel.css'],
      TO: lib,
    },
    fancybox: {
      FROM: ['node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.css', 'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.js'],
      TO: lib,
    },
    imagesloaded: {
      FROM: 'node_modules/imagesloaded/imagesloaded.pkgd.js',
      TO: 'js/plugins/',
    },
    'bootstrap-js': {
      FROM: 'node_modules/bootstrap/js/dist/!(index)*.js',
      TO: 'js/bootstrap',
    },
    'bootstrap-scss': {
      FROM: 'node_modules/bootstrap/scss/**/*.scss',
      TO: 'scss/bootstrap',
    },
    is_js: {
      FROM: 'node_modules/is_js/is.min.js',
      TO: lib,
    },
    handlebars: {
      FROM: 'node_modules/handlebars/dist/handlebars.min.js',
      TO: lib,
    },
    nouislider: {
      FROM: ['node_modules/nouislider/dist/nouislider.min.js', 'node_modules/nouislider/dist/nouislider.min.css'],
      TO: lib,
    }
  },
  GENERATED: [
    __dirname + '/../public/build/'
  ]
};

/*-----------------------------------------------
|   Cleaning
-----------------------------------------------*/

function clean() {
  return del(Paths.GENERATED, { force: true })
}

/*-----------------------------------------------
|   SCSS
-----------------------------------------------*/

function scss() {
  return gulp.src(Paths.SCSS.THEME)
    .pipe(plumber())
    .pipe(gulpif(DEVELOPMENT_BUILD, sourcemaps.init()))
    .pipe(sass({
      outputStyle: 'compressed',
    }).on('error', sass.logError))
    .pipe(plumber.stop())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulpif(DEVELOPMENT_BUILD, sourcemaps.write('./')))
    .pipe(gulp.dest(Paths.CSS))
    .pipe(browserSync.stream())
}

/*-----------------------------------------------
|   JS bundling
-----------------------------------------------*/

gulp.task('js:bootstrap', () => {
  return browserify(Paths.JS.BOOTSTRAP)
    .transform(babelify)
    .bundle()
    .pipe(vinyl(Paths.JS.APP))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(rename({
      dirname: '',
      basename: 'bootstrap',
      suffix: '.min',
    }))
    .pipe(gulp.dest(Paths.ASSETS.JS))
});

gulp.task('js:plugins', () => {
  return browserify(Paths.JS.PLUGINS)
    .transform(babelify)
    .bundle()
    .pipe(vinyl(Paths.JS.APP))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(rename({
      dirname: '',
      basename: 'plugins',
      suffix: '.min',
    }))
    .pipe(gulp.dest(Paths.ASSETS.JS))
});

gulp.task('js:app', () => {
  return browserify(Paths.JS.APP)
    .transform(babelify)
    .bundle()
    .pipe(vinyl(Paths.JS.APP))
    .pipe(buffer())
    .pipe(gulpif(DEVELOPMENT_BUILD, sourcemaps.init({ loadMaps: true })))
    .pipe(gulpif(!DEVELOPMENT_BUILD, uglify()))
    .pipe(rename({
      dirname: '',
      basename: 'theme',
      suffix: '.min',
    }))
    .pipe(gulpif(DEVELOPMENT_BUILD, sourcemaps.write('./')))
    .pipe(gulp.dest(Paths.ASSETS.JS))
});

gulp.task('js', gulp.parallel('js:bootstrap', 'js:plugins', 'js:app'));

/*-----------------------------------------------
|   Dependencies
-----------------------------------------------*/

function copy_dependency() {
  const promises = Object.keys(Paths.DEPENDENCIES).map(item => new Promise((resolve, reject) => {
    gulp.src(Paths.DEPENDENCIES[item].FROM)
      .pipe(gulp.dest((Paths.DEPENDENCIES[item].TO === lib) ? `${Paths.DEPENDENCIES[item].TO}/${item}` : Paths.DEPENDENCIES[item].TO))
      .on('end', (err) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve();
        }
      });
  }));
  return Promise.all(promises);
};

/*-----------------------------------------------
|   Watching
-----------------------------------------------*/

function watch() {

  // Set development flag
  DEVELOPMENT_BUILD = true;

  gulp.watch(Paths.SCSS.ALL, gulp.series(scss));

  gulp.watch([Paths.JS.THEME, Paths.JS.APP], gulp.series('js:app', (done) => {
    reload();
    done();
  }));

  gulp.watch(Paths.PUG.FROM, gulp.series(pugify, (done) => {
    reload();
    done();
  }));

}

/*-----------------------------------------------
|   Serve
-----------------------------------------------*/

function serve() {
  browserSync.init({
    server: {
      baseDir: Paths.PAGES.FOLDER,
    },
    port: 3000,
    open: true,
    notify: true,
  });
}

/*-----------------------------------------------
|   SVG sprites
-----------------------------------------------*/

svgSpritesConfig = {
  dest: ".",
  mode: {
    defs: {
      dest: "./",
      sprite: "sprite.defs.svg",
      example: true
    },
    css: {
      sprite: "../sprite.css.svg",
      bust: false,
      dimensions: true,
      example: {
        dest: "../sprite.css.html"
      },
      render: {
        scss: {
          dest: '../../../../frontend/scss/_svg-sprites' // relative to current output directory
        }
      }
    }
  }
};

function sprites() {
  return src(Paths.SVG.FROM)
    .pipe(plumber())
    .pipe(svgSprite(svgSpritesConfig))
    .pipe(dest(Paths.SVG.TO))
}

/*-----------------------------------------------
|   PUG
-----------------------------------------------*/

function pugify() {

  const data = JSON.parse(fs.readFileSync(Paths.PUG.DATA, 'utf8'));
  console.log(`Pug external data file loaded: "${Paths.PUG.DATA}"`);
  return src(Paths.PUG.FROM)
    .pipe(plumber())
    .pipe(pug({
      data: data,
      pretty: !DEVELOPMENT_BUILD
    }))
    .pipe(dest(Paths.PUG.TO))
}

/*-----------------------------------------------
|   PurgeCSS
-----------------------------------------------*/

gulp.task('purgecss', () => {
  return gulp.src(Paths.CSS + "/*.css")
    .pipe(purgecss({
      content: [Paths.PUG.TO + "/*.html",]
    }))
    .pipe(gulp.dest(Paths.CSS + "/"))
})

/*-----------------------------------------------
|   Starting everything
-----------------------------------------------*/

const ss_build = gulp.series(clean, sprites, copy_dependency, pugify, scss, 'js');
const ss_start = gulp.series(ss_build, gulp.parallel(serve, watch));

exports.start = ss_start;
exports.build = ss_build;
exports.scss = scss;
exports.pugify = pugify;
exports.clean = clean;
exports.sprites = sprites;
exports.watch = watch;
exports.serve = serve;
exports.default = ss_start;