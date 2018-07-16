/* global require */

'use strict';


// require modules
const fs = require('fs');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync').create();
const buffer = require('vinyl-buffer');
const merge = require('merge-stream');

// plugins prefixed by 'gulp-' will be loaded automatically
// file-related
const runSequence = require('run-sequence');
// (s)css
const pxtorem = require('postcss-pxtorem');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
// img
const spritesmith = require('gulp.spritesmith-multi');


// load config from file
const config = JSON.parse(fs.readFileSync('./gulp-config.json'));


//
function _sassLint() {
  return gulp
    .src([config.css.src])
    .pipe($.changed(config.css.src))
    .pipe($.sassLint({
      options:    {
        formatter: 'stylish'
      },
      files:      {
        ignore: config.css.lintIgnore
      },
      configFile: '.sass-lint.yml'
    }))
    .pipe($.sassLint.format());
}


gulp.task('default', ['serve']);

gulp.task('test', ['js:lint'], () => _sassLint().pipe($.sassLint.failOnError()));

gulp.task('build', (callback) => {
  runSequence('build:clean', ['img', 'lib'], ['js', 'css'], callback);
});

// build and clean – removes all development-files!
gulp.task('dist', (callback) => {
  runSequence('build', 'dist:clean', callback);
});

// seperator to make important task easier visible in the ide
gulp.task('-----------------------');

// Static Server + watching scss files
gulp.task('serve', ['dev:build'], () => {
  // use proxy to work in a theme
  browserSync.init({
    proxy:  config.proxy,
    open:   false,
    notify: false
  });

  gulp.watch(config.css.src, ['css']);
  gulp.watch(config.js.src, ['js']);
  gulp.watch(config.img.src, ['img', 'css:custom']);

  gulp.watch([
    config.js.src + '*.js',
    config.img.src,
    '*.tpl.php'])
    .on('change', browserSync.reload);
});

//
gulp.task('watch', ['build', 'watch:js', 'watch:img', 'watch:css']);

// css watch-task
gulp.task('watch:css', () => gulp
  .watch(config.css.src, ['css:custom'])
);

// js watch-task
gulp.task('watch:js', () => gulp
  .watch(config.js.src, ['js:custom', 'lib:modernizr'])
);


