import {
  type EntityConfigurationClaimsOptions,
  type EntityConfigurationHeaderOptions,
  createEntityConfiguration,
} from '../../src/entityConfiguration'
import { createEntityStatement } from '../../src/entityStatement'
import type { JsonWebKeySetOptions } from '../../src/jsonWeb'
import type { SignCallback } from '../../src/utils'

type SetupConfigurationChainOptions = {
  entityId: string
  authorityHints?: Array<string>
  subordinates?: Array<string>
  jwks?: JsonWebKeySetOptions
  kid?: string
  includeSourceEndpoint?: boolean
}

export const setupConfigurationChain = async (
  options: Array<SetupConfigurationChainOptions>,
  signJwtCallback: SignCallback
) => {
  const chainData: Array<{
    claims: EntityConfigurationClaimsOptions
    jwt: string
    entityId: string
    subordinateStatements?: Array<{ entityId: string; jwt: string }>
  }> = []
  for (const { entityId, authorityHints, jwks, kid, subordinates, includeSourceEndpoint = true } of options) {
    const claims: EntityConfigurationClaimsOptions = {
      iss: entityId,
      sub: entityId,
      exp: new Date(),
      iat: new Date(),
      jwks: jwks ?? { keys: [{ kid: 'a', kty: 'EC' }] },
      authority_hints: authorityHints,
      source_endpoint: `${entityId}/fetch`,
    }

    // fix so `undefined` is not in the expected claims
    if (!authorityHints) delete claims.authority_hints
    if (!includeSourceEndpoint) delete claims.source_endpoint

    const header: EntityConfigurationHeaderOptions = {
      kid: kid ?? 'a',
      typ: 'entity-statement+jwt',
    }

    const jwt = await createEntityConfiguration({
      claims,
      header,
      signJwtCallback,
    })

    const subordinateStatements = []
    for (const sub of subordinates ?? []) {
      const entityStatementJwt = await createEntityStatement({
        signJwtCallback,
        jwk: claims.jwks.keys[0]!,
        claims: {
          jwks: { keys: [] },
          iss: entityId,
          sub,
          exp: new Date(),
          iat: new Date(),
        },
      })

      subordinateStatements.push({ entityId: sub, jwt: entityStatementJwt })
    }

    chainData.push({
      claims,
      jwt,
      entityId,
      subordinateStatements,
    })
  }

  return chainData
}
