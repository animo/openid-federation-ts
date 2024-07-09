import { z } from 'zod'

export const dateSchema = z.number().refine((date) => new Date(date * 1000))