// # resources
// images
gulp.task('img:min', () => {
  const source = [].concat(config.img.src);

  // prevent sprited images to be copied
  config.img.sprites.files.forEach((path) => {
    const files = config.img.srcPath + path;

    source.push('!' + files.split('*')[0]);
    source.push('!' + files);
  });

  // minify the images
  return gulp.src(source)
    .pipe($.changed(config.img.dest))
    .pipe($.imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(gulp.dest(config.img.dest))
    .pipe(browserSync.stream());
});

// Generating img:maps for usage in sass
gulp.task('img:map', () => gulp
  .src(config.img.dest + '/**/*.+(jpeg|jpg|png|gif|svg)')
  .pipe($.compassImagehelper({
    images_path: config.img.dest,
    css_path:    config.css.dest,
    template:    'image-map.handlebars',
    targetFile:  'variables/_image-map.scss',
    prefix:      'images-'
  }))
  .pipe(gulp.dest(config.css.path))
);

// generate sprites
gulp.task('img:sprite', () => {
  const spriteFolders = [];

  config.img.sprites.files.forEach((path) => {
    spriteFolders.push(config.img.srcPath + path);
  });

  // Generate our spritesheet
  const spriteData = gulp.src(spriteFolders)
    .pipe(spritesmith({
      spritesmith: (options) => {
        options.imgPath = options.imgName;
        options.cssName = '_sprites/_sprite-' + options.imgName.split('.')[0] + '.scss';
        options.cssTemplate = 'image-sprite.handlebars'
      }
    }));

  // Pipe image stream through image optimizer and onto disk
  const imgStream = spriteData.img.pipe(buffer())
    .pipe($.imagemin())
    .pipe(gulp.dest(config.img.dest));

  // Pipe CSS stream through CSS optimizer and onto disk
  const cssStream = spriteData.css.pipe(buffer())
    .pipe($.imagemin())
    .pipe(gulp.dest(config.css.path + '/variables'));

  // Return a merged stream to handle both `end` events
  return merge(imgStream, cssStream);
});

//
gulp.task('img:clean', () => gulp
  .src([
    config.img.dest,
    config.css.path + '/variables/_sprites'
  ], {read: false})
  .pipe($.clean())
);

// combined image-task
gulp.task('img', (callback) => {
  runSequence(['img:sprite', 'img:min'], 'img:map', callback);
});


// copy lib-files (non js/css) from source
gulp.task('lib:copy', () => {
  const source = [];

  // different destination
  config.lib.src.forEach((item) => {
    if (typeof item === 'object') {
      gulp.src(item[0])
        .pipe(gulp.dest(config.lib.dest + '/' + item[1]));
    }
    else {
      source.push(item);
    }
  });

  // default destination
  return gulp.src(source)
    .pipe(gulp.dest(config.lib.dest));
});

// clean lib files
gulp.task('lib:clean', () => gulp
  .src([config.lib.dest], {read: false})
  .pipe($.clean())
);

//
gulp.task('lib:modernizr', () => gulp
  .src(config.js.src.concat(config.css.src))
  .pipe($.modernizr(
    config.modernizr.files.custom,
    {
      options: config.modernizr.options,
      tests:   config.modernizr.tests
    }
  ))
  .pipe(gulp.dest(config.lib.dest))
);

// combines lib task
gulp.task('lib', (callback) => {
  runSequence('lib:clean', 'lib:modernizr', 'lib:copy', callback);
});


// Linting the styles.
gulp.task('sass:lint', _sassLint);

// # sass (css)
// clean complied css files
gulp.task('css:clean', () => gulp
  .src([config.css.dest], {read: false})
  .pipe($.clean())
);

// Concat css from vendor content
gulp.task('css:vendor', () => gulp
  .src(config.css.vendor)
  .pipe($.sourcemaps.init())
  .pipe($.concat(config.css.files.vendor))
  .pipe($.sourcemaps.write('.'))
  .pipe($.rename({
    prefix: config.theme + config.fileConcat
  }))
  .pipe(gulp.dest(config.css.dest))
  .pipe(browserSync.stream())
);

// Compile css from source
gulp.task('css:custom', ['sass:lint'], () => gulp
  .src(config.css.src)
  .pipe($.plumber())
  .pipe($.sourcemaps.init())
  .pipe($.sassGlob())
  .pipe($.sass({
    outputStyle:     config.css.style,
    includePaths:    config.css.includes,
    errLogToConsole: true
  })
    .on('error', $.sass.logError))
  .pipe($.postcss([
    autoprefixer({browsers: config.css.autoprefix}),
    pxtorem({rootValue: config.css.fontSizeRoot}),
    mqpacker({sort: true})
  ]))
  .pipe($.rename({prefix: config.theme + config.fileConcat}))
  .pipe($.sourcemaps.write('.'))
  .pipe(gulp.dest(config.css.dest))
  .pipe(browserSync.stream())
);

// combined css-generation task
gulp.task('css', ['css:vendor', 'css:custom']);


// # js
// clean complied css files
gulp.task('js:clean', () => gulp
  .src([config.js.dest], {read: false})
  .pipe($.clean())
);

// De-lint the custom js files
gulp.task('js:lint', () => gulp
  .src(config.js.lint)
  .pipe($.eslint({
    globals: config.js.globals
  }))
  .pipe($.eslint.format('stylish'))
);

// concat vendor js
gulp.task('js:vendor', () => gulp
  .src(config.js.vendor)
  .pipe($.sourcemaps.init())
  .pipe($.concat(config.js.files.vendor))
  .pipe($.sourcemaps.write('.'))
  .pipe($.rename({prefix: config.theme + config.fileConcat}))
  .pipe(gulp.dest(config.js.dest))
);

// concat custom js
gulp.task('js:custom', ['js:lint'], () => {
  if (config.js.concat) {
    // concat
    return gulp.src(config.js.src)
      .pipe($.plumber())
      .pipe($.sourcemaps.init())
      .pipe($.concat(config.js.files.custom))
      .pipe($.babel({
        presets: config.js.presets
      }))
      .pipe($.sourcemaps.write('.'))
      .pipe($.rename({prefix: config.theme + config.fileConcat}))
      .pipe(gulp.dest(config.js.dest))
      .pipe(browserSync.stream());
  }
  else {
    // prefixing only
    return gulp.src(config.js.src)
      .pipe($.rename({
        prefix: config.theme + config.fileConcat
      }))
      .pipe($.babel({
        presets: config.js.presets
      }))
      .pipe(gulp.dest(config.js.dest))
      .pipe(browserSync.stream());
  }
});

// combined tasks
// Use next generation JavaScript, today.
gulp.task('js', ['js:vendor', 'js:custom']);


// dev
gulp.task('dev:clean', ['lib:clean', 'css:clean', 'js:clean']);

gulp.task('dev:build', (callback) => {
  runSequence('dev:clean', ['img', 'lib'], ['js', 'css'], callback);
});


// Build / Distribution
gulp.task('build:clean', ['img:clean', 'lib:clean', 'css:clean', 'js:clean']);

// remove all development files
gulp.task('dist:clean', () => gulp
  .src(
    [
      config.src,
      './node_modules',
      '.bowerrc',
      '.eslintrc.yml',
      '.sass-lint.yml',
      'bower.json',
      'gulp-config.json',
      'gulpfile.js',
      'image-map.handlebars',
      'image-sprite.handlebars',
      'npm-post.sh',
      'package.json',
      'readme.md'
    ].concat(config.clean),
    {read: false}
  )
  .pipe($.clean())
);

