'use strict';

(function ($) {
  // dom ready
  $(() => {
    const $ul = $('ul').testPlugin({debug: true});

    $ul.testPlugin('_log', 'custom log', 1);
  });

  // <-- add your drupal behaviors here
}(jQuery));
