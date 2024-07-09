import type { z } from 'zod'
import { createEntity } from './utils'

/**
 *
 * https://openid.net/specs/openid-federation-1_0.html#section-5.1.6
 *
 */
export const oauthResourceEntityMetadata = createEntity({
  identifier: 'oauth_resource',
})

export type OauthResourceMetadata = z.input<(typeof oauthResourceEntityMetadata)['schema']>
