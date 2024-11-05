import { z } from 'zod'
import {
  federationEntityMetadata,
  oauthAuthorizationServerEntityMetadata,
  oauthClientEntityMetadata,
  oauthResourceEntityMetadata,
  openIdProviderEntityMetadata,
  openidRelyingPartyEntityMetadata,
} from './entity'

export const metadataPolicySchema = z.object({
  [federationEntityMetadata.identifier]: federationEntityMetadata.policySchema.optional(),
  [openidRelyingPartyEntityMetadata.identifier]: openidRelyingPartyEntityMetadata.policySchema.optional(),
  [openIdProviderEntityMetadata.identifier]: openIdProviderEntityMetadata.policySchema.optional(),
  [oauthAuthorizationServerEntityMetadata.identifier]: oauthAuthorizationServerEntityMetadata.policySchema.optional(),
  [oauthClientEntityMetadata.identifier]: oauthClientEntityMetadata.policySchema.optional(),
  [oauthResourceEntityMetadata.identifier]: oauthResourceEntityMetadata.policySchema.optional(),
})

export type MetadataPolicy = z.infer<typeof metadataPolicySchema>
