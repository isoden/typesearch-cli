'use strict'

import axios from 'axios'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/operator/map'

import { switchMap } from './utils'

export const search = (searchParams: TypeSearchCli.TypeSearchParams): Observable<TypeSearchCli.NpmSearchResponse> => {
  const params  = normalizeParams(searchParams)
  const request = axios.get(`https://www.npmjs.org/-/search`, { params })

  return Observable.fromPromise(request)
    .map(response => response.data as TypeSearchCli.NpmSearchResponse)
}

export const normalizeParams = (params: TypeSearchCli.TypeSearchParams): TypeSearchCli.NpmSearchParams => {
  const { text, ...conditions } = params
  const criteria = getCriteria(conditions)

  return <TypeSearchCli.NpmSearchParams>switchMap(params, {
    text() {
      return `scope:types ${ text }`
    },
    quality() {
      switch (criteria) {
        case TypeSearchCli.NpmSearchCriteria.BestOverall: return 1.95
        case TypeSearchCli.NpmSearchCriteria.Quality    : return 3
        default                           : return 0
      }
    },
    popularity() {
      switch (criteria) {
        case TypeSearchCli.NpmSearchCriteria.BestOverall: return 3.3
        case TypeSearchCli.NpmSearchCriteria.Popularity : return 3
        default                           : return 0
      }
    },
    maintenance() {
      switch (criteria) {
        case TypeSearchCli.NpmSearchCriteria.BestOverall: return 2.05
        case TypeSearchCli.NpmSearchCriteria.Maintenance: return 3
        default                           : return 0
      }
    },
  })
}

export const getCriteria = (
  params: Pick<TypeSearchCli.TypeSearchParams, 'quality' | 'popularity' | 'maintenance'>
): TypeSearchCli.NpmSearchCriteria => {
  switch (true) {
    case params.quality    : return TypeSearchCli.NpmSearchCriteria.Quality
    case params.popularity : return TypeSearchCli.NpmSearchCriteria.Popularity
    case params.maintenance: return TypeSearchCli.NpmSearchCriteria.Maintenance
    default                : return TypeSearchCli.NpmSearchCriteria.BestOverall
  }
}

export namespace TypeSearchCli {
  export interface TypeSearchParams {
    text: string

    quality?: boolean

    popularity?: boolean

    maintenance?: boolean
  }

  export enum NpmSearchCriteria {
    BestOverall = 1,
    Quality,
    Popularity,
    Maintenance,
  }

  /** {@link https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md#get-v1search} */
  export interface NpmSearchParams {
    /** full-text search to apply */
    text?: string

    /** how many results should be returned (default 20, max 250) */
    size?: number

    /** offset to return results from */
    from?: number

    /** how much of an effect should quality have on search results */
    quality?: number

    /** how much of an effect should popularity have on search results */
    popularity?: number

    /** how much of an effect should maintenance have on search results */
    maintenance?: number
  }

  export interface NpmMaintainer {
    username: string
    email: string
  }

  export interface NpmPackage {
    name: string
    version: string
    description: string
    keywords: string[]
    date: string
    links: {
      npm: string
      homepage: string
      repository: string
      bugs: string
    }
    publisher: NpmMaintainer
    maintainers: NpmMaintainer[]
  }

  export interface NpmScore {
    final: number
    detail: {
      quality: number
      popularity: number
      maintenance: number
    }
  }

  export interface NpmObject {
    package: NpmPackage
    score: NpmScore
    searchScore: number
  }

  export interface NpmSearchResponse {
    objects: NpmObject[]
    total: number
    time: string
  }
}

