# Theme Template
Libsass & Gulp edition (for Drupal 7/8).

This theme-template features a set of pre-defined (gulp-based-) tasks to provide an efficient front-end-workflow. These tasks include sass-compiling, sass- & js-linting, image-minify and file-concatenation amongst others.

The basic idea is to provide a common setup, that should not be altered, with an additional config that offers the opportunity to customize the setup.

_This template does not include any drupal-theme-specific files (.info, .theme etc)._


## Install
`$ npm install` should take care of all your needs.

**!!! IMPORTANT !!!**

The current setup requires **node.js v.10** to be installed! ([nvm]() might be your new best friend.)


### Dependencies
- [NodeJS](https://nodejs.org/) ([how to install](https://nodejs.org/en/download/package-manager/)) v.10
- [npm](https://www.npmjs.com/) ([how to install](https://docs.npmjs.com/getting-started/installing-node))
- [Bower](https://bower.io/) ([how to install](https://bower.io/#install-bower))

### Post install
In some cases you might get "segmentation errors" when using drush after the install, due to some installed node-modules featuring ".info" files. This can be helped by running `$ sh npm-post.sh`, a script that renames all ".info"- files inside the node-modules folder to ".inf0", from the template-root-folder.



## Setup as a Drupal 8 theme
Most parts here will be manual adjustments to get all the small details in place as needed.

1. (re-) name the theme-folder as needed;
    **important:** the name will also be used for configuration files, so choose wisely.
1. Remove the existing repository-reference `$ rm .git`
1. Copy the Drupal-Theme (`_template/drupal-8/**`) files to the root of the theme.
1. Replace all mentions of `__name__` with the folder name in **all** files (not just the newly copied ones).
1. Adjust the configuration within of the copied files as needed
1. Adjust the project-proxy within `gulp-config.json` to match the projects local url.
1. Remove Dummy/Demo-Content e.g.
    - `index.html`
    - `src/images/**`
    - `src/js/jquery.plugin.js`
    - `src/sass/components/test/**`
    - …
1. (if needed) Adjust the `.gitignore` to allow adding the dist-folder (and its content) to the repository.
1. Make sure you meet all the [Dependencies](#dependencies) for working on the theme (needed for post-install at the next step).
1. Run `$ npm install` to install all dependencies, third-party packages and run a first-time build.
1. For further config of the theme see the [Gulp-Config](#gulp-config)-Section.



## General workflow


### Tasks
The most useful and used tasks:

Note: to rub gulp locally you need to global-install it on your system.

- `$ npm run watch` (or `$ gulp build`): clean any pre-existing generated files and re-generate them.
- `$ npm run build` (or `$ gulp serve`): start a local server that injects updated files (css) and does page-reloads automatically on file-changes (js).
- `$ npm run test` (or `$ gulp test`): run sass-linting and js-linting.
- `$ gulp lib`: clean the installed lib-files and copy all configured lib-files. Lib-files are not watched in `gulp serve`, so upon changes to the lib-config the command needs to be run again.

For development you might also need these:

- `$ gulp css:vendor`: concat the defined third-party css-files.
- `$ gulp js:vendor`: concat the defined third-party js-files.

For distribution:

- `$ gulp dist`: runs `build` and removes all development files from the theme. this __removes all files__ from the theme that are not needed for the production environment.



## Third-party content
Libraries like angular and others can be installed using npm (the preferred choice) or bower.

### Install packages without package.json
In some cases you might want to install a package that does not bring a setup for npm or bower. Here [napa](https://github.com/shama/napa) can be your friend, like this:
```` json
{
  "scripts": {
    "install": "napa balsamiq/jquery-zeroclipboard:jquery-zeroclipboard"
  }
  …
}
````


## Gulp-Config
The theme includes a `gulp-config.json`-file which supplies an easy-to-use config option for (most) gulp-tasks. Details will be explained in further sections.


### Libraries
As mentioned before, the usage of third-party content is supported by this theme. However, to include **just the files needed** for production, a section in the config can be adjusted to eighter copy single files or folders to the destination library (usually `dist/lib`).

Examples:

#### Copy a single file
Copy just the `jquery.min.js` from the, via bower installed, repo.

````json
"lib": {
      "src": [
        "src/lib/jquery/dist/jquery.min.js"
      ],
      ...
},
````
	
#### Copy by pattern
Copy the lightbox dist folder from the node_modules to the defined folder `lightbox` within the library, including all js, css and images:

````json
"src": [
  ["node_modules/lightbox2/dist/**/*.+(png|gif|js|css)", "lightbox"],
  ...
],
````

or the complete content (if needed):

````json
"src": [
  ["node_modules/sweetalert2/dist/**/*", "sweetalert2"],
  ...
],
````

**! You will need to run** `$ gulp lib` **in order for the config to be used (the files to be copied). !**



### Filename-Prefixing
Compiled css- and js-files will be prefixed by the theme-name within the config.json.
For example the script `behaviors.js` in the `bright-solutions` theme will be named `bright-solutions.behaviors.js` when created in the distribution folder.



### Sass
Please see the Bright Solutions frontend documentation for details on color-naming, css-, sass-, js-basic and more.

- [autoprefixer](https://github.com/postcss/autoprefixer)
- [sass-linting](https://github.com/sasstools/sass-lint)
    - [config-options](https://github.com/sasstools/sass-lint/blob/master/lib/config/sass-lint.yml)
    - [sample config](https://github.com/sasstools/sass-lint/blob/master/docs/sass-lint.yml)



### JavaScript
New JavaScript-Code should be written according to ECMAScript 2015 (ES6) specification. For backwards-compatibility we will use babel to compile the js-files.

- [babel](https://babeljs.io/)
- [gulp-babel](https://www.npmjs.com/package/gulp-babel)
    - [presents](https://babeljs.io/docs/plugins/#presets)
    

#### Linting
A linting task is setup to check js-files to ensure, that our coding-standards are met. This requires all developers to "de-lint" their code **before** committing.
The linting will provide direct feedback about the source and location of the issues, eg.:
 `10:6 error 'iamavariable' is assigned a value but never used [no-unused-vars]`

- [ES Lint](http://eslint.org/docs/developer-guide/)
- [gulp-eslint](https://github.com/adametry/gulp-eslint)

IDEs like PHPStorm can be configured to lint the code while writing it, using the given configuration within the project.

#### Concatenation
The template can be configured to concat custom js-files, thus all files defined within the js-source will be combined (alongside other actions) into one - its name can also be defined.

```` json
{
  "js": {
    "concat": true,
    "files": {
      "custom": "my-concat-script.js",
      …
    },
    …
  }
  …
}
````

#### Vendor-file concatenation
Just as with the _regular_ js-file-concat, dedicated (third-party-/contrib-/vendor-files can be conigured to be compiled into one. Once again a custom file-name can also be defined.
This can be useful when working with landing-pages that feature a multitude of third-party-scripts.

```` json
{
  "js": {
    "concat": true,
    "files": {
      "vendor": "my-vendor-concat-script.js",
      …
    },
    …
  }
  …
}
````



### Automatic feature-detection for Modernizr
The custom-modernizr-task is configured to detect features that would require tests within the code and generate the library accordingly. However, in case a feature is not detected by default, there are two ways to add the test manually:

1. add the feature-test using the `gulp_config.json` (`modernizr › tests`)
1. add a comment to the scss file naming the feature eg: `// Modernizr.objectfit`



### Images
**! Images are not to be put into the distribution folder manually, as they will be overridden !**

Images will be minified – when put into the source-folder and the related watch- or serve-task is running or via `$gulp img` – and their data made available to sass. This way, their url, height, and width can be inserted automatically unsing one of the following methods:

| Method | Info | Usage |
|--------|------|-------|
| `image-url($image-path)` | Inserts the image-url of the processed image-file. The path is relative to the source-image folder | `background-image: image-url('icons/icon-menu.png');` |
| `image-width($image-path)` | inserts the width of the image, as provided by the file | `width: image-width('logo.jpg')` |
| `image-height($image-path)` | inserts the height of the image, as provided by the file | `height: image-height('tools/drupal.png')` |


## Misc

### Iconfont
How to add an icon-font (such as [font awesome](http://fortawesome.github.io)):

1. Download the font and put it into the fonts directory (usually `/fonts` – font-files only).
2. Update the icon-font variables in `/src/sass/variables/_icon-font.scss`. Map the given glypes to trivial-names (wich will be used in the sass).
3. Setup the webfont in `/src/sass/base/_icon-font.scss`.

Icons can then be inserted by using the mixins & extend in `/src/sass/abstractions/_icon-font.scss`.

See [example usage and functionality](https://www.sassmeister.com/gist/60dd93c4d03f0552240a).



## Todos
- js & sass lint via `npm lint` (propper fail-feedback needed)
    - separate both test?
- js beautifier
- image sprite
    - prevent empty folders to be created
- proper readme
    - image-helper & sprite
    - browsersync
- check https://github.com/frontendfriends/gulp-combine-mq
- check https://www.npmjs.com/package/gulp-plumber (later)
- check theme ~~as submodule https://subfictional.com/fun-with-git-submodules/~~ include via composer
- check for deprecated packages
- check for https://github.com/mikaelbr/gulp-notify
- setup pre-commit hook



## Changelog
- 09.07.18
    - updated package dependencies
    - updated readme a bit to reference usage of gulp via npm
- 20.04.18
    - added custom (two row) layout for D8 DisplaySuit
- 06.03.18
    - adjusted breakpoint template as it caused issues
- 08.02.18
    - added icon-font usage info to theme
- 07.02.18
    - fixed js/jsx config pattern
    - added gulp-load-plugins for simple plugin-include
    - updated readme (usage of lib)
- 29.01.18
    - updated sass-linting
    - adjusted babel-setup
    - added post-css px to rem
    - adjusted sourcemap writing
- 01.08.17
    - updated sass-lint config
    - updated js-lint config
- 06.07.17
    - added drupal-8 theme setup info and related files
- 01.07.17
    - updated js-lint config
    - minor adjustments to gulp-setup
    - gulp-file de-linting
    - adjusted `npm test` to fail on js-linting errors 
- 23.04.17
    - adjusted sprites to support generation of multiple sprite-sheets
    - reworked the media-query combine functionality to support source-maps
- 22.04.17
    - minor adjustments to teh gitignore
    - adjusted es-lint config to allow usage of `undefined`
    - added tasks and information to package-config
    - enhanced readme
- 06.04.17
    - enhanced the readme
- 24.03.17
    - adjusted js-lint allowed usage of dangling underscore
- 17.03.17
    - fixed image-map and -sprite template usage
    - properly adjusted modernizr-setup to add testes form config
    - adjusted dist:clean task
- 16.03.17
    - moved from js-hint to es-lint
    - added [babel](https://babeljs.io/) to convert scripts to es5 (if needed)
- 05.03.17
    - added custom [modernizr](https://modernizr.com/) creation
- 14.11.16
    - added image spriting support
    - updated sass-linting
- 19.09.16
    - checked style-lint (feature/gulp-stylelint)
- 19.07.16
    - adjusted file-naming for concatenated and custom files using [gulp-rename](https://github.com/hparra/gulp-rename)
    - ported config
    - added `$ gulp dist:clean` -task and config for distribution
    - added `$ gulp dist` task
    - added clean config-option
    - added source config
    - updated readme
- 13.07.16
    - fixed import of breakpoint and normalize ([info](http://stackoverflow.com/a/33588202/4400555))
    - removed image-map helper template
- 06.07.16
    - updates sass-lint-config
    - added (wip) read-me
    - added useful sass-files
    - updated npm-post to show adjusted files
