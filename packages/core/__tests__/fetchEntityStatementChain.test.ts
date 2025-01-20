import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
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

    const { chainData: configurations, nockScopes } = await setupConfigurationChain(
      [
        { entityId: leafEntityId, authorityHints: [trustAnchorEntityId] },
        { entityId: trustAnchorEntityId, subordinates: [leafEntityId] },
      ],
      { signJwtCallback, mockEndpoints: true }
    )

    const chains = await fetchEntityConfigurationChains({
      verifyJwtCallback,
      leafEntityId,
      trustAnchorEntityIds: [trustAnchorEntityId],
    })

    assert.strictEqual(chains.length, 1)
    assert.strictEqual(chains[0]?.length, 2)

    assert.deepStrictEqual(chains[0]?.[0], configurations[0]?.claims)
    assert.deepStrictEqual(chains[0]?.[1], configurations[1]?.claims)

    const statements = await fetchEntityStatementChain({
      verifyJwtCallback,
      entityConfigurations: chains[0],
    })

    assert.strictEqual(statements.length, 2)

    assert.deepStrictEqual(statements[0]?.iss, trustAnchorEntityId)
    assert.deepStrictEqual(statements[0]?.sub, leafEntityId)

    assert.deepStrictEqual(statements[1]?.iss, trustAnchorEntityId)
    assert.deepStrictEqual(statements[1]?.sub, trustAnchorEntityId)

    for (const scope of nockScopes) {
      scope.done()
    }
  })

  it('should fetch a basic entity statement chain of 3 entities', async () => {
    const leafEntityId = 'https://leaf.example.org'
    const intermediateEntityId = 'https://intermediate.example.org'
    const trustAnchorEntityId = 'https://trust.example.org'

    const claims: Array<EntityConfigurationClaimsOptions> = []

    const { chainData: configurations, nockScopes } = await setupConfigurationChain(
      [
        { entityId: leafEntityId, authorityHints: [intermediateEntityId] },
        {
          entityId: intermediateEntityId,
          authorityHints: [trustAnchorEntityId],
          subordinates: [leafEntityId],
        },
        { entityId: trustAnchorEntityId, subordinates: [intermediateEntityId] },
      ],
      { signJwtCallback, mockEndpoints: true }
    )

    const chains = await fetchEntityConfigurationChains({
      verifyJwtCallback,
      leafEntityId,
      trustAnchorEntityIds: [trustAnchorEntityId],
    })

    assert.strictEqual(chains.length, 1)
    assert.strictEqual(chains[0]?.length, 3)

    assert.deepStrictEqual(chains[0]?.[0], configurations[0]?.claims)
    assert.deepStrictEqual(chains[0]?.[1], configurations[1]?.claims)
    assert.deepStrictEqual(chains[0]?.[2], configurations[2]?.claims)

    const statements = await fetchEntityStatementChain({
      verifyJwtCallback,
      entityConfigurations: chains[0],
    })

    assert.strictEqual(statements.length, 3)

    assert.deepStrictEqual(statements[0]?.iss, intermediateEntityId)
    assert.deepStrictEqual(statements[0]?.sub, leafEntityId)

    assert.deepStrictEqual(statements[1]?.iss, trustAnchorEntityId)
    assert.deepStrictEqual(statements[1]?.sub, intermediateEntityId)

    assert.deepStrictEqual(statements[2]?.iss, trustAnchorEntityId)
    assert.deepStrictEqual(statements[2]?.sub, trustAnchorEntityId)

    for (const scope of nockScopes) {
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
