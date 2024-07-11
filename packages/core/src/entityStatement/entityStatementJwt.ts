import { jsonWebTokenSchema } from '../jsonWeb'
import { entityStatementClaimsSchema } from './entityStatementClaims'
import { entityStatementHeaderSchema } from './entityStatementHeader'

export const entityStatementJwtSchema = jsonWebTokenSchema({
  headerSchema: entityStatementHeaderSchema,
  claimsSchema: entityStatementClaimsSchema,
})
