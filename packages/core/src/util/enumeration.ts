import { get } from 'lodash'
import { InterfaceConfig } from './interface'
import { getValue } from './value'
import { ParamConfig } from '../interface'
import ParamHelper from './param'
import { set } from './produce'
import ConditionHelper, { ConditionConfig } from './condition'

export type EnumerationOptionsConfig =
  | ManualEnumerationOptionsConfig
  | InterfaceEnumerationOptionsConfig
  | DataEnumerationOptionsConfig

interface ManualEnumerationOptionsConfig {
  from: 'manual'
  data?: Array<{
    value: string | number | boolean
    label: string
    extra?: {
      field: string
      value: unknown
    }[]
    disabled?: ConditionConfig
  }>
}

interface InterfaceEnumerationOptionsConfig {
  from: 'interface'
  interface?: InterfaceConfig
  format?: InterfaceEnumerationOptionsKVConfig | InterfaceEnumerationOptionsListConfig
}

interface DataEnumerationOptionsConfig {
  from: 'data'
  sourceConfig?: ParamConfig
  format?: InterfaceEnumerationOptionsKVConfig | InterfaceEnumerationOptionsListConfig
}

export interface InterfaceEnumerationOptionsKVConfig {
  type: 'kv'
}

export interface InterfaceEnumerationOptionsListConfig {
  type: 'list'
  keyField: string
  labelField: string
  extra?: [
    {
      sourceField: string
      targetField: string
    }
  ]
}

export default class EnumerationHelper {
  static _instance: EnumerationHelper

  optionsDataValue = (
    sourceConfig: ParamConfig,
    datas: {
      record: { [field: string]: unknown }
      data: object[]
      step: { [field: string]: unknown }
      containerPath: string
    }
  ) => {
    if (sourceConfig !== undefined) {
      return ParamHelper(sourceConfig, datas)
    }
    return undefined
  }

  public async options(
    config: EnumerationOptionsConfig,
    interfaceRequire: (interfaceConfig: InterfaceConfig, source: { [key: string]: unknown }) => Promise<unknown>,
    datas: {
      record: { [field: string]: unknown }
      data: object[]
      step: { [field: string]: unknown }
      containerPath: string
    }
  ): Promise<{ value: unknown; label: string; extra?: { [key: string]: unknown }; disabled: boolean }[]> {
    if (config) {
      if (config.from === 'manual') {
        if (config.data) {
          return config.data.map((option) => {
            const { value, label, extra, disabled } = option
            const result: { value: unknown; label: string; extra?: { [key: string]: unknown }; disabled: boolean } = {
              value,
              label,
              disabled: false
            }
            if (extra) {
              result.extra = {}
              for (const { field: extraField, value: extraValue } of extra || []) {
                result.extra[extraField] = extraValue
              }
            }
            if (disabled) {
              result.disabled = ConditionHelper(disabled, datas)
            }
            return result
          })
        }
      } else if (config.from === 'interface') {
        if (config.interface) {
          const data = await interfaceRequire(config.interface, {})
          if (config.format) {
            if (config.format.type === 'kv') {
              return Object.keys(data as object).map((key) => ({
                value: key,
                label: (data as object)[key],
                disabled: false
              }))
            }
            if (config.format.type === 'list') {
              return ((data as unknown[]) || []).map((item: unknown) => {
                const formatConfig = config.format as InterfaceEnumerationOptionsListConfig
                let extra = {}
                if (formatConfig.extra) {
                  for (let extraIndex = 0; extraIndex < formatConfig.extra.length; extraIndex++) {
                    const extraConfig = formatConfig.extra[extraIndex]
                    extra = set(extra, extraConfig.targetField, get(item, extraConfig.sourceField)) as {
                      [key: string]: unknown
                    }
                  }
                }
                return {
                  value: getValue(item, formatConfig.keyField),
                  label: getValue(item, formatConfig.labelField),
                  extra,
                  disabled: false
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
                label: data[key],
                disabled: false
              }))
            }
            if (config.format.type === 'list') {
              if (Array.isArray(data)) {
                return data.map((item: unknown) => {
                  const formatConfig = config.format as InterfaceEnumerationOptionsListConfig
                  let extra = {}
                  if (formatConfig.extra) {
                    for (let extraIndex = 0; extraIndex < formatConfig.extra.length; extraIndex++) {
                      const extraConfig = formatConfig.extra[extraIndex]
                      extra = set(extra, extraConfig.targetField, get(item, extraConfig.sourceField)) as {
                        [key: string]: unknown
                      }
                    }
                  }
                  return {
                    value: getValue(item, formatConfig.keyField),
                    label: getValue(item, formatConfig.labelField),
                    extra,
                    disabled: false
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
    interfaceRequire: (interfaceConfig: InterfaceConfig, source: { [key: string]: unknown }) => Promise<unknown>,
    datas: {
      record: { [field: string]: unknown }
      data: object[]
      step: { [field: string]: unknown }
      containerPath: string
    }
  ) {
    if (!EnumerationHelper._instance) {
      EnumerationHelper._instance = new EnumerationHelper()
    }
    return EnumerationHelper._instance.options(config, interfaceRequire, datas)
  }
}
