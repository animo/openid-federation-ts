import { ErrorCode } from '../error/ErrorCode'
import { OpenIdFederationError } from '../error/OpenIdFederationError'

/**
 *
 * Add paths to a url
 *
 * ## example
 *
 * ```typescript
 * const url = addPaths('https://example.org','path', 'two')
 * assert(url, "https://example.org/path/two")
 *
 * const url = addPaths('https://example.org/','path', 'two')
 * assert(url, "https://example.org/path/two")
 *
 * const url = addPaths('https://example.org/','path/', '/two/')
 * assert(url, "https://example.org/path/two")
 * ```
 *
 */
export const addPaths = (baseUrl: string, ...paths: Array<string>) => {
  const [scheme, rest] = baseUrl.split('://')
  if (!rest) {
    throw new OpenIdFederationError(ErrorCode.Validation, 'not a valid URL')
  }

  const urlWithoutScheme = rest
    // Get all base the parts
    .split('/')
    // Add the paths
    .concat(...paths.map((p) => p.split('/')))
    // Filter out empty paths (i.e. '///path///' to 'path')
    .filter((s) => s.length > 0)
    // Create the full url
    .join('/')

  return `${scheme}://${urlWithoutScheme}`
}

export const addSearchParams = (baseUrl: string, searchParams: URLSearchParams | Record<string, string>) =>
  baseUrl.endsWith('?')
    ? `${baseUrl}${searchParams instanceof URLSearchParams ? searchParams : new URLSearchParams(searchParams)}`
    : `${baseUrl}?${searchParams instanceof URLSearchParams ? searchParams : new URLSearchParams(searchParams)}`
