import { z } from 'zod'
import { createEntity } from './utils'

/**
 *
 * {@link https://openid.net/specs/openid-federation-1_0.html#section-5.1.1-1 | Federation Entity}
 *
 */
export const federationEntityMetadata = createEntity({
  identifier: 'federation_entity',
  additionalValidation: {
    federation_fetch_endpoint: z.string().url().optional(),
    federation_list_endpoint: z.string().url().optional(),
    federation_resolve_endpoint: z.string().url().optional(),
    federation_trust_mark_status_endpoint: z.string().url().optional(),
    federation_trust_mark_list_endpoint: z.string().url().optional(),
    federation_trust_mark_endpoint: z.string().url().optional(),
    federation_historical_keys_endpoint: z.string().url().optional(),
  },
})

export type FederationEntityMetadata = z.input<(typeof federationEntityMetadata)['schema']>
