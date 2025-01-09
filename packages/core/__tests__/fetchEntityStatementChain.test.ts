import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import nock from 'nock'
import { type EntityConfigurationClaimsOptions, fetchEntityConfigurationChains } from '../src/entityConfiguration'
import { fetchEntityStatementChain } from '../src/entityStatement'
import type { SignCallback, VerifyCallback } from '../src/utils'
import { setupConfigurationChain } from './utils/setupConfigurationChain'

describe('fetch entity statement chain', () => {
  const signJwtCallback: SignCallback = () => Promise.resolve(new Uint8Array(10).fill(42))
  const verifyJwtCallback: VerifyCallback = () => Promise.resolve(true)

  it('should fetch a basic entity statement chain', async () => {
    const leafEntityId = 'https://leaf.example.org'
    const trustAnchorEntityId = 'https://trust.example.org'

    const scopes: Array<nock.Scope> = []
    const claims: Array<EntityConfigurationClaimsOptions> = []

    const configurations = await setupConfigurationChain(
      [
        { entityId: leafEntityId, authorityHints: [trustAnchorEntityId] },
        { entityId: trustAnchorEntityId, subordinates: [leafEntityId] },
      ],
      signJwtCallback
    )

    for (const { entityId, jwt, claims: configurationClaims, subordinateStatements } of configurations) {
      claims.push(configurationClaims)
      const scope = nock(entityId).get('/.well-known/openid-federation').reply(200, jwt, {
        'content-type': 'application/entity-statement+jwt',
      })

      for (const { jwt, entityId } of subordinateStatements ?? []) {
        scope.get('/fetch').query({ iss: configurationClaims.iss, sub: entityId }).reply(200, jwt, {
          'content-type': 'application/entity-statement+jwt',
        })
      }

      scopes.push(scope)
    }

    const chains = await fetchEntityConfigurationChains({
      verifyJwtCallback,
      leafEntityId,
      trustAnchorEntityIds: [trustAnchorEntityId],
    })

    assert.strictEqual(chains.length, 1)
    assert.strictEqual(chains[0]?.length, 2)

    assert.deepStrictEqual(chains[0]?.[0], claims[0])
    assert.deepStrictEqual(chains[0]?.[1], claims[1])

    const statements = await fetchEntityStatementChain({
      verifyJwtCallback,
      entityConfigurations: chains[0]!,
    })

    assert.strictEqual(statements.length, 2)

    assert.deepStrictEqual(statements[0]?.iss, trustAnchorEntityId)
    assert.deepStrictEqual(statements[0]?.sub, leafEntityId)

    assert.deepStrictEqual(statements[1]?.iss, trustAnchorEntityId)
    assert.deepStrictEqual(statements[1]?.sub, trustAnchorEntityId)

    for (const scope of scopes) {
      scope.done()
    }
  })

  it('should fetch a basic entity statement chain of 3 entities', async () => {
    const leafEntityId = 'https://leaf.example.org'
    const intermediateEntityId = 'https://intermediate.example.org'
    const trustAnchorEntityId = 'https://trust.example.org'

    const scopes: Array<nock.Scope> = []
    const claims: Array<EntityConfigurationClaimsOptions> = []

    const configurations = await setupConfigurationChain(
      [
        { entityId: leafEntityId, authorityHints: [intermediateEntityId] },
        {
          entityId: intermediateEntityId,
          authorityHints: [trustAnchorEntityId],
          subordinates: [leafEntityId],
        },
        { entityId: trustAnchorEntityId, subordinates: [intermediateEntityId] },
      ],
      signJwtCallback
    )

    for (const { entityId, jwt, claims: configurationClaims, subordinateStatements } of configurations) {
      claims.push(configurationClaims)
      const scope = nock(entityId).get('/.well-known/openid-federation').reply(200, jwt, {
        'content-type': 'application/entity-statement+jwt',
      })

      for (const { jwt, entityId } of subordinateStatements ?? []) {
        scope.get('/fetch').query({ iss: configurationClaims.iss, sub: entityId }).reply(200, jwt, {
          'content-type': 'application/entity-statement+jwt',
        })
      }

      scopes.push(scope)
    }

    const chains = await fetchEntityConfigurationChains({
      verifyJwtCallback,
      leafEntityId,
      trustAnchorEntityIds: [trustAnchorEntityId],
    })

    assert.strictEqual(chains.length, 1)
    assert.strictEqual(chains[0]?.length, 3)

    assert.deepStrictEqual(chains[0]?.[0], claims[0])
    assert.deepStrictEqual(chains[0]?.[1], claims[1])
    assert.deepStrictEqual(chains[0]?.[2], claims[2])

    const statements = await fetchEntityStatementChain({
      verifyJwtCallback,
      entityConfigurations: chains[0]!,
    })

    assert.strictEqual(statements.length, 3)

    assert.deepStrictEqual(statements[0]?.iss, intermediateEntityId)
    assert.deepStrictEqual(statements[0]?.sub, leafEntityId)

    assert.deepStrictEqual(statements[1]?.iss, trustAnchorEntityId)
    assert.deepStrictEqual(statements[1]?.sub, intermediateEntityId)

    assert.deepStrictEqual(statements[2]?.iss, trustAnchorEntityId)
    assert.deepStrictEqual(statements[2]?.sub, trustAnchorEntityId)

    for (const scope of scopes) {
      scope.done()
    }
  })

  it('should not fetch an entity statement chain when no source_endpoint is found', async () => {
    const leafEntityId = 'https://leaf.example.org'
    const trustAnchorEntityId = 'https://trust.example.org'

    const scopes: Array<nock.Scope> = []
    const claims: Array<EntityConfigurationClaimsOptions> = []

    const configurations = await setupConfigurationChain(
      [
        { entityId: leafEntityId, authorityHints: [trustAnchorEntityId] },
        {
          entityId: trustAnchorEntityId,
          subordinates: [leafEntityId],
          includeSourceEndpoint: false,
        },
      ],
      signJwtCallback
    )

    for (const { entityId, jwt, claims: configurationClaims } of configurations) {
      claims.push(configurationClaims)
      const scope = nock(entityId).get('/.well-known/openid-federation').reply(200, jwt, {
        'content-type': 'application/entity-statement+jwt',
      })

      scopes.push(scope)
    }

    const chains = await fetchEntityConfigurationChains({
      verifyJwtCallback,
      leafEntityId,
      trustAnchorEntityIds: [trustAnchorEntityId],
    })

    assert.strictEqual(chains.length, 1)
    assert.strictEqual(chains[0]?.length, 2)

    assert.deepStrictEqual(chains[0]?.[0], claims[0])
    assert.deepStrictEqual(chains[0]?.[1], claims[1])

    await assert.rejects(
      fetchEntityStatementChain({
        verifyJwtCallback,
        entityConfigurations: chains[0]!,
      })
    )

    for (const scope of scopes) {
      scope.done()
    }
  })

  it('should not fetch an entity statement chain when no entity configurations are provided', async () => {
    await assert.rejects(
      fetchEntityStatementChain({
        verifyJwtCallback,
        entityConfigurations: [],
      })
    )
  })
})
