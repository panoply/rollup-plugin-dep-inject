// Wont be parsed, filename is excluded

import m from 'mithril'
import Turbolinks from 'turbolinks'

export default () => {

  Turbolinks.start()
  m.render(document.body, {
    view: () => m('h1', 'Hello World')
  })

}
