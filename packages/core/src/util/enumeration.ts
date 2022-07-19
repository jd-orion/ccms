import { InterfaceConfig } from './interface'
import { getValue } from './value'
import { ParamConfig } from '../interface'
import ParamHelper from './param'

export type EnumerationOptionsConfig = ManualEnumerationOptionsConfig | InterfaceEnumerationOptionsConfig | DataEnumerationOptionsConfig

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

interface DataEnumerationOptionsConfig {
  from: 'data';
  sourceConfig?: ParamConfig;
  format?:
  | InterfaceEnumerationOptionsKVConfig
  | InterfaceEnumerationOptionsListConfig;
}

export interface InterfaceEnumerationOptionsKVConfig {
  type: 'kv'
}

export interface InterfaceEnumerationOptionsListConfig {
  type: 'list'
  keyField: string
  labelField: string
}

export default class EnumerationHelper {
  static _instance: EnumerationHelper

  optionsDataValue = (sourceConfig: ParamConfig, datas: { record?: object, data: object[], step: { [field: string]: any } }) => {
    if (sourceConfig !== undefined) {
      return ParamHelper(sourceConfig, datas)
    }
    return undefined
  }

  public async options(
    config: EnumerationOptionsConfig,
    interfaceRequire: (config: InterfaceConfig, source: any) => Promise<any>,
    datas: { record?: object, data: object[], step: { [field: string]: any } }
  ): Promise<{ value: any, label: string }[]> {
    if (config) {
      if (config.from === 'manual') {
        if (config.data) {
          return config.data.map((option) => {
            return {
              // TODO: 兼容老版本的表格参数设置为key
              value: option.value || option.key,
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
      } else if (config.from === 'data') {
        if (config.sourceConfig && config.sourceConfig.source) {
          const data = ParamHelper(config.sourceConfig, datas)
          if (config.format) {
            if (config.format.type === 'kv') {
              return Object.keys(data).map((key) => ({
                value: key,
                label: data[key]
              }))
            } else if (config.format.type === 'list') {
              if (Array.isArray(data)) {
                return data.map((item: any) => {
                  return {
                    value: getValue(item, (config.format as InterfaceEnumerationOptionsListConfig).keyField),
                    label: getValue(item, (config.format as InterfaceEnumerationOptionsListConfig).labelField)
                  }
                })
              }
            }
          }
        }
        return []
      }
    }
    return []
  }

  static async options(
    config: EnumerationOptionsConfig,
    interfaceRequire: (config: InterfaceConfig, source: any) => Promise<any>,
    datas: { record?: object, data: object[], step: { [field: string]: any } }
  ) {
    if (!EnumerationHelper._instance) {
      EnumerationHelper._instance = new EnumerationHelper()
    }
    return await EnumerationHelper._instance.options(config, interfaceRequire, datas)
  }
}
