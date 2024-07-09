import { z } from 'zod'

/**
 *
 * Date schema that parses an unix timestamp in seconds since EPOCH to js date object
 *
 */
export const dateSchema = z
  .union([z.date(), z.number(), z.string().transform((x) => (x.includes('T') ? new Date(x) : Number(x)))])
  .transform((d) => (d instanceof Date ? d : new Date(d * 1000)))
