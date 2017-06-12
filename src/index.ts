#!/usr/bin/env node

'use strict'

import axios from 'axios'
import * as meow from 'meow'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/operator/map'

import {
  TypeSearchParams,
  NpmSearchParams,
  NpmSearchResponse,
} from './models'

import {
  // booleanify,
  switchMap,
} from './utils'

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

const TypeSearch = {
  search(searchParams: TypeSearchParams): Observable<NpmSearchResponse> {
    const params  = this.normalizeParams(searchParams)
    const request = axios.get(`https://www.npmjs.org/-/search`, { params })

    return Observable.fromPromise(request)
      .map(response => response.data as NpmSearchResponse)
  },

  normalizeParams(params: TypeSearchParams): NpmSearchParams {
    // const toggleOptionalFlag = (enabled: boolean) => enabled ? 3 : 0

    return <NpmSearchParams>switchMap(params, {
      text(text: string) {
        return `scope:types ${ text }`
      },
      // quality    : toggleOptionalFlag,
      // popularity : toggleOptionalFlag,
      // maintenance: toggleOptionalFlag,
    })
  }
}

TypeSearch.search({
  text       : cli.input[0],
  // quality    : booleanify(cli.flags.quality),
  // popularity : booleanify(cli.flags.popularity),
  // maintenance: booleanify(cli.flags.maintenance),
})
  .map(data => data.objects.map(object => object.package))
  .subscribe(packages => {
    packages.forEach(pkg => console.log(pkg.name))
  }, err => {
    console.log(err)
  })
