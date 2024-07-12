import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import nock from 'nock'
import { EntityConfigurationClaimsOptions, fetchEntityConfigurationChains } from '../src/entityConfiguration'
import type { SignCallback, VerifyCallback } from '../src/utils'
import { setupConfigurationChain } from './utils/setupConfigurationChain'

describe('fetch entity configuration chains', () => {
  const signJwtCallback: SignCallback = () => Promise.resolve(new Uint8Array(10).fill(42))
  const verifyJwtCallback: VerifyCallback = () => Promise.resolve(true)

  it('should fetch a basic entity configuration chain of 2 entities', async () => {
    const leafEntityId = 'https://leaf.example.org'
    const trustAnchorEntityId = 'https://trust.example.org'

    const scopes: Array<nock.Scope> = []
    const claims: Array<EntityConfigurationClaimsOptions> = []

    const configurations = await setupConfigurationChain(
      [{ entityId: leafEntityId, authorityHints: [trustAnchorEntityId] }, { entityId: trustAnchorEntityId }],
      signJwtCallback
    )

    for (const { entityId, jwt, claims: configurationClaims } of configurations) {
      const scope = nock(entityId).get('/.well-known/openid-federation').reply(200, jwt, {
        'content-type': 'application/entity-statement+jwt',
      })

      scopes.push(scope)
      claims.push(configurationClaims)
    }

    const trustChains = await fetchEntityConfigurationChains({
      verifyJwtCallback,
      leafEntityId,
      trustAnchorEntityIds: [trustAnchorEntityId],
    })

    assert.strictEqual(trustChains.length, 1)
    assert.strictEqual(trustChains[0]!.length, 2)

    assert.deepStrictEqual(trustChains[0]![0], claims[0])
    assert.deepStrictEqual(trustChains[0]![1], claims[1])

    for (const scope of scopes) {
      scope.done()
    }
  })

  it('should fetch a basic entity configuration chain of 3 entities', async () => {
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
        },
        { entityId: trustAnchorEntityId },
      ],
      signJwtCallback
    )

    for (const { entityId, jwt, claims: configurationClaims } of configurations) {
      const scope = nock(entityId).get('/.well-known/openid-federation').reply(200, jwt, {
        'content-type': 'application/entity-statement+jwt',
      })

      scopes.push(scope)
      claims.push(configurationClaims)
    }

    const trustChains = await fetchEntityConfigurationChains({
      verifyJwtCallback,
      leafEntityId,
      trustAnchorEntityIds: [trustAnchorEntityId],
    })

    assert.strictEqual(trustChains.length, 1)
    assert.strictEqual(trustChains[0]!.length, 3)

    assert.deepStrictEqual(trustChains[0]![0], claims[0])
    assert.deepStrictEqual(trustChains[0]![1], claims[1])
    assert.deepStrictEqual(trustChains[0]![2], claims[2])

    for (const scope of scopes) {
      scope.done()
    }
  })

  it('should stop to fetch the entity configurations for a chain when a trust anchor is hit', async () => {
    const leafEntityId = 'https://leaf.example.org'
    const trustAnchorEntityId = 'https://trust.example.org'
    const superiorTrustAnchorEntityId = 'https://trust.superior.example.org'

    const scopes: Array<nock.Scope> = []
    const claims: Array<EntityConfigurationClaimsOptions> = []

    const configurations = await setupConfigurationChain(
      [
        { entityId: leafEntityId, authorityHints: [trustAnchorEntityId] },
        {
          entityId: trustAnchorEntityId,
          authorityHints: [superiorTrustAnchorEntityId],
        },
        { entityId: superiorTrustAnchorEntityId },
      ],
      signJwtCallback
    )

    for (const { entityId, jwt, claims: configurationClaims } of configurations) {
      const scope = nock(entityId).get('/.well-known/openid-federation').reply(200, jwt, {
        'content-type': 'application/entity-statement+jwt',
      })

      scopes.push(scope)
      claims.push(configurationClaims)
    }

    const trustChains = await fetchEntityConfigurationChains({
      verifyJwtCallback,
      leafEntityId,
      trustAnchorEntityIds: [trustAnchorEntityId],
    })

    assert.strictEqual(trustChains.length, 1)
    assert.strictEqual(trustChains[0]!.length, 2)

    assert.deepStrictEqual(trustChains[0]![0], claims[0])
    assert.deepStrictEqual(trustChains[0]![1], claims[1])

    for (const scope of scopes) {
      scope.done()
    }
  })

  it('should fetch two entity configuration chains of 2 entities each', async () => {
    const leafEntityId = 'https://leaf.example.org'
    const intermediateOneEntityId = 'https://intermediate.one.example.org'
    const intermediateTwoEntityId = 'https://intermediate.two.example.org'
    const trustAnchorOneEntityId = 'https://trust.one.example.org'
    const trustAnchorTwoEntityId = 'https://trust.two.example.org'

    const scopes: Array<nock.Scope> = []
    const claims: Array<EntityConfigurationClaimsOptions> = []

    const configurations = await setupConfigurationChain(
      [
        {
          entityId: leafEntityId,
          authorityHints: [intermediateOneEntityId, intermediateTwoEntityId],
        },
        {
          entityId: intermediateOneEntityId,
          authorityHints: [trustAnchorOneEntityId],
        },
        {
          entityId: intermediateTwoEntityId,
          authorityHints: [trustAnchorTwoEntityId],
        },
        { entityId: trustAnchorOneEntityId },
        { entityId: trustAnchorTwoEntityId },
      ],
      signJwtCallback
    )

    for (const { entityId, jwt, claims: configurationClaims } of configurations) {
      const scope = nock(entityId).get('/.well-known/openid-federation').reply(200, jwt, {
        'content-type': 'application/entity-statement+jwt',
      })

      scopes.push(scope)
      claims.push(configurationClaims)
    }

    const trustChains = await fetchEntityConfigurationChains({
      verifyJwtCallback,
      leafEntityId,
      trustAnchorEntityIds: [trustAnchorOneEntityId, trustAnchorTwoEntityId],
    })

    assert.strictEqual(trustChains.length, 2)
    assert.strictEqual(trustChains[0]!.length, 3)
    assert.strictEqual(trustChains[1]!.length, 3)

    for (const scope of scopes) {
      scope.done()
    }
  })

  it('should fetch one entity configuration chains when one trust anchor is provided', async () => {
    const leafEntityId = 'https://leaf.example.org'
    const intermediateOneEntityId = 'https://intermediate.one.example.org'
    const intermediateTwoEntityId = 'https://intermediate.two.example.org'
    const trustAnchorOneEntityId = 'https://trust.one.example.org'
    const trustAnchorTwoEntityId = 'https://trust.two.example.org'

    const scopes: Array<nock.Scope> = []
    const claims: Array<EntityConfigurationClaimsOptions> = []

    const configurations = await setupConfigurationChain(
      [
        {
          entityId: leafEntityId,
          authorityHints: [intermediateOneEntityId, intermediateTwoEntityId],
        },
        {
          entityId: intermediateOneEntityId,
          authorityHints: [trustAnchorOneEntityId],
        },
        {
          entityId: intermediateTwoEntityId,
          authorityHints: [trustAnchorTwoEntityId],
        },
        { entityId: trustAnchorOneEntityId },
        { entityId: trustAnchorTwoEntityId },
      ],
      signJwtCallback
    )

    for (const { entityId, jwt, claims: configurationClaims } of configurations) {
      const scope = nock(entityId).get('/.well-known/openid-federation').reply(200, jwt, {
        'content-type': 'application/entity-statement+jwt',
      })

      scopes.push(scope)
      claims.push(configurationClaims)
    }

    const trustChains = await fetchEntityConfigurationChains({
      verifyJwtCallback,
      leafEntityId,
      trustAnchorEntityIds: [trustAnchorOneEntityId],
    })

    assert.strictEqual(trustChains.length, 1)
    assert.strictEqual(trustChains[0]!.length, 3)

    for (const scope of scopes) {
      scope.done()
    }
  })

  it('should not fetch an entity configuration chain when no authority_hints are found', async () => {
    const scopes: Array<nock.Scope> = []

    const configurations = await setupConfigurationChain([{ entityId: 'https://leaf.example.org' }], signJwtCallback)

    for (const { entityId, jwt } of configurations) {
      const scope = nock(entityId).get('/.well-known/openid-federation').reply(200, jwt, {
        'content-type': 'application/entity-statement+jwt',
      })

      scopes.push(scope)
    }

    const trustChains = await fetchEntityConfigurationChains({
      verifyJwtCallback,
      leafEntityId: configurations[0]!.entityId,
      trustAnchorEntityIds: ['https://trust.example.org'],
    })

    assert.strictEqual(trustChains.length, 0)

    for (const scope of scopes) {
      scope.done()
    }
  })

  it('should not fetch an entity configuration chain when a loop is found', async () => {
    const scopes: Array<nock.Scope> = []

    const leafEntityId = 'https://leaf.example.org'
    const intermediateOneEntityId = 'https://intermediate.one.example.org'
    const intermediateTwoEntityId = 'https://intermediate.two.example.org'
    const trustAnchorEntityId = 'https://trust.example.org'

    const configurations = await setupConfigurationChain(
      [
        { entityId: leafEntityId, authorityHints: [intermediateOneEntityId] },
        {
          entityId: intermediateOneEntityId,
          authorityHints: [intermediateTwoEntityId],
        },
        {
          entityId: intermediateTwoEntityId,
          authorityHints: [intermediateOneEntityId],
        },
      ],
      signJwtCallback
    )

    for (const { entityId, jwt } of configurations) {
      const scope = nock(entityId).get('/.well-known/openid-federation').reply(200, jwt, {
        'content-type': 'application/entity-statement+jwt',
      })

      scopes.push(scope)
    }

    const trustChains = await fetchEntityConfigurationChains({
      verifyJwtCallback,
      leafEntityId: configurations[0]!.entityId,
      trustAnchorEntityIds: [trustAnchorEntityId],
    })

    assert.strictEqual(trustChains.length, 0)

    for (const scope of scopes) {
      scope.done()
    }
  })

  it('should not fetch an entity configuration chain when no trust anchors are provided', async () => {
    await assert.rejects(
      fetchEntityConfigurationChains({
        verifyJwtCallback,
        leafEntityId: 'https://example.org',
        trustAnchorEntityIds: [],
      })
    )
  })
})
