import { unpkg } from 'unpkg-uri'
import fs from 'fs'
import chalk from 'chalk'

const PLUGIN_NAME = 'rollup-plugin-dep-inject'
const COMMENT = '<!--dep-inject-->'

class DepInject {

  /**
   * @param {object} options – Plugin options
   * @param {object} settings – Configuration presets
   */
  constructor (options,
    settings = {
      index: '',
      attr: '',
      ignore: [],
      remove: false,
      unpkg: Object,
      custom: Object
    }) {

    this.executed = false
    this.config = Object.assign(settings, options)
    this.commentWrap = new RegExp(`\\s*?(${COMMENT})[\\s\\S]*?\\1`)
    this.document = fs.readFileSync(this.config.index).toString()

  }

  write (external) {

    fs.writeFileSync(this.config.index, this.inject(external))
    this.executed = true

  }

  /**
   * @param {array} external – Rollup external module ids
   */
  entry (external) {

    if (this.commentWrap.test(this.document)) {

      this.document = this.document.replace(this.commentWrap, '').trim()

      if (this.config.remove) {

        console.log(chalk`{bold.yellowBright rollup-plugin-dep-inject}: {blue.bold ${external.length}} module/s were removed from {cyanBright ${this.config.index}} file.`)

        return fs.writeFileSync(this.config.index, this.document)


      }

    } else {

      if (this.config.remove) {

        return console.log(chalk`{bold.yellowBright rollup-plugin-dep-inject}: No injected dependency modules were detected, removal was skipped.`)

      }

    }

    this.position = this.document.indexOf('<script')

    if (this.position > -1) {

      console.log(chalk`{bold.yellowBright rollup-plugin-dep-inject}: {blue.bold ${external.length}} module/s added to the {cyanBright ${this.config.index}} file at position {blue.bold 0}.`)

      this.write(external)

    } else {

      this.position = this.document.indexOf('</head')

      if (this.position > -1) {

        console.log(chalk`{bold.yellowBright rollup-plugin-dep-inject}: No {yellow <script>} tags detected within {cyanBright ${this.config.index}} file. {blue.bold ${external.length}} module/s will write from the {yellow <head>} element position of the document.`)

        this.write(external)

      } else {

        console.log(chalk`{bold.yellowBright rollup-plugin-dep-inject}: No {yellow <script>} or {yellow <head>} tags detected within {cyanBright ${this.config.index}} file. {blue.bold ${external.length}} module/s will write from position {blue.bold 0} of the document.`)

        this.position = 0
        this.write(external)

      }

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
      this.document.substring(0, this.position) +
      `${COMMENT}\n` +
      modules.filter(m => m && m).join('\n') +
      `\n${COMMENT}\n` +
      this.document.substring(this.position)
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
