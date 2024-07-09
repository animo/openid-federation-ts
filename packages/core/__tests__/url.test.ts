import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { addPaths, addSearchParams } from '../src/utils'

const addUrlFixtures = [
  {
    baseUrl: 'https://example.org',
    paths: ['one', 'two'],
    expected: 'https://example.org/one/two',
  },
  {
    baseUrl: 'https://example.org/',
    paths: ['one', 'two'],
    expected: 'https://example.org/one/two',
  },
  {
    baseUrl: 'https://example.org/////',
    paths: ['one', 'two///'],
    expected: 'https://example.org/one/two',
  },
  {
    baseUrl: 'https://example.org/zero',
    paths: ['one', 'two/'],
    expected: 'https://example.org/zero/one/two',
  },
  {
    baseUrl: 'https://example.org/zero',
    paths: ['/one/', 'two/'],
    expected: 'https://example.org/zero/one/two',
  },
]

const addSearchParamsFixtures: Array<{
  baseUrl: string
  searchParams: Record<string, string>
  expected: string
}> = [
  {
    baseUrl: 'https://example.org',
    searchParams: { one: 'two' },
    expected: 'https://example.org?one=two',
  },
  {
    baseUrl: 'https://example.org?',
    searchParams: { one: 'two' },
    expected: 'https://example.org?one=two',
  },
  {
    baseUrl: 'https://example.org',
    searchParams: { foo: 'bar', baz: 'foo' },
    expected: 'https://example.org?foo=bar&baz=foo',
  },
]

describe('url parsing', () => {
  describe('append path to url', () => {
    addUrlFixtures.map(({ paths, expected, baseUrl }) => {
      it(`should correctly correctly turn '${baseUrl}' into ${expected}`, () => {
        assert.strictEqual(addPaths(baseUrl, ...paths), expected)
      })
    })
  })

  describe('append search params to url', () => {
    addSearchParamsFixtures.map(({ searchParams, expected, baseUrl }) => {
      it(`should correctly correctly turn '${baseUrl}' into ${expected}`, () => {
        assert.strictEqual(addSearchParams(baseUrl, searchParams), expected)
      })
    })
  })
})
