import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { type EntityConfigurationClaims, fetchEntityConfiguration } from '../src/entityConfiguration'
import { fetchEntityStatementChain } from '../src/entityStatement'
import { applyMetadataPolicyToMetadata, combineMetadataPolicies } from '../src/resolveTrustChains/policies'
import { mergeMetadata } from '../src/resolveTrustChains/policies/utils'
import type { SignCallback, VerifyCallback } from '../src/utils'
import { setupConfigurationChain } from './utils/setupConfigurationChain'

describe('policy application to the real metadata chain', () => {
  const signJwtCallback: SignCallback = () => Promise.resolve(new Uint8Array(10).fill(42))
  const verifyJwtCallback: VerifyCallback = () => Promise.resolve(true)

  it('should succeed the example from the spec', async () => {
    const leafEntityId = 'https://leaff.example.org'
    const intermediateEntityId = 'https://intermediate.example.org'
    const trustAnchorEntityId = 'https://trust.example.org'

    const { chainData: configurations } = await setupConfigurationChain(
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

    const statements = await fetchEntityStatementChain({
      entityConfigurations: configurations.map(({ claims }) => claims as EntityConfigurationClaims),
      verifyJwtCallback,
    })

    const statementsWithoutLeaf = statements.slice(0, -1)

    const { mergedPolicy } = await combineMetadataPolicies({ statements: statementsWithoutLeaf })

    assert.deepStrictEqual(mergedPolicy, {
      // Figure 14 https://openid.net/specs/openid-federation-1_0.html#figure-14
      openid_relying_party: {
        grant_types: {
          default: ['authorization_code'],
          superset_of: ['authorization_code'],
          subset_of: ['authorization_code'],
        },
        token_endpoint_auth_method: {
          one_of: ['self_signed_tls_client_auth'],
          essential: true,
        },
        token_endpoint_auth_signing_alg: {
          one_of: ['PS256', 'ES256'],
        },
        subject_type: {
          value: 'pairwise',
        },
        contacts: {
          add: ['helpdesk@federation.example.org', 'helpdesk@org.example.org'],
        },
      },
    })

    const { metadata: leafMetadata } = await fetchEntityConfiguration({
      entityId: leafEntityId,
      verifyJwtCallback,
    })
    if (!leafMetadata) throw new Error('Leaf metadata is not defined')

    // When the chain only has one entity configuration we don't have a superior entity statement so it will always be correct so in practice it can be returned early

    const superiorEntityStatement = statementsWithoutLeaf[0]
    if (!superiorEntityStatement) throw new Error('Superior entity statement is not defined')

    const mergedLeafMetadata = mergeMetadata(leafMetadata, superiorEntityStatement.metadata ?? {})

    const applyMetadataPolicyToMetadataResult = await applyMetadataPolicyToMetadata({
      leafMetadata: mergedLeafMetadata,
      policyMetadata: mergedPolicy,
    })

    assert.deepStrictEqual(applyMetadataPolicyToMetadataResult.resolvedLeafMetadata, {
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
})
