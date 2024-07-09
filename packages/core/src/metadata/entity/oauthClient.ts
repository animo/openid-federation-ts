import type { z } from 'zod'
import { createEntity } from './utils'

/**
 *
 * {@link https://openid.net/specs/openid-federation-1_0.html#section-5.1.5-1 | oauth Client}
 *
 */
export const oauthClientEntityMetadata = createEntity({ identifier: 'oauth_client' })

export type OauthClientMetadata = z.input<(typeof oauthClientEntityMetadata)['schema']>
