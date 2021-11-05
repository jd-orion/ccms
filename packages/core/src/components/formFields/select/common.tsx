import { ReactNode } from 'react'
import InterfaceHelper, { InterfaceConfig } from '../../../util/interface'
import { getValue } from '../../../util/value'
import { Field, FieldConfig, FieldProps, IField } from '../common'

export interface SelectFieldConfig extends FieldConfig {
  options?: ManualOptionsConfig | InterfaceOptionsConfig
}

export interface ManualOptionsConfig {
  from: 'manual'
  defaultIndex?: string | number | boolean
  data?: Array<{
    value: string | number | boolean
    label: string
    [extra: string]: any
  }>
}

export interface InterfaceOptionsConfig {
  from: 'interface'
  interface?: InterfaceConfig
  format?: InterfaceOptionsKVConfig | InterfaceOptionsListConfig
  defaultSelect?: boolean
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
  value: string | number | boolean,
  label: ReactNode,
  children?: Array<ISelectFieldOption>
}

interface SelectSingleFieldState {
  interfaceOptionsData: Array<{
    value: string | number | boolean
    label: string
    [extra: string]: any
  }>
}

export default class SelectField<C extends SelectFieldConfig, E, T> extends Field<C, E, T, SelectSingleFieldState> implements IField<T> {
  interfaceHelper = new InterfaceHelper()
  
  interfaceOptionsConfig: string = ''

  constructor (props: FieldProps<C, T>) {
    super(props)

    this.state = {
      interfaceOptionsData: []
    }
  }

  options = (
    config: ManualOptionsConfig | InterfaceOptionsConfig | undefined
  ) => {
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
          this.interfaceHelper.request(
            config.interface,
            {},
            { record: this.props.record, data: this.props.data, step: this.props.step },
            { loadDomain: this.props.loadDomain }
          ).then((data: any) => {
            if (config.format) {
              if (config.format.type === 'kv') {
                this.setState({
                  interfaceOptionsData: Object.keys(data).map((key) => ({
                    value: key,
                    label: data[key]
                  }))
                })
              } else if (config.format.type === 'list') {
                this.setState({
                  interfaceOptionsData: data.map((item: any) => {
                    if (config.format && config.format.type === 'list') {
                      return ({
                        value: getValue(item, config.format.keyField),
                        label: getValue(item, config.format.labelField)
                      })
                    }
                  })
                })
              }
            }
          })
          return this.state.interfaceOptionsData.map((option) => {
            return {
              value: option.value,
              label: option.label
            }
          })
        }
      }
    }
    return []
  }
}
