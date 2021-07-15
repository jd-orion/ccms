import { ReactNode } from 'react'
import { APIConfig, ParamConfig } from '../../../interface'
import { request } from '../../../util/request'
import { getParam, getValue, setValue } from '../../../util/value'
import { Field, FieldConfig, IField } from '../common'

export interface SelectFieldConfig extends FieldConfig {
  options?: ManualOptionsConfig | InterfaceOptionsConfig
}

export interface ManualOptionsConfig {
  from: 'manual'
  defaultIndex?: string | number
  data?: Array<{
    value: string | number
    label: string
    [extra: string]: any
  }>
}

export interface InterfaceOptionsConfig {
  from: 'interface'
  api?: APIConfig
  defaultIndex?: string | number
  request?: {
    data?: { [key: string]: ParamConfig }
  }
  response: {
    root?: string
    data?: InterfaceOptionsKVConfig | InterfaceOptionsListConfig
  }
}

export interface InterfaceOptionsKVConfig {
  type: 'kv'
}

export interface InterfaceOptionsListConfig {
  type: 'list'
  keyField: string
  labelField: string
}

export interface ISelectFieldOption {
  value: string | number,
  label: ReactNode,
  children?: Array<ISelectFieldOption>
}

interface SelectSingleFieldState {
  interfaceOptionsData: Array<{
    value: string | number
    label: string
    [extra: string]: any
  }>
}

export default class SelectField<C extends SelectFieldConfig, E, T> extends Field<C, E, T, SelectSingleFieldState> implements IField<T> {
  interfaceOptionsConfig: string = ''
  state: SelectSingleFieldState = {
    interfaceOptionsData: []
  }

  options = (
    config: ManualOptionsConfig | InterfaceOptionsConfig | undefined,
    datas: {
      record?: object
      data: object[]
      step: number
    }
  ) => {
    if (config) {
      if (config.from === 'manual') {
        if (config.data) {
          return config.data.map((option) => {
            return {
              value: option.value.toString(),
              label: option.label
            }
          })
        }
      } else if (config.from === 'interface') {
        if (config.api) {
          const interfaceOptionsParams: { [key: string]: any } = {}
          if (config.request && config.request.data) {
            for (const field in config.request.data) {
              const param = config.request.data[field]
              setValue(interfaceOptionsParams, field, getParam(param, datas))
            }
          }

          const interfaceOptionsConfig: string = JSON.stringify({
            api: config.api,
            params: interfaceOptionsParams
          })

          if (interfaceOptionsConfig !== this.interfaceOptionsConfig) {
            this.interfaceOptionsConfig = interfaceOptionsConfig
            request(config.api, interfaceOptionsParams).then((_response) => {
              if (config.response) {
                const response = getValue(_response, config.response.root || '')
                if (config.response.data) {
                  if (config.response.data.type === 'kv') {
                    this.setState({
                      interfaceOptionsData: Object.keys(response).map((key) => ({
                        value: key,
                        label: response[key]
                      }))
                    })
                  } else if (config.response.data.type === 'list') {
                    this.setState({
                      interfaceOptionsData: response?.map((item: any) => {
                        if (config.response.data?.type === 'list') {
                          return ({
                            value: getValue(item, config.response.data.keyField).toString(),
                            label: getValue(item, config.response.data.labelField)
                          })
                        } else {
                          return {}
                        }
                      })
                    })
                  }
                }
              }
            })
          }
          return this.state.interfaceOptionsData.map((option) => {
            return {
              value: option.value.toString(),
              label: option.label
            }
          })
        }
      }
    }
    return []
  }
}
