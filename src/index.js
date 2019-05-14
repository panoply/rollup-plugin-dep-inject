import { unpkg } from 'unpkg-uri'
import fs from 'fs'
import chalk from 'chalk'

class DepInject {

  constructor (options,
    settings = {
      index: '',
      attr: '',
      ignore: [],
      overwrite: {
      }
    }) {

    this.comments = new RegExp(/(<!--dep-inject-->)((?:\n|.)*)(\1)\s+/, 'gm')
    this.config = Object.assign(settings, options)
    this.index = fs.readFileSync(this.config.index).toString()

  }

  entry (external) {

    if (this.index.match(this.comments)) {

      this.index = this.index.replace(this.comments, '')

    }

    const position = this.index.indexOf('<script')
    if (position > -1) {

      fs.writeFileSync(this.config.index, this.inject(external, position))
      this.executed = true

    }

  }

  inject (external, position) {

    const { ignore, overwrite, attr } = this.config
    const modules = external.map(module => {

      if (!ignore.includes(module)) {

        return overwrite.hasOwnProperty(module)
          ? overwrite[module]
          : unpkg(module)

      }

    })

    const dependencies = modules
    .filter(module => module && module)
    .map(cdn => `<script src="${cdn}"${attr}></script>`)

    return (
      this.index.substr(0, position) +
      '<!--dep-inject-->\n' +
      dependencies.join('\n') +
      '\n<!--dep-inject-->\n' +
      this.index.substr(position)
    )

  }

}

export default function depInject (options) {

  const inject = new DepInject(options)

  return {
    name: 'rollup-plugin-dep-inject',
    options ({ external }) {

      !inject.executed && inject.entry(external)

      return null

    }
  }

}
