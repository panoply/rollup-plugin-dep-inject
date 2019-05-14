import { unpkg } from 'unpkg-uri'
import fs from 'fs'
import chalk from 'chalk'

class DepInject {
  constructor(
    options,
    settings = {
      index: '',
      attr: '',
      ignore: [],
      overwrite: {}
    }
  ) {
    this.execute = true
    this.comments = new RegExp(/(<!--dep-inject-->)((?:\n|.)*)(\1)\s+/, 'gm')
    this.config = Object.assign(settings, options)
    this.index = fs.readFileSync(this.config.index).toString()
  }

  entry(external) {
    if (this.index.match(this.comments)) {
      this.index = this.index.replace(this.comments, '')
    }
    let position = this.index.indexOf('<script')
    if (position > -1) {
      fs.writeFileSync(this.config.index, this.inject(external, position))
      this.execute = false
    }
  }

  inject(external, position) {
    let log = []
    const { ignore, overwrite } = this.config
    const pkg = external
      .map(module => {
        if (!ignore.includes(module)) {
          if (overwrite.hasOwnProperty(module)) {
            log.push(`– ${module} => ${overwrite[module]}\n`)
            return overwrite[module]
          } else {
            log.push(`– ${module} => ${unpkg(module)}\n`)
            return unpkg(module)
          }
        }
      })
      .filter(module => module && module)

    let deps = pkg
      .map(cdn => `<script src="${cdn}"${this.config.attr}></script>`)
      .join('\n')

    let node =
      this.index.substr(0, position) +
      '<!--dep-inject-->\n' +
      deps +
      '\n<!--dep-inject-->\n' +
      this.index.substr(position)

    console.log(chalk`\n{yellow.bold DEP-INJECT}\n{yellow ${log.join('')}}`)

    return node
  }
}

export default function depInject(options) {
  const inject = new DepInject(options)

  return {
    name: 'rollup-plugin-dep-inject',
    options({ external }) {
      if (inject.execute) {
        inject.entry(external)
      }

      return null
    }
  }
}
