import type { Metadata } from '../../metadata'

export class MetadataHelper {
  public constructor(private readonly leafMetadata: Record<string, Record<string, unknown>>) {}

  public get metadata(): Metadata {
    return this.leafMetadata
  }

  public hasProperty(service: string, property: string) {
    return this.leafMetadata[service]?.[property] !== undefined
  }

  public getPropertyValue<T = unknown>(service: string, property: string): T | undefined {
    const serviceBlock = this.leafMetadata[service]
    if (serviceBlock === undefined) return undefined
    const propertyValue = serviceBlock[property]
    if (propertyValue === undefined) return undefined
    return propertyValue as T
  }

  public setPropertyValue(service: string, property: string, value: unknown) {
    this.leafMetadata[service] ??= {}
    this.leafMetadata[service][property] = value
  }

  public deleteProperty(service: string, property: string) {
    const serviceBlock = this.leafMetadata[service]
    if (serviceBlock === undefined) return

    delete serviceBlock[property]

    // When the service block is empty we can delete the service block
    if (Object.keys(serviceBlock).length === 0) {
      delete this.leafMetadata[service]
    }
  }
}
