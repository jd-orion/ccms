import { InterfaceConfig } from "./interface";
import { getValue } from "./value";

export type EnumerationOptionsConfig = ManualEnumerationOptionsConfig | InterfaceEnumerationOptionsConfig

interface ManualEnumerationOptionsConfig {
  from: 'manual'
  data?: Array<{
    value: string | number | boolean
    label: string
    [extra: string]: any
  }>
}

interface InterfaceEnumerationOptionsConfig {
  from: 'interface'
  interface?: InterfaceConfig
  format?: InterfaceEnumerationOptionsKVConfig | InterfaceEnumerationOptionsListConfig
}

interface InterfaceEnumerationOptionsKVConfig {
  type: 'kv'
}

interface InterfaceEnumerationOptionsListConfig {
  type: 'list'
  keyField: string
  labelField: string
}

export default class EnumerationHelper {
  static _instance: EnumerationHelper

  public async options (config: EnumerationOptionsConfig, interfaceRequire: (config: InterfaceConfig, source: any) => Promise<any>) {
    if (config) {
      if (config.from === 'manual') {
        if (config.data) {
          return config.data.map((option) => {
            return {
              value: option.value,
              label: option.label
            }
          })
        }
      } else if (config.from === 'interface') {
        if (config.interface) {
          const data = await interfaceRequire(config.interface, {})
          if (config.format) {
            if (config.format.type === 'kv') {
              return Object.keys(data).map((key) => ({
                value: key,
                label: data[key]
              }))
            } else if (config.format.type === 'list') {
              return data.map((item: any) => {
                if (config.format && config.format.type === 'list') {
                  return ({
                    value: getValue(item, config.format.keyField),
                    label: getValue(item, config.format.labelField)
                  })
                }
              })
            }
          }
        }
      }
    }
    return []
  }

  static async options (config: EnumerationOptionsConfig, interfaceRequire: (config: InterfaceConfig, source: any) => Promise<any>) {
    if (!EnumerationHelper._instance) {
      EnumerationHelper._instance = new EnumerationHelper()
    }
    return await EnumerationHelper._instance.options(config, interfaceRequire)
  }
}