import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { createEntityStatement } from '../src/entityStatement/createEntityStatement'
import type { SignCallback } from '../src/utils'

describe('create entity statement', () => {
  const signJwtCallback: SignCallback = () => Promise.resolve(new Uint8Array(10).fill(42))

  it('should create a basic entity statement', async () => {
    const entityStatementJwt = await createEntityStatement({
      jwk: { kty: 'EC', kid: 'a' },
      claims: {
        exp: 1,
        iat: 1,
        iss: 'https://example.org',
        sub: 'https://one.example.org',
        jwks: { keys: [{ kty: 'EC', kid: 'b' }] },
      },
      header: {
        kid: 'a',
        typ: 'entity-statement+jwt',
      },
      signJwtCallback,
    })

    assert.strictEqual(
      entityStatementJwt,
      'eyJraWQiOiJhIiwidHlwIjoiZW50aXR5LXN0YXRlbWVudCtqd3QifQ.eyJleHAiOjEsImlhdCI6MSwiaXNzIjoiaHR0cHM6Ly9leGFtcGxlLm9yZyIsInN1YiI6Imh0dHBzOi8vb25lLmV4YW1wbGUub3JnIiwiandrcyI6eyJrZXlzIjpbeyJrdHkiOiJFQyIsImtpZCI6ImIifV19fQ.KioqKioqKioqKg'
    )
  })

  it('should create a basic entity statement without a provided header', async () => {
    const entityStatementJwt = await createEntityStatement({
      jwk: { kty: 'EC', kid: 'a' },
      claims: {
        exp: 1,
        iat: 1,
        iss: 'https://example.org',
        sub: 'https://one.example.org',
        jwks: { keys: [{ kty: 'EC', kid: 'b' }] },
      },
      signJwtCallback,
    })

    assert.strictEqual(
      entityStatementJwt,
      'eyJ0eXAiOiJlbnRpdHktc3RhdGVtZW50K2p3dCIsImtpZCI6ImEifQ.eyJleHAiOjEsImlhdCI6MSwiaXNzIjoiaHR0cHM6Ly9leGFtcGxlLm9yZyIsInN1YiI6Imh0dHBzOi8vb25lLmV4YW1wbGUub3JnIiwiandrcyI6eyJrZXlzIjpbeyJrdHkiOiJFQyIsImtpZCI6ImIifV19fQ.KioqKioqKioqKg'
    )
  })

  it('should not create a basic entity statement with an invalid typ', async () => {
    await assert.rejects(
      createEntityStatement({
        header: {
          kid: 'a',
          // @ts-ignore
          typ: 'invalid-typ',
        },
        jwk: { kty: 'EC', kid: 'a' },
        claims: {
          exp: 1,
          iat: 1,
          iss: 'https://example.org',
          sub: 'https://one.example.org',
          jwks: { keys: [{ kty: 'EC', kid: 'b' }] },
        },
        signJwtCallback,
      })
    )
  })

  it('should not create a basic entity statement with a jwk that does not match the kid in the header', async () => {
    await assert.rejects(
      createEntityStatement({
        jwk: { kty: 'EC', kid: 'b' },
        claims: {
          exp: 1,
          iat: 1,
          iss: 'https://example.org',
          sub: 'https://one.example.org',
          jwks: { keys: [{ kty: 'EC', kid: 'b' }] },
        },
        header: {
          kid: 'a',
          typ: 'entity-statement+jwt',
        },
        signJwtCallback,
      })
    )
  })
})
