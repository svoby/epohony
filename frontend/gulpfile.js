const del = require('del');
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const replace = require('gulp-replace');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const sassDart = require('sass');
const cleanCSS = require('gulp-clean-css');
const eslint = require('gulp-eslint');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync');
const svgSprite = require('gulp-svg-sprite');
const pug = require('gulp-pug');
const fs = require('fs');
const prettier = require('gulp-prettier');

const { reload } = browserSync;
const Promise = require('promise');
const { src, dest } = require('gulp');
const { Path } = require('progressbar.js');
const { Callbacks } = require('jquery');


/*-----------------------------------------------
|   Paths
-----------------------------------------------*/
const JS = '../public/build/js';
const lib = '../public/build/lib';
const Paths = {
  HERE: './',
  PAGES: {
    FOLDER: '../public/',
    ALL: '../public/tpl/**/*.*', // Not used?
    HTML: '../public/tpl/**/*.html', // Not used?
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
    ALL: 'js/**/*.js',
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
    THEME: ['js/theme/Utils.js', 'js/theme/!(Utils)*.js'],
    PLUGINS: ['js/plugins/imagesloaded.pkgd.js', 'js/plugins/TweenMax.js', 'js/plugins/ScrollToPlugin.js', 'js/plugins/CustomEase.js', 'js/plugins/DrawSVGPlugin.js', 'js/plugins/fontawesome-all.js'],
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
    prismjs: {
      FROM: ['node_modules/prismjs/prism.js', 'node_modules/prismjs/themes/prism.css'],
      TO: lib,
    },
    plyr: {
      FROM: ['node_modules/plyr/dist/plyr.min.js', 'node_modules/plyr/dist/plyr.css', 'node_modules/plyr/dist/plyr.polyfilled.min.js'],
      TO: lib,
    },
    'typed.js': {
      FROM: 'node_modules/typed.js/lib/typed.js',
      TO: JS,
    },
    'jquery.mb.ytplayer': {
      FROM: ['node_modules/jquery.mb.ytplayer/dist/css/jquery.mb.YTPlayer.min.css', 'node_modules/jquery.mb.ytplayer/dist/jquery.mb.YTPlayer.min.js'],
      TO: lib,
    },
    'progressbar.js': {
      FROM: 'node_modules/progressbar.js/dist/progressbar.min.js',
      TO: JS,
    },
    'jquery-countdown': {
      FROM: 'node_modules/jquery-countdown/dist/jquery.countdown.min.js',
      TO: JS,
    },
    rellax: {
      FROM: 'node_modules/rellax/rellax.min.js',
      TO: JS,
    },
    'owl.carousel': {
      FROM: ['node_modules/owl.carousel/dist/owl.carousel.js', 'node_modules/owl.carousel/dist/assets/owl.carousel.css'],
      TO: lib,
    },
    lightbox2: {
      FROM: ['node_modules/lightbox2/dist/?(css)/lightbox.min.css', 'node_modules/lightbox2/dist/?(images)/*.*', 'node_modules/lightbox2/dist/?(js)/lightbox.min.js'],
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
    headroom: {
      FROM: 'node_modules/headroom.js/dist/headroom.min.js',
      TO: lib
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
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded',
    }).on('error', sass.logError))
    .pipe(plumber.stop())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(Paths.CSS))
    .pipe(browserSync.stream());
}

/*-----------------------------------------------
|   JavaScript
-----------------------------------------------*/
gulp.task('js:bootstrap', () => gulp.src(Paths.JS.BOOTSTRAP)
  .pipe(concat('bootstrap.js'))
  .pipe(replace(/^(export|import).*/gm, ''))
  .pipe(babel({
    compact: false,
    presets: [
      [
        'env', {
          modules: false,
          loose: true,
        },
      ],
    ],
    plugins: [
      process.env.PLUGINS && 'transform-es2015-modules-strip',
      '@babel/plugin-proposal-object-rest-spread',
    ].filter(Boolean),
  }))
  //.pipe(gulp.dest(Paths.ASSETS.JS))
  .pipe(uglify())
  .pipe(rename({
    suffix: '.min',
  }))
  .pipe(gulp.dest(Paths.ASSETS.JS))
  .pipe(reload({ stream: true })));

gulp.task('js:theme', () => gulp.src(Paths.JS.THEME)
  //.pipe(eslint({ fix: true }))
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
  .pipe(concat('theme.js'))
  .pipe(replace(/^(export|import).*/gm, ''))
  .pipe(babel({
    compact: false,
    presets: [
      [
        'env',
        {
          modules: false,
          loose: true,
        },
      ],
    ],
    plugins: [
      process.env.PLUGINS && 'transform-es2015-modules-strip',
      '@babel/plugin-proposal-object-rest-spread',
      'transform-strict-mode',
    ].filter(Boolean),
  }))
  //.pipe(gulp.dest(Paths.ASSETS.JS))
  .pipe(uglify())
  .pipe(rename({
    suffix: '.min',
  }))
  .pipe(gulp.dest(Paths.ASSETS.JS))
  .pipe(reload({ stream: true })));

gulp.task('js:plugins', () => gulp.src(Paths.JS.PLUGINS)
  .pipe(concat('plugins.js'))
  .pipe(replace(/^(export|import).*/gm, ''))
  .pipe(babel({
    compact: false,
    presets: [
      [
        'env', {
          modules: false,
          loose: true,
        },
      ],
    ],
    plugins: [
      process.env.PLUGINS && 'transform-es2015-modules-strip',
      '@babel/plugin-proposal-object-rest-spread',
    ].filter(Boolean),
  }))
  //.pipe(gulp.dest(Paths.ASSETS.JS))
  .pipe(uglify())
  .pipe(rename({
    suffix: '.min',
  }))
  .pipe(gulp.dest(Paths.ASSETS.JS))
  .pipe(reload({ stream: true })));

gulp.task('js', gulp.parallel('js:bootstrap', 'js:plugins', 'js:theme'));


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

  gulp.watch(Paths.SCSS.ALL, gulp.series(scss));

  gulp.watch(Paths.JS.THEME, gulp.series('js', (done) => {
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
    notify: false,
  });
}

/*-----------------------------------------------
|   SVG sprites (pls execute manualy)
-----------------------------------------------*/
svgSpritesConfig = {
  log: "verbose",
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
      pretty: false,
      data: data
    }))
    // .pipe(prettier({
    //   printWidth: 1000,
    //   tabWidth: 4
    // }))
    .pipe(dest(Paths.PUG.TO))
}

/*-----------------------------------------------
|   SASS - Dart (test)
-----------------------------------------------*/
function scssDart() {
  return sassDart.renderSync({
    file: Paths.SCSS.THEME,
    outFile: 'test.css',
  });
}

/*-----------------------------------------------
|   Starting everything
-----------------------------------------------*/

const ss_build = gulp.series(clean, sprites, copy_dependency, pugify, scss, 'js');
const ss_start = gulp.series(ss_build, gulp.parallel(serve, watch));

exports.start = ss_start;
exports.build = ss_build;
exports.scss = scss;
exports.scssDart = scssDart;
exports.pugify = pugify;
exports.clean = clean;
exports.sprites = sprites;
exports.default = ss_start;