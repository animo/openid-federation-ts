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

export const isNullOrUndefined = (value: unknown): value is null | undefined => value === null || value === undefined

export const immutable = <T extends object>(obj: T): T =>
  new Proxy(obj, {
    get(target: T, prop: string | symbol) {
      const value = target[prop as keyof T]
      return typeof value === 'object' && value !== null ? immutable(value) : value
    },
    set() {
      throw new Error('This object is immutable.')
    },
  })
