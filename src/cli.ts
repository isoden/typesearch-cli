#!/usr/bin/env node

import * as meow from 'meow'
import { search } from './index'
import { booleanify } from './utils'

const cli = meow(`
  Usage
    $ typesearch-cli <PackageName>

  Options
    -q, --quality
      How much of an effect should quality have on search results

    -p, --popularity
      How much of an effect should popularity have on search results

    -m, --maintenance
      How much of an effect should maintenance have on search results

    -h, --help
      Show this message

  Examples
    $ typesearch-cli react -q

`, {
  alias: {
    q: 'quality',
    p: 'popularity',
    m: 'maintenance',
  },
})

search({
  text       : cli.input[0],
  quality    : booleanify(cli.flags.quality),
  popularity : booleanify(cli.flags.popularity),
  maintenance: booleanify(cli.flags.maintenance),
})
  .map(data => data.objects.map(object => object.package))
  .subscribe(packages => {
    packages.forEach(pkg => console.log(pkg.name))
  }, err => {
    console.log(err)
  })
