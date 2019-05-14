var App = (function (m, Turbolinks) {
  'use strict';

  m = m && m.hasOwnProperty('default') ? m['default'] : m;
  Turbolinks = Turbolinks && Turbolinks.hasOwnProperty('default') ? Turbolinks['default'] : Turbolinks;

  // Wont be parsed, filename is excluded

  var app = () => {

    Turbolinks.start();
    m.render(document.body, {
      view: () => m('h1', 'Hello World')
    });

  };

  return app;

}(m, Turbolinks));
//# sourceMappingURL=app.bundle.js.map
