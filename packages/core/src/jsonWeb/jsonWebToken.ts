import { Buffer } from 'node:buffer'
import { type ZodSchema, z } from 'zod'

const defaultSchema = z.record(z.string().or(z.number()), z.unknown())

/**
 *
 * @todo better jwt validation
 *
 */
export const jsonWebTokenSchema = (
  {
    claimsSchema = defaultSchema,
    headerSchema = defaultSchema,
  }: {
    claimsSchema?: ZodSchema
    headerSchema?: ZodSchema
  } = { claimsSchema: defaultSchema, headerSchema: defaultSchema }
) =>
  z.string().refine((s) => {
    const [header, claims] = s.split('.')
    const decodedHeader = Buffer.from(header, 'base64url').toString()
    const decodedClaims = Buffer.from(claims, 'base64url').toString()

    const validatedHeader = headerSchema.parse(JSON.parse(decodedHeader))
    const validatedClaims = claimsSchema.parse(JSON.parse(decodedClaims))

    return { header: validatedHeader, claims: validatedClaims }
  })
