'use strict'

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
