import { Buffer } from 'buffer'
import { z } from 'zod'
import { validate } from '../utils/validate'

const defaultSchema = z.record(z.string().or(z.number()), z.unknown())

/**
 *
 * @todo better jwt validation
 *
 */
export const jsonWebTokenSchema = <
  CS extends z.ZodSchema = typeof defaultSchema,
  HS extends z.ZodSchema = typeof defaultSchema,
>(
  {
    claimsSchema = defaultSchema as unknown as CS,
    headerSchema = defaultSchema as unknown as HS,
  }: {
    claimsSchema?: CS
    headerSchema?: HS
  } = {
    claimsSchema: defaultSchema as unknown as CS,
    headerSchema: defaultSchema as unknown as HS,
  }
) =>
  z.string().transform((s) => {
    const [header, claims, signature] = s.split('.')
    const decodedHeader = Buffer.from(header, 'base64url').toString()
    const decodedClaims = Buffer.from(claims, 'base64url').toString()
    const decodedSignature = Buffer.from(signature, 'base64url')

    const validatedHeader = validate({
      schema: headerSchema,
      data: JSON.parse(decodedHeader),
      errorMessage: 'invalid header claims provided',
    })
    const validatedClaims = validate({
      schema: claimsSchema,
      data: JSON.parse(decodedClaims),
      errorMessage: 'invalid payload claims provided',
    })

    return {
      header: validatedHeader,
      claims: validatedClaims,
      signature: new Uint8Array(decodedSignature),
    }
  })
