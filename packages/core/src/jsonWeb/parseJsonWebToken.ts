import { Buffer } from 'buffer'

type JsonWebTokenParts = {
  header: Record<string, unknown>
  claims: Record<string, unknown>
  signature: Uint8Array
  signableInput: Uint8Array
}

export const parseJsonWebToken = (jwt: string): JsonWebTokenParts => {
  const [encodedHeader, encodedClaims, encodedSignature] = jwt.split('.')

  if (!encodedHeader) {
    throw new Error('could not find the header in the JWT')
  }

  if (!encodedClaims) {
    throw new Error('could not find the claims in the JWT')
  }

  if (!encodedSignature) {
    throw new Error('could not find the signature in the JWT')
  }

  const header = JSON.parse(Buffer.from(encodedHeader, 'base64url').toString())
  const claims = JSON.parse(Buffer.from(encodedClaims, 'base64url').toString())
  const signature = new Uint8Array(Buffer.from(encodedSignature, 'base64url'))

  return {
    header,
    claims,
    signature,
    signableInput: new Uint8Array(Buffer.from(`${encodedHeader}.${encodedClaims}`)),
  }
}
