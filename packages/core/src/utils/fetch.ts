import type { z } from 'zod'
import { addSearchParams } from './url'
import { validate } from './validate'

const get = async <T extends z.ZodSchema>({
  url,
  searchParams,
  responseValidationSchema,
  requiredContentType,
}: {
  url: string
  searchParams?: Record<string, string>
  responseValidationSchema?: T
  requiredContentType?: string
}): Promise<typeof responseValidationSchema extends T ? z.output<T> : string> => {
  // Fetch the url with the search params
  const urlSearchParams = new URLSearchParams(searchParams)
  const urlWithSearchParams = addSearchParams(url, urlSearchParams)
  const response = await global.fetch(urlWithSearchParams, {
    method: 'GET',
  })

  // validate the expected content-type
  if (requiredContentType && response.headers.get('content-type') !== requiredContentType) {
    throw new Error(
      `received content-type '${response.headers.get(
        'content-type'
      )}' does not equal expected content-type '${requiredContentType}'`
    )
  }

  // If we pass in a validation schema, we expect JSON output
  if (responseValidationSchema) {
    const json = await response.json()
    return validate({
      data: json,
      schema: responseValidationSchema,
      errorMessage: 'invalid response from the GET call',
    })
  }

  // If no validation schema is passed in, we expect a string as response
  const text = await response.text()
  return text
}

/**
 *
 * @todo make get/post use the same method private internally as changes with apply to both
 *
 */
const post = async ({
  url,
  body,
  responseValidationSchema,
}: {
  url: string
  body?: Record<string, unknown>
  responseValidationSchema?: z.ZodSchema
}) => {
  const response = await global.fetch(url, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
    headers: { 'Content-Type': 'application/json' },
  })

  if (responseValidationSchema) {
    const json = await response.json()
    return validate({
      data: json,
      schema: responseValidationSchema,
      errorMessage: 'invalid response from a POST call',
    })
  }

  const text = await response.text()

  return text
}

export const fetcher = {
  get,
  post,
}
