import { unpkg } from 'unpkg-uri'
import fs from 'fs'

const PLUGIN_NAME = 'rollup-plugin-dep-inject'
const COMMENT = '<!--dep-inject-->'

class DepInject {

  /**
   *
   * @param {object} options – Plugin options
   * @param {object} settings – Configuration presets
   */
  constructor (options,
    settings = {
      index: String,
      attr: String,
      ignore: Array,
      unpkg: Object,
      custom: Object
    }) {

    this.executed = false
    this.config = Object.assign(settings, options)
    this.wrap = new RegExp(`(${COMMENT})((?:\n|.)*)(\\1)\\s+`, 'gm')
    this.index = fs.readFileSync(this.config.index).toString()

  }

  /**
   * @param {array} external – Rollup external module ids
   */
  entry (external) {

    if (this.index.match(this.wrap)) {

      this.index = this.index.replace(this.wrap, '')

    }

    this.position = this.index.indexOf('<script')

    if (this.position > -1) {

      fs.writeFileSync(this.config.index, this.inject(external))
      this.executed = true

    }

  }

  /**
   * @param {array} external – Rollup external module ids
   * @return {string}
   */
  inject (external) {

    const { ignore, custom, attr } = this.config
    const _unpkg = this.config.unpkg

    const modules = external.map(module => {

      if (!ignore.includes(module)) {

        return custom.hasOwnProperty(module)
          ? `<script src="${custom[module]}"${attr}></script>`
          : _unpkg.hasOwnProperty(module)
            ? `<script src="${unpkg(module + _unpkg[module])}"${attr}></script>`
            : `<script src="${unpkg(module)}"${attr}></script>`

      }

    })

    return (
      this.index.substr(0, this.position) +
      `${COMMENT}\n` +
      modules.filter(m => m && m).join('\n') +
      `\n${COMMENT}\n` +
      this.index.substr(this.position)
    )

  }

}

/**
 * Rollup Plugin
 * @param {object} options - Plugin options
 */
export default function depInject (options) {

  const inject = new DepInject(options)

  return {
    name: PLUGIN_NAME,
    options ({ external }) {

      !inject.executed && inject.entry(external)
      return null

    }
  }

}
