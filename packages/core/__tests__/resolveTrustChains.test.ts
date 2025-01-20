import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { type EntityConfigurationClaimsOptions, fetchEntityConfigurationChains } from '../src/entityConfiguration'
import { resolveTrustChains } from '../src/resolveTrustChains'
import type { SignCallback, VerifyCallback } from '../src/utils'
import { setupConfigurationChain } from './utils/setupConfigurationChain'

describe('fetch trust chains', () => {
  const signJwtCallback: SignCallback = () => Promise.resolve(new Uint8Array(10).fill(42))
  const verifyJwtCallback: VerifyCallback = () => Promise.resolve(true)

  it('should fetch a basic entity configuration chain of 2 entities', async () => {
    const leafEntityId = 'https://leaf.example.org'
    const trustAnchorEntityId = 'https://trust.example.org'

    const { nockScopes } = await setupConfigurationChain(
      [
        { entityId: leafEntityId, authorityHints: [trustAnchorEntityId] },
        { entityId: trustAnchorEntityId, subordinates: [leafEntityId] },
      ],
      { signJwtCallback, mockEndpoints: true }
    )

    const trustChains = await resolveTrustChains({
      entityId: leafEntityId,
      trustAnchorEntityIds: [trustAnchorEntityId],
      verifyJwtCallback,
    })

    assert.strictEqual(trustChains.length, 1)
    assert.strictEqual(trustChains[0]!.chain.length, 2)

    for (const scope of nockScopes) {
      scope.done()
    }
  })

  it('should fetch a basic entity configuration chain of 3 entities', async () => {
    const leafEntityId = 'https://leaf.example.org'
    const intermediateEntityId = 'https://intermediate.example.org'
    const trustAnchorEntityId = 'https://trust.example.org'

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

    const claims: Array<EntityConfigurationClaimsOptions> = configurations.map(
      ({ claims: configurationClaims }) => configurationClaims
    )

    const trustChains = await resolveTrustChains({
      entityId: leafEntityId,
      trustAnchorEntityIds: [trustAnchorEntityId],
      verifyJwtCallback,
    })

    assert.strictEqual(trustChains.length, 1)
    assert.strictEqual(trustChains[0]!.chain.length, 3)

    // assert.deepStrictEqual(trustChains[0]!.chain[0], claims[0])
    // assert.deepStrictEqual(trustChains[0]!.chain[1], claims[1])
    // assert.deepStrictEqual(trustChains[0]!.chain[2], claims[2])

    for (const scope of nockScopes) {
      scope.done()
    }
  })

  it('should fetch a policy based entity configuration chain of 3 entities', async () => {
    const leafEntityId = 'https://leaf.example.org'
    const intermediateEntityId = 'https://intermediate.example.org'
    const trustAnchorEntityId = 'https://trust.example.org'

    const { chainData: configurations, nockScopes } = await setupConfigurationChain(
      [
        { entityId: leafEntityId, authorityHints: [intermediateEntityId] },
        {
          entityId: intermediateEntityId,
          authorityHints: [trustAnchorEntityId],
          subordinates: [
            {
              entityId: leafEntityId,
              claims: {
                metadata_policy: {
                  openid_relying_party: {
                    id_token_signed_response_alg: {
                      one_of: ['ES256'],
                    },
                    grant_types: {
                      add: ['client_credentials'],
                      subset_of: ['authorization_code', 'client_credentials'],
                    },
                  },
                },
              },
            },
          ],
        },
        { entityId: trustAnchorEntityId, subordinates: [intermediateEntityId] },
      ],
      { signJwtCallback, mockEndpoints: true }
    )

    const claims: Array<EntityConfigurationClaimsOptions> = configurations.map(
      ({ claims: configurationClaims }) => configurationClaims
    )

    const trustChains = await resolveTrustChains({
      entityId: leafEntityId,
      trustAnchorEntityIds: [trustAnchorEntityId],
      verifyJwtCallback,
    })

    assert.strictEqual(trustChains.length, 1)
    assert.strictEqual(trustChains[0]?.chain.length, 3)

    for (const scope of nockScopes) {
      scope.done()
    }
  })

  it('should fetch two entity configuration chains of 2 entities each', async () => {
    const leafEntityId = 'https://leaf.example.org'
    const intermediateOneEntityId = 'https://intermediate.one.example.org'
    const intermediateTwoEntityId = 'https://intermediate.two.example.org'
    const trustAnchorOneEntityId = 'https://trust.one.example.org'
    const trustAnchorTwoEntityId = 'https://trust.two.example.org'

    const { nockScopes } = await setupConfigurationChain(
      [
        {
          entityId: leafEntityId,
          authorityHints: [intermediateOneEntityId, intermediateTwoEntityId],
        },
        {
          entityId: intermediateOneEntityId,
          authorityHints: [trustAnchorOneEntityId],
          subordinates: [leafEntityId],
        },
        {
          entityId: intermediateTwoEntityId,
          authorityHints: [trustAnchorTwoEntityId],
          subordinates: [leafEntityId],
        },
        { entityId: trustAnchorOneEntityId, subordinates: [intermediateOneEntityId] },
        { entityId: trustAnchorTwoEntityId, subordinates: [intermediateTwoEntityId] },
      ],
      { signJwtCallback, mockEndpoints: true }
    )

    const trustChains = await resolveTrustChains({
      entityId: leafEntityId,
      trustAnchorEntityIds: [trustAnchorOneEntityId, trustAnchorTwoEntityId],
      verifyJwtCallback,
    })

    assert.strictEqual(trustChains.length, 2)
    assert.strictEqual(trustChains[0]!.chain.length, 3)
    assert.strictEqual(trustChains[1]!.chain.length, 3)

    for (const scope of nockScopes) {
      scope.done()
    }
  })

  it('should fetch one entity configuration chains when one trust anchor is provided', async () => {
    const leafEntityId = 'https://leaf.example.org'
    const intermediateOneEntityId = 'https://intermediate.one.example.org'
    const intermediateTwoEntityId = 'https://intermediate.two.example.org'
    const trustAnchorOneEntityId = 'https://trust.one.example.org'
    const trustAnchorTwoEntityId = 'https://trust.two.example.org'

    const { chainData: configurations, nockScopes } = await setupConfigurationChain(
      [
        {
          entityId: leafEntityId,
          authorityHints: [intermediateOneEntityId, intermediateTwoEntityId],
        },
        {
          entityId: intermediateOneEntityId,
          authorityHints: [trustAnchorOneEntityId],
          subordinates: [leafEntityId],
        },
        {
          entityId: intermediateTwoEntityId,
          authorityHints: [trustAnchorTwoEntityId],
          subordinates: [leafEntityId],
        },
        { entityId: trustAnchorOneEntityId, subordinates: [intermediateOneEntityId] },
        { entityId: trustAnchorTwoEntityId, subordinates: [intermediateTwoEntityId] },
      ],
      { signJwtCallback, mockEndpoints: true }
    )

    const trustChains = await resolveTrustChains({
      entityId: leafEntityId,
      trustAnchorEntityIds: [trustAnchorOneEntityId],
      verifyJwtCallback,
    })

    assert.strictEqual(trustChains.length, 1)
    assert.strictEqual(trustChains[0]!.chain.length, 3)
  })

  it('should not fetch an entity configuration chain when no authority_hints are found', async () => {
    const { chainData: configurations, nockScopes } = await setupConfigurationChain(
      [{ entityId: 'https://leaf.example.org' }],
      { signJwtCallback, mockEndpoints: true }
    )

    const trustChains = await resolveTrustChains({
      entityId: configurations[0]!.entityId,
      trustAnchorEntityIds: ['https://trust.example.org'],
      verifyJwtCallback,
    })

    assert.strictEqual(trustChains.length, 0)

    for (const scope of nockScopes) {
      scope.done()
    }
  })

  it('should not fetch an entity configuration chain when a loop is found', async () => {
    const leafEntityId = 'https://leaf.example.org'
    const intermediateOneEntityId = 'https://intermediate.one.example.org'
    const intermediateTwoEntityId = 'https://intermediate.two.example.org'
    const trustAnchorEntityId = 'https://trust.example.org'

    const { chainData: configurations, nockScopes } = await setupConfigurationChain(
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
      { signJwtCallback, mockEndpoints: true }
    )

    const trustChains = await resolveTrustChains({
      verifyJwtCallback,
      entityId: configurations[0]!.entityId,
      trustAnchorEntityIds: [trustAnchorEntityId],
    })

    assert.strictEqual(trustChains.length, 0)

    for (const scope of nockScopes) {
      scope.done()
    }
  })

  it('should not fetch an entity configuration chain when no trust anchors are provided', async () => {
    await assert.rejects(
      resolveTrustChains({
        verifyJwtCallback,
        entityId: 'https://example.org',
        trustAnchorEntityIds: [],
      })
    )
  })

  it('should succeed the example from the spec', async () => {
    const leafEntityId = 'https://leaff.example.org'
    const intermediateEntityId = 'https://intermediate.example.org'
    const trustAnchorEntityId = 'https://trust.example.org'

    await setupConfigurationChain(
      [
        {
          entityId: leafEntityId,
          authorityHints: [intermediateEntityId],
          claims: {
            metadata: {
              // Figure 15: https://openid.net/specs/openid-federation-1_0.html#figure-15
              openid_relying_party: {
                redirect_uris: ['https://rp.example.org/callback'],
                response_types: ['code'],
                token_endpoint_auth_method: 'self_signed_tls_client_auth',
                contacts: ['rp_admins@rp.example.org'],

                // (Required property was not given in the spec)
                client_registration_types: ['automatic'],
              },
            },
          },
        },
        {
          entityId: intermediateEntityId,
          authorityHints: [trustAnchorEntityId],
          subordinates: [
            {
              entityId: leafEntityId,
              claims: {
                // Figure 13: https://openid.net/specs/openid-federation-1_0.html#figure-13
                metadata_policy: {
                  openid_relying_party: {
                    grant_types: {
                      subset_of: ['authorization_code'],
                    },
                    token_endpoint_auth_method: {
                      one_of: ['self_signed_tls_client_auth'],
                    },
                    contacts: {
                      add: ['helpdesk@org.example.org'],
                    },
                  },
                },
                metadata: {
                  openid_relying_party: {
                    sector_identifier_uri: 'https://org.example.org/sector-ids.json',
                    policy_uri: 'https://org.example.org/policy.html',

                    // (Required property was not given in the spec)
                    client_registration_types: ['automatic'],
                  },
                },
              },
            },
          ],
        },
        {
          entityId: trustAnchorEntityId,
          subordinates: [
            {
              entityId: intermediateEntityId,
              claims: {
                // Figure 12: https://openid.net/specs/openid-federation-1_0.html#figure-12
                metadata_policy: {
                  openid_relying_party: {
                    grant_types: {
                      default: ['authorization_code'],
                      subset_of: ['authorization_code', 'refresh_token'],
                      superset_of: ['authorization_code'],
                    },
                    token_endpoint_auth_method: {
                      one_of: ['private_key_jwt', 'self_signed_tls_client_auth'],
                      essential: true,
                    },
                    token_endpoint_auth_signing_alg: {
                      one_of: ['PS256', 'ES256'],
                    },
                    subject_type: {
                      value: 'pairwise',
                    },
                    contacts: {
                      add: ['helpdesk@federation.example.org'],
                    },
                  },
                },
              },
            },
          ],
        },
      ],
      { signJwtCallback, mockEndpoints: true }
    )

    const trustChains = await resolveTrustChains({
      entityId: leafEntityId,
      trustAnchorEntityIds: [trustAnchorEntityId],
      verifyJwtCallback,
    })

    assert.strictEqual(trustChains.length, 1)
    assert.strictEqual(trustChains[0]?.chain.length, 3)

    assert.deepStrictEqual(trustChains[0]?.resolvedLeafMetadata, {
      openid_relying_party: {
        redirect_uris: ['https://rp.example.org/callback'],
        grant_types: ['authorization_code'],
        response_types: ['code'],
        token_endpoint_auth_method: 'self_signed_tls_client_auth',
        subject_type: 'pairwise',
        sector_identifier_uri: 'https://org.example.org/sector-ids.json',
        policy_uri: 'https://org.example.org/policy.html',
        contacts: ['rp_admins@rp.example.org', 'helpdesk@federation.example.org', 'helpdesk@org.example.org'],

        // Not from the figure
        client_registration_types: ['automatic'],
      },

      // Not from the figure
      federation_entity: {
        federation_fetch_endpoint: 'https://leaff.example.org/fetch',
      },
    })
  })

  it('should work when the leaf is also the TA', async () => {
    const leafEntityId = 'https://leaff.example.org'
    const intermediateEntityId = 'https://intermediate.example.org'
    const trustAnchorEntityId = 'https://trust.example.org'

    await setupConfigurationChain(
      [
        {
          entityId: leafEntityId,
          authorityHints: [intermediateEntityId],
          claims: {
            metadata: {
              // Figure 15: https://openid.net/specs/openid-federation-1_0.html#figure-15
              openid_relying_party: {
                redirect_uris: ['https://rp.example.org/callback'],
                response_types: ['code'],
                token_endpoint_auth_method: 'self_signed_tls_client_auth',
                contacts: ['rp_admins@rp.example.org'],

                // (Required property was not given in the spec)
                client_registration_types: ['automatic'],
              },
            },
          },
        },
        {
          entityId: intermediateEntityId,
          authorityHints: [trustAnchorEntityId],
          subordinates: [
            {
              entityId: leafEntityId,
              claims: {
                // Figure 13: https://openid.net/specs/openid-federation-1_0.html#figure-13
                metadata_policy: {
                  openid_relying_party: {
                    grant_types: {
                      subset_of: ['authorization_code'],
                    },
                    token_endpoint_auth_method: {
                      one_of: ['self_signed_tls_client_auth'],
                    },
                    contacts: {
                      add: ['helpdesk@org.example.org'],
                    },
                  },
                },
                metadata: {
                  openid_relying_party: {
                    sector_identifier_uri: 'https://org.example.org/sector-ids.json',
                    policy_uri: 'https://org.example.org/policy.html',

                    // (Required property was not given in the spec)
                    client_registration_types: ['automatic'],
                  },
                },
              },
            },
          ],
        },
        {
          entityId: trustAnchorEntityId,
          subordinates: [
            {
              entityId: intermediateEntityId,
              claims: {
                // Figure 12: https://openid.net/specs/openid-federation-1_0.html#figure-12
                metadata_policy: {
                  openid_relying_party: {
                    grant_types: {
                      default: ['authorization_code'],
                      subset_of: ['authorization_code', 'refresh_token'],
                      superset_of: ['authorization_code'],
                    },
                    token_endpoint_auth_method: {
                      one_of: ['private_key_jwt', 'self_signed_tls_client_auth'],
                      essential: true,
                    },
                    token_endpoint_auth_signing_alg: {
                      one_of: ['PS256', 'ES256'],
                    },
                    subject_type: {
                      value: 'pairwise',
                    },
                    contacts: {
                      add: ['helpdesk@federation.example.org'],
                    },
                  },
                },
              },
            },
          ],
        },
      ],
      { signJwtCallback, mockEndpoints: true }
    )

    const trustChains = await resolveTrustChains({
      entityId: leafEntityId,
      trustAnchorEntityIds: [leafEntityId],
      verifyJwtCallback,
    })

    assert.strictEqual(trustChains.length, 1)
    assert.strictEqual(trustChains[0]?.chain.length, 1)

    assert.deepStrictEqual(trustChains[0]?.resolvedLeafMetadata, {
      openid_relying_party: {
        contacts: ['rp_admins@rp.example.org'],
        redirect_uris: ['https://rp.example.org/callback'],
        response_types: ['code'],
        token_endpoint_auth_method: 'self_signed_tls_client_auth',

        // Not from the figure
        client_registration_types: ['automatic'],
      },

      // Not from the figure
      federation_entity: {
        federation_fetch_endpoint: 'https://leaff.example.org/fetch',
      },
    })
  })

  it('should not resolve when there is a metadata_policy_crit custom function', async () => {
    const leafEntityId = 'https://leaff.example.org'
    const trustAnchorEntityId = 'https://trust.example.org'

    await setupConfigurationChain(
      [
        {
          entityId: leafEntityId,
          authorityHints: [trustAnchorEntityId],
          claims: {
            metadata: {
              openid_relying_party: {
                redirect_uris: ['https://rp.example.org/callback'],
                response_types: ['code'],
                token_endpoint_auth_method: 'self_signed_tls_client_auth',
                contacts: ['rp_admins@rp.example.org'],

                sector_identifier_uri: 'https://org.example.org/sector-ids.json',
                policy_uri: 'https://org.example.org/policy.html',

                client_registration_types: ['automatic'],
              },
            },
          },
        },
        {
          entityId: trustAnchorEntityId,
          subordinates: [
            {
              entityId: leafEntityId,
              claims: {
                metadata_policy_crit: ['regexp'],
                metadata_policy: {
                  openid_relying_party: {
                    sector_identifier_uri: {
                      regexp: '^https:\\/\\/',
                    },
                  },
                },
                metadata: {
                  openid_relying_party: {
                    // (Required property was not given in the spec)
                    client_registration_types: ['automatic'],
                  },
                },
              },
            },
          ],
        },
      ],
      { signJwtCallback, mockEndpoints: true }
    )

    const trustChains = await resolveTrustChains({
      entityId: leafEntityId,
      trustAnchorEntityIds: [trustAnchorEntityId],
      verifyJwtCallback,
    })

    // The chain
    assert.strictEqual(trustChains.length, 0)
  })

  it('should succeed when there is a unknown function and it is not critical', async () => {
    const leafEntityId = 'https://leaff.example.org'
    const trustAnchorEntityId = 'https://trust.example.org'

    await setupConfigurationChain(
      [
        {
          entityId: leafEntityId,
          authorityHints: [trustAnchorEntityId],
          claims: {
            metadata: {
              openid_relying_party: {
                redirect_uris: ['https://rp.example.org/callback'],
                response_types: ['code'],
                token_endpoint_auth_method: 'self_signed_tls_client_auth',
                contacts: ['rp_admins@rp.example.org'],

                sector_identifier_uri: 'https://org.example.org/sector-ids.json',
                policy_uri: 'https://org.example.org/policy.html',

                client_registration_types: ['automatic'],
              },
            },
          },
        },
        {
          entityId: trustAnchorEntityId,
          subordinates: [
            {
              entityId: leafEntityId,
              claims: {
                metadata_policy: {
                  openid_relying_party: {
                    sector_identifier_uri: {
                      regexp: '^https:\\/\\/',
                    },
                  },
                },
                metadata: {
                  openid_relying_party: {
                    // (Required property was not given in the spec)
                    client_registration_types: ['automatic'],
                  },
                },
              },
            },
          ],
        },
      ],
      { signJwtCallback, mockEndpoints: true }
    )

    const trustChains = await resolveTrustChains({
      entityId: leafEntityId,
      trustAnchorEntityIds: [trustAnchorEntityId],
      verifyJwtCallback,
    })

    assert.strictEqual(trustChains.length, 1)
    assert.strictEqual(trustChains[0]?.chain.length, 2)

    assert.deepStrictEqual(trustChains[0]?.resolvedLeafMetadata, {
      openid_relying_party: {
        contacts: ['rp_admins@rp.example.org'],
        redirect_uris: ['https://rp.example.org/callback'],
        response_types: ['code'],
        token_endpoint_auth_method: 'self_signed_tls_client_auth',
        policy_uri: 'https://org.example.org/policy.html',
        sector_identifier_uri: 'https://org.example.org/sector-ids.json',
        // Not from the figure
        client_registration_types: ['automatic'],
      },

      // Not from the figure
      federation_entity: {
        federation_fetch_endpoint: 'https://leaff.example.org/fetch',
      },
    })
  })
})
