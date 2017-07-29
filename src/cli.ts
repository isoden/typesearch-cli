#!/usr/bin/env node

import * as meow from 'meow'
import { search } from './index'
import { onInput } from './customized-searchy'

meow(`
  Usage
    $ typesearch-cli

  Options
    -h, --help   : Show this message
    -v, --version:  Show program version

  Examples
    $ typesearch-cli
`, {
  alias: {
    v: 'version',
    h: 'help',
  }
})

onInput(query => search({ text: query })
  .then(data => data.objects.map(object => object.package))
  .then(packages => packages.map(pkg => pkg.name))
)
