import { z } from 'zod'

export const trustMarkIssuerSchema = z.record(z.string(), z.array(z.string()))

export type TrustMarkIssuer = z.input<typeof trustMarkIssuerSchema>
