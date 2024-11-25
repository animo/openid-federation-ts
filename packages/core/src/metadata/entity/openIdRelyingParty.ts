import { z } from 'zod'
import { createEntity } from './utils'

// TODO: In the wallet specification they are talking about a `openid_credential_verifier` property which is the exact same as the `openid_relying_party` how should we handle this?

/**
 *
 * {@link https://openid.net/specs/openid-federation-1_0.html#section-5.1.2-1 | openID Relying Party }
 *
 */
export const openidRelyingPartyEntityMetadata = createEntity({
  identifier: 'openid_relying_party',
  passThroughUnknownProperties: true,
  additionalValidation: {
    client_registration_types: z.array(z.union([z.literal('automatic'), z.literal('explicit')])),
  },
})

export type OpenIdRelyingPartyMetadata = z.input<(typeof openidRelyingPartyEntityMetadata)['schema']>
