import { describe, it } from 'node:test'
import { createEntityConfiguration, fetchEntityConfiguration } from '../src/entityConfiguration'
import type { SignCallback, VerifyCallback } from '../src/utils'

import assert from 'node:assert/strict'
import nock from 'nock'

describe('fetch entity configuration', () => {
  const verifyJwtCallback: VerifyCallback = () => Promise.resolve(true)

  const signCallback: SignCallback = () => Promise.resolve(new Uint8Array(10).fill(42))

  it('should fetch a simple entity configuration', async () => {
    const entityId = 'https://example.org'

    const claims = {
      iss: entityId,
      sub: entityId,
      iat: new Date(),
      exp: new Date(),
      jwks: { keys: [{ kid: 'a', kty: 'EC' }] },
    }

    const entityConfiguration = await createEntityConfiguration({
      header: { kid: 'a', typ: 'entity-statement+jwt' },
      claims,
      signJwtCallback: signCallback,
    })

    const scope = nock(entityId).get('/.well-known/openid-federation').reply(200, entityConfiguration, {
      'content-type': 'application/entity-statement+jwt',
    })

    const fetchedEntityConfiguration = await fetchEntityConfiguration({
      entityId,
      verifyJwtCallback,
    })

    assert.deepStrictEqual(fetchedEntityConfiguration, claims)

    scope.done()
  })

  it('should not fetch an entity configuration when the content-type is invalid', async () => {
    const entityId = 'https://exampletwo.org'

    const claims = {
      iss: entityId,
      sub: entityId,
      iat: new Date(),
      exp: new Date(),
      jwks: { keys: [{ kid: 'a', kty: 'EC' }] },
    }

    const entityConfiguration = await createEntityConfiguration({
      header: { kid: 'a', typ: 'entity-statement+jwt' },
      claims,
      signJwtCallback: signCallback,
    })

    const scope = nock(entityId).get('/.well-known/openid-federation').reply(200, entityConfiguration, {
      'content-type': 'invalid-type',
    })

    await assert.rejects(fetchEntityConfiguration({ entityId, verifyJwtCallback }), { name: 'Error' })

    scope.done()
  })

  it('should not fetch an entity configuration when there is no entity configuration', async () => {
    const entityId = 'https://examplethree.org'

    await assert.rejects(fetchEntityConfiguration({ entityId, verifyJwtCallback }), { name: 'TypeError' })
  })
})
