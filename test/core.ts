'use strict'

import * as assert from 'power-assert'
import * as sinon from 'sinon'
import * as nock from 'nock'

import { search } from '../src/core'

describe('search', () => {
  it('should request npmjs.org', () => {
    const response = search({ text: 'ora' })
    const responseMock = require('./fixture/response-mock1')

    nock('https://www.npmjs.org')
      .get('/-/search')
      .query({
        text       : 'scope:types ora',
        quality    : 1.95,
        popularity : 3.3,
        maintenance: 2.05,
      })
      .reply(200, responseMock)

    return response
      .then(resp => assert.deepStrictEqual(resp, responseMock))
  })
})
