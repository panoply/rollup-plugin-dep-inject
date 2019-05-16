// Wont be parsed, filename is excluded

import m from 'mithril'
import b from 'bss'
import Turbolinks from 'turbolinks'

export default () => {

  Turbolinks.start()

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
  })

}
