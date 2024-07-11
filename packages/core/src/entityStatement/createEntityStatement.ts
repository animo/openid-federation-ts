import { type JsonWebKey, createJsonWebToken, createJwtSignableInput } from '../jsonWeb'
import type { SignCallback } from '../utils'
import { type EntityStatementClaims, entityStatementClaimsSchema } from './entityStatementClaims'
import { type EntityStatementHeader, entityStatementHeaderSchema } from './entityStatementHeader'

export type CreateEntityStatementOptions = {
  claims: EntityStatementClaims
  header?: EntityStatementHeader
  signJwtCallback: SignCallback
  /**
   *
   * The Json Web Key of the issuer used for signing the statement about the subject
   *
   */
  jwk: JsonWebKey
}

/**
 *
 * Create an entity statement
 *
 * The signing callback will be called with the `header.kid` value in the `claims.jwks.keys` and a signed JWT will be returned
 *
 */
export const createEntityStatement = async ({
  signJwtCallback,
  claims,
  jwk,
  header = {
    typ: 'entity-statement+jwt',
    kid: jwk.kid,
  },
}: CreateEntityStatementOptions) => {
  if (header.kid !== jwk.kid) {
    throw new Error(`key id in the header: '${header.kid}' does not match the key id in the JWK: '${jwk.kid}'`)
  }

  // Validate the input
  entityStatementClaimsSchema.parse(claims)
  entityStatementHeaderSchema.parse(header)

  // Create a signable input based on the header and payload
  const toBeSigned = createJwtSignableInput(header, claims)

  // Call the signing callback so the user has to handle the crypto part
  const signature = await signJwtCallback({ toBeSigned, jwk })

  // return a json web token based on the header, claims and associated signature
  return createJsonWebToken(header, claims, signature)
}
