#!/usr/bin/env node

import * as meow from 'meow'
import * as npmInstallPackage from 'npm-install-package'
import * as ora from 'ora'
import { search } from './index'
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
.then(pkgName => {
  if (!cli.flags.i) {
    return
  }

  const spinner = ora({
    text : `Installing: ${ pkgName }`,
    color: 'yellow',
  })
  .start()

  npmInstallPackage([pkgName], {
    saveDev: true
  }, err => {
    spinner.stop()

    if (err) {
      console.error(`Install failed: ${ pkgName }`)
      throw err
    }

    console.log(`Install successfully: ${ pkgName }`)
  })
})
