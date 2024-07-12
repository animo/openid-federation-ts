import {
  type EntityConfigurationClaimsOptions,
  type EntityConfigurationHeaderOptions,
  createEntityConfiguration,
} from '../../src/entityConfiguration'
import type { JsonWebKeySetOptions } from '../../src/jsonWeb'
import type { SignCallback } from '../../src/utils'

type SetupConfigurationChainOptions = {
  entityId: string
  authorityHints?: Array<string>
  jwks?: JsonWebKeySetOptions
  kid?: string
}

export const setupConfigurationChain = async (
  options: Array<SetupConfigurationChainOptions>,
  signJwtCallback: SignCallback
) => {
  const chainData: Array<{
    claims: EntityConfigurationClaimsOptions
    jwt: string
    entityId: string
  }> = []
  for (const { entityId, authorityHints, jwks, kid } of options) {
    const claims: EntityConfigurationClaimsOptions = {
      iss: entityId,
      sub: entityId,
      exp: new Date(),
      iat: new Date(),
      jwks: jwks ?? { keys: [{ kid: 'a', kty: 'EC' }] },
      authority_hints: authorityHints,
    }

    // fix so `undefined` is not in the expected claims
    if (!authorityHints) delete claims.authority_hints

    const header: EntityConfigurationHeaderOptions = {
      kid: kid ?? 'a',
      typ: 'entity-statement+jwt',
    }

    const jwt = await createEntityConfiguration({
      claims,
      header,
      signJwtCallback,
    })

    chainData.push({ claims, jwt, entityId })
  }

  return chainData
}
