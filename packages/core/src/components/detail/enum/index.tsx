import React from 'react'
import { DetailField, DetailFieldProps, DetailFieldConfig, IDetailField } from '../common'
import InterfaceHelper, { InterfaceConfig } from '../../../util/interface'
import { getValue } from '../../../util/value'

export interface EnumDetailConfig extends DetailFieldConfig {
  type: 'detail_enum'
  multiple: boolean | ArrayMultipleConfig | SplitMultipleConfig
  options: ManualOptionsConfig | InterfaceOptionsConfig
}

interface ArrayMultipleConfig {
  type: 'array'
}

interface SplitMultipleConfig {
  type: 'split'
  split: string
}

interface ManualOptionsConfig {
  from: 'manual'
  data: {
    key: string | number | boolean
    label: string
    [extra: string]: any
  }[],
  getKey?: string
  getValue?: string
}

export interface InterfaceOptionsConfig {
  from: 'interface'
  interface?: InterfaceConfig
  format?: InterfaceOptionsListConfig | InterfaceOptionKVConfig
}

export interface InterfaceOptionKVConfig {
  type: 'kv'
}
export interface InterfaceOptionsListConfig {
  type: 'list'
  keyField: string
  labelField: string
}


export interface IEnumProps {
  value?: string | string[]
}

export default class EnumDetail extends DetailField<EnumDetailConfig, IEnumProps, any> implements IDetailField<string> {
  interfaceHelper = new InterfaceHelper()

  reset: () => Promise<string> = async () => {
    const defaults = await this.defaultValue()
    return (defaults === undefined) ? '/' : defaults
  }

  state = {
    value: ''
  }

  constructor(props: DetailFieldProps<EnumDetailConfig, string>) {
    super(props)
  }

  renderComponent = (props: IEnumProps) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现EnumDetail组件。
    </React.Fragment>
  }

  componentDidMount() {
    this.getValue()
  }

  getValue = async () => {
    const {
      value,
      config: {
        multiple,
        options,
        defaultValue
      }
    } = this.props

    if (value === '' || value === undefined) {
      if (typeof defaultValue === 'string') {
        return this.setState({
          value: defaultValue
        })
      } else {
        return this.setState({
          value: await this.reset()
        })
      }
    }

    let theValue = value
    if (Object.prototype.toString.call(theValue) !== "[object Array]") {
      if (typeof theValue !== 'string') { theValue = theValue?.toString() }
      if (multiple && typeof multiple !== 'boolean' && multiple.type === 'split' && multiple.split) {
        theValue = theValue?.split(multiple.split)
      } else {
        theValue = theValue?.split(',')
      }
    }
    if (options && options.from === 'manual') {
      if (options.data) {
        if (multiple === undefined || multiple === false) {
          const option = options.data.find((option) => option.value === value)
          this.setState({
            value: option ? option.label : value.toString()
          })
        } else if (multiple === true || multiple.type) {
          if (Array.isArray(theValue)) {
            this.setState({
              value: theValue.map((item) => {
                const option = options.data.find((option) => {
                  return option.value === Number(item)
                })
                return option ? option.label : item.toString()
              }).join(',')
            })
          } else {
            this.setState({
              value: '-'
            })
          }
        }
      } else {
        this.setState({
          value: value
        })
      }
    } else if (options && options.from === 'interface') {
      if (options.interface) {
        this.interfaceHelper.request(
          options.interface,
          {},
          { record: this.props.record, data: this.props.data, step: this.props.step },
          { loadDomain: this.props.loadDomain }
        ).then((data) => {

          if (options.format) {
            type OptionItem = { value: string, label: string }
            let tempOptions: Array<OptionItem> = []
            if (options.format.type === 'kv') {
              tempOptions = Object.keys(data).map((key) => ({
                value: key,
                label: data[key]
              }))
              this.setState({
                value: theValue.map((item: OptionItem) => {
                  const option = tempOptions.find((option) => {
                    return option.value === String(item)
                  })
                  return option ? option.label : item.toString()
                }).join(',')
              })
            } else if (options.format.type === 'list') {
              tempOptions = data.map((item: any) => {
                if (options.format && options.format.type === 'list') {
                  return ({
                    value: getValue(item, options.format.keyField),
                    label: getValue(item, options.format.labelField)
                  })
                }
              })
              this.setState({
                value: theValue.map((item: OptionItem) => {
                  const option = tempOptions.find((option) => {
                    return option.value === String(item)
                  })
                  return option ? option.label : item.toString()
                }).join(',')
              })
            }
          }
        })
      } else {
        return value
      }
    }
    else {
      return value
    }
  }

  render = () => {
    // const value = this.getValue()
    const { value } = this.state
    return (
      <React.Fragment>
        {this.renderComponent({
          value
        })}
      </React.Fragment>
    )
  }
}
