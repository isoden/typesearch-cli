#!/usr/bin/env node

'use strict'

import axios from 'axios'
import * as meow from 'meow'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/operator/map'

import {
  NpmSearchCriteria,
  NpmSearchParams,
  NpmSearchResponse,
  TypeSearchParams,
} from './models'

import {
  booleanify,
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
    const { text, ...conditions } = params
    const criteria = this.getCriteria(conditions)

    return <NpmSearchParams>switchMap(params, {
      text() {
        return `scope:types ${ text }`
      },
      quality() {
        switch (criteria) {
          case NpmSearchCriteria.BestOverall: return 1.95
          case NpmSearchCriteria.Quality    : return 3
          default                           : return 0
        }
      },
      popularity() {
        switch (criteria) {
          case NpmSearchCriteria.BestOverall: return 3.3
          case NpmSearchCriteria.Popularity : return 3
          default                           : return 0
        }
      },
      maintenance() {
        switch (criteria) {
          case NpmSearchCriteria.BestOverall: return 2.05
          case NpmSearchCriteria.Maintenance: return 3
          default                           : return 0
        }
      },
    })
  },

  getCriteria(params: Pick<TypeSearchParams, 'quality' | 'popularity' | 'maintenance'>): NpmSearchCriteria {
    switch (true) {
      case params.quality    : return NpmSearchCriteria.Quality
      case params.popularity : return NpmSearchCriteria.Popularity
      case params.maintenance: return NpmSearchCriteria.Maintenance
      default                : return NpmSearchCriteria.BestOverall
    }
  }
}

TypeSearch.search({
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
