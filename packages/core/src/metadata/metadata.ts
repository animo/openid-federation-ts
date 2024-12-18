import { z } from 'zod'

import {
  federationEntityMetadata,
  oauthAuthorizationServerEntityMetadata,
  oauthClientEntityMetadata,
  oauthResourceEntityMetadata,
  openIdCredentialIssuerEntityMetadata,
  openIdProviderEntityMetadata,
  openidCredentialVerifierEntityMetadata,
  openidRelyingPartyEntityMetadata,
} from './entity'

export const metadataSchema = z.object({
  [federationEntityMetadata.identifier]: federationEntityMetadata.schema.optional(),
  [openidRelyingPartyEntityMetadata.identifier]: openidRelyingPartyEntityMetadata.schema.optional(),
  [openidCredentialVerifierEntityMetadata.identifier]: openidCredentialVerifierEntityMetadata.schema.optional(),
  [openIdCredentialIssuerEntityMetadata.identifier]: openIdCredentialIssuerEntityMetadata.schema.optional(),
  [openIdProviderEntityMetadata.identifier]: openIdProviderEntityMetadata.schema.optional(),
  [oauthAuthorizationServerEntityMetadata.identifier]: oauthAuthorizationServerEntityMetadata.schema.optional(),
  [oauthClientEntityMetadata.identifier]: oauthClientEntityMetadata.schema.optional(),
  [oauthResourceEntityMetadata.identifier]: oauthResourceEntityMetadata.schema.optional(),
})

export type Metadata = z.input<typeof metadataSchema>
