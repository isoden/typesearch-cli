#!/usr/bin/env node

import * as meow from 'meow'
import * as npmInstallPackage from 'npm-install-package'
import { search } from './index'
import { throbber } from './throbber'
import { onInput } from './customized-searchy'

const cli = meow(`
  Usage
    $ typesearch-cli

  Options
    -i, --install: Install selected package
    -h, --help   : Show this message
    -v, --version: Show program version

  Examples
    $ typesearch-cli
`, {
  alias: {
    i: 'install',
    v: 'version',
    h: 'help',
  }
})

onInput(query => search({ text: query })
  .then(data => data.objects.map(object => object.package))
  .then(packages => packages.map(pkg => pkg.name))
)
.then(pkg => {
  if (!cli.flags.i) {
    return
  }

  const dispose = throbber()

  npmInstallPackage([pkg], {
    saveDev: true
  }, err => {
    dispose()

    if (err) {
      console.error('Install failed')
      throw err
    }

    console.log(`Install successfully: ${ pkg }`)
  })
})
