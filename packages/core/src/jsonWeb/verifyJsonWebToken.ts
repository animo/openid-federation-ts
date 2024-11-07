import type { VerifyCallback } from '../utils'
import { getUsedJsonWebKey } from './getUsedJsonWebKey'
import type { JsonWebKeySet } from './jsonWebKeySet'
import { parseJsonWebToken } from './parseJsonWebToken'

type VerifyJsonWebTokenOptions = {
  verifyJwtCallback: VerifyCallback
  jwks?: JsonWebKeySet
  jwt: string
}

export const verifyJwtSignature = async ({ jwt, jwks, verifyJwtCallback }: VerifyJsonWebTokenOptions) => {
  const { header, signature, claims, signableInput } = parseJsonWebToken(jwt)

  const jsonWebKeySetClaims = jwks ? { jwks } : claims

  const jwk = getUsedJsonWebKey(header, jsonWebKeySetClaims)

  try {
    const isValid = await verifyJwtCallback({
      jwt,
      header,
      claims,
      signature,
      jwk,
      data: signableInput,
    })

    // TODO: better error message
    if (!isValid) {
      throw new Error('Signature in the JWT is invalid')
    }
  } catch (e: unknown) {
    if (typeof e === 'string') {
      throw new Error(e)
    }

    throw e
  }
}
