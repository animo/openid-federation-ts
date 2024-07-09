import { Buffer } from 'node:buffer'
import { z } from 'zod'

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

    const validatedHeader = headerSchema.parse(JSON.parse(decodedHeader)) as z.infer<HS>
    const validatedClaims = claimsSchema.parse(JSON.parse(decodedClaims)) as z.infer<CS>

    return {
      header: validatedHeader,
      claims: validatedClaims,
      signature: new Uint8Array(decodedSignature),
    }
  })
