/**
 * Converts an object to an array of entries with better typing for the key
 */
export function objectToEntries<
  TObject extends {
    [Tkey in keyof TObject]: TObject[Tkey]
  },
>(obj: TObject) {
  return Object.entries(obj) as [keyof TObject, TObject[keyof TObject]][]
}

/**
 * Creates a deep clone of an object
 */
export const cloneDeep = <T>(obj: T): T => JSON.parse(JSON.stringify(obj))
