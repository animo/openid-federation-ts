import type { z } from 'zod'
import { createEntity } from './utils'

/**
 *
 * https://openid.net/specs/openid-federation-1_0.html#section-5.1.4-1
 *
 */
export const oauthAuthorizationServerEntityMetadata = createEntity({
  identifier: 'oauth_authorization_server',
})

export type OauthAuthorizationServerMetadata = z.input<(typeof oauthAuthorizationServerEntityMetadata)['schema']>
