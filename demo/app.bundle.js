var App = (function (m, b, Turbolinks) {
  'use strict';

  m = m && m.hasOwnProperty('default') ? m['default'] : m;
  b = b && b.hasOwnProperty('default') ? b['default'] : b;
  Turbolinks = Turbolinks && Turbolinks.hasOwnProperty('default') ? Turbolinks['default'] : Turbolinks;

  // Wont be parsed, filename is excluded

  var app = () => {

    Turbolinks.start();

    m.mount(document.body, {
      view: vnode =>
        m('h1' +
            b
            .bc('red')
            .c('white')
            .fs(32)
            .ta('center'),
        {
          style: b.bc(on && 'green').style,
          onclick: () => (on = !on)
        },
        'Hello world')
    });

  };

  return app;

}(m, b, Turbolinks));
//# sourceMappingURL=app.bundle.js.map
