import * as assert from 'power-assert'

import {
  booleanify,
  switchMap,
} from '../src/utils'

describe('booleanify', () => {
  it('should be true', () => {
    assert(booleanify('true') === true)
    assert(booleanify('') === true)
    assert(booleanify(true) === true)
    assert(booleanify(0) === true)
    assert(booleanify({}) === true)
    assert(booleanify([]) === true)
  })

  it('should be false', () => {
    assert(booleanify('false') === false)
    assert(booleanify(false) === false)
    assert(booleanify(null) === false)
    assert(booleanify(void 0) === false)
  })
})

describe('switchMap', () => {
  it('should update all params', () => {
    const expected = {
      payo: 20,
      piyo: 80,
      puyo: 180,
    }

    const actual = switchMap({
      payo: 10,
      piyo: 20,
      puyo: 30
    }, {
      payo: (v: number) => v * 2,
      piyo: (v: number) => v * 4,
      puyo: (v: number) => v * 6,
    })

    assert.deepStrictEqual(actual, expected)
  })

  it('should update single param', () => {
    const expected = {
      payo: 20,
      piyo: 20,
      puyo: 30,
    }

    const actual = switchMap({
      payo: 10,
      piyo: 20,
      puyo: 30
    }, {
      payo: (v: number) => v * 2,
    })

    assert.deepStrictEqual(actual, expected)
  })
})
