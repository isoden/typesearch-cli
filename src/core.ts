'use strict'

import axios from 'axios'

export const search = (searchParams: TypeSearchCli.TypeSearchParams): Promise<TypeSearchCli.NpmSearchResponse> => {
  const params  = normalizeParams(searchParams)

  return axios.get(`https://www.npmjs.org/-/search`, { params })
    .then(response => response.data as TypeSearchCli.NpmSearchResponse)
}

export const normalizeParams = (params: TypeSearchCli.TypeSearchParams): TypeSearchCli.NpmSearchParams => {
  return {
    text       : `scope: types ${ params.text }`,
    quality    : 1.95,
    popularity : 3.3,
    maintenance: 2.05,
  }
}

export namespace TypeSearchCli {
  export interface TypeSearchParams {
    text: string
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

