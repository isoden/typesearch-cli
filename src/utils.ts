'use strict'

export const booleanify = (token: any): boolean => token !== null && typeof token !== 'undefined' && `${ token }` !== 'false'

export const switchMap = <T extends object>(target: T, conditions: { [key: string]: <T>(value: T) => T }) => {
  return Object.keys(target).reduce((memo, key: keyof typeof target) => {
    const fn = conditions[key]
    if (typeof fn !== 'function') {
      return memo
    }

    memo[key] = fn(target[key])
    return memo
  }, <T>{})
}
