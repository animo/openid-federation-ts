import { Buffer } from 'buffer'

/**
 *
 * Create a json web token according to {@link https://datatracker.ietf.org/doc/html/rfc7519 | RFC7519 }
 *
 */
export const createJsonWebToken = (
  header: Record<string, unknown>,
  payload: Record<string, unknown>,
  signature: Uint8Array
) => {
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url')
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url')

  const encodedSignature = Buffer.from(signature).toString('base64url')

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`
}
