#!/usr/bin/env node

import * as meow from 'meow'
import { search } from './index'

const cli = meow(`
  Usage
    $ typesearch-cli <PackageName>

  Options
    -h, --help   : Show this message
    -v, --version:  Show program version

  Examples
    $ typesearch-cli angular
    @types/angular
    @types/angular-ui-router
    @types/angular-mocks
    @types/angular-resource
    ...
`, {
  alias: {
    v: 'version',
    h: 'help',
  }
})

search({ text: cli.input[0] })
  .then(data => data.objects.map(object => object.package))
  .then(packages => {
    packages.forEach(pkg => console.log(pkg.name))
  }, err => {
    console.log(err)
  })
