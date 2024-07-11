import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { createEntityConfiguration } from '../src/entityConfiguration'
import type { SignCallback } from '../src/utils'

describe('create entity configuration', () => {
  const signJwtCallback: SignCallback = () => Promise.resolve(new Uint8Array(42).fill(8))

  it('should create a basic entity configuration', async () => {
    const entityConfiguration = await createEntityConfiguration({
      signJwtCallback,
      claims: {
        exp: 1,
        iat: 1,
        iss: 'https://example.org',
        sub: 'https://example.org',
        jwks: { keys: [{ kid: 'a', kty: 'EC' }] },
      },
      header: { kid: 'a', typ: 'entity-statement+jwt' },
    })

    assert(
      entityConfiguration,
      'eyJraWQiOiJhIiwidHlwIjoiZW50aXR5LXN0YXRlbWVudCtqd3QifQ.eyJpc3MiOiJodHRwczovL2V4YW1wbGUub3JnIiwic3ViIjoiaHR0cHM6Ly9leGFtcGxlLm9yZyIsImlhdCI6IjE5NzAtMDEtMDFUMDA6MDA6MDEuMDAwWiIsImV4cCI6IjE5NzAtMDEtMDFUMDA6MDA6MDEuMDAwWiIsImp3a3MiOnsia2V5cyI6W3sia3R5IjoiRUMiLCJraWQiOiJhIn1dfX0.CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI'
    )
  })

  it('should create a more complex entity configuration', async () => {
    const entityConfiguration = await createEntityConfiguration({
      signJwtCallback,
      claims: {
        exp: 1,
        iat: 1,
        iss: 'https://example.org',
        sub: 'https://example.org',
        jwks: { keys: [{ kid: 'a', kty: 'EC' }] },
        authority_hints: ['https://foo.com'],
      },
      header: { kid: 'a', typ: 'entity-statement+jwt' },
    })

    assert(
      entityConfiguration,
      'eyJraWQiOiJhIiwidHlwIjoiZW50aXR5LXN0YXRlbWVudCtqd3QifQ.eyJpc3MiOiJodHRwczovL2V4YW1wbGUub3JnIiwic3ViIjoiaHR0cHM6Ly9leGFtcGxlLm9yZyIsImlhdCI6IjE5NzAtMDEtMDFUMDA6MDA6MDEuMDAwWiIsImV4cCI6IjE5NzAtMDEtMDFUMDA6MDA6MDEuMDAwWiIsImp3a3MiOnsia2V5cyI6W3sia3R5IjoiRUMiLCJraWQiOiJhIn1dfSwiYXV0aG9yaXR5X2hpbnRzIjpbImh0dHBzOi8vZm9vLmNvbSJdfQ.CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI'
    )
  })

  it('should not create a entity configuration when iss and sub are not equal', async () => {
    await assert.rejects(
      createEntityConfiguration({
        signJwtCallback,
        claims: {
          exp: 1,
          iat: 1,
          iss: 'https://some-other.url',
          sub: 'https://example.org',
          jwks: { keys: [{ kid: 'a', kty: 'EC' }] },
        },
        header: { kid: 'a', typ: 'entity-statement+jwt' },
      })
    )
  })

  it('should not create a entity configuration when kid is not found in jwks.keys', async () => {
    await assert.rejects(
      createEntityConfiguration({
        signJwtCallback,
        claims: {
          exp: 1,
          iat: 1,
          iss: 'https://example.org',
          sub: 'https://example.org',
          jwks: { keys: [{ kid: 'a', kty: 'EC' }] },
        },
        header: { kid: 'invalid_id', typ: 'entity-statement+jwt' },
      })
    )
  })

  it("should not create a entity configuration when typ is not 'entity-statement+jwt'", async () => {
    await assert.rejects(
      createEntityConfiguration({
        signJwtCallback,
        claims: {
          exp: 1,
          iat: 1,
          iss: 'https://example.org',
          sub: 'https://example.org',
          jwks: { keys: [{ kid: 'a', kty: 'EC' }] },
        },
        // @ts-ignore
        header: { kid: 'a', typ: 'invalid_typ' },
      })
    )
  })

  it('should not create a entity configuration when jwks.keys include keys with the same kid', async () => {
    await assert.rejects(
      createEntityConfiguration({
        signJwtCallback,
        claims: {
          exp: 1,
          iat: 1,
          iss: 'https://example.org',
          sub: 'https://example.org',
          jwks: {
            keys: [
              { kid: 'a', kty: 'EC' },
              { kid: 'a', kty: 'EC' },
            ],
          },
        },
        header: { kid: 'a', typ: 'entity-statement+jwt' },
      })
    )
  })
})
