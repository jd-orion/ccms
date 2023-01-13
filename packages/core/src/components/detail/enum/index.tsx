import React from 'react'
import { DetailField, DetailFieldConfig, IDetailField } from '../common'
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
    [extra: string]: unknown
  }[]
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

export default class EnumDetail
  extends DetailField<EnumDetailConfig, IEnumProps, unknown>
  implements IDetailField<unknown>
{
  interfaceHelper = new InterfaceHelper()

  reset: () => Promise<string> = async () => {
    const defaults = await this.defaultValue()
    return defaults === undefined ? '/' : defaults
  }

  state = {
    value: ''
  }

  renderComponent: (props: IEnumProps) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现EnumDetail组件。</>
  }

  componentDidMount() {
    this.getValue()
  }

  getValue = async () => {
    const {
      value,
      config: { multiple, options, defaultValue }
    } = this.props

    if (value === '' || value === undefined) {
      if (typeof defaultValue === 'string') {
        return this.setState({
          value: defaultValue
        })
      }
      return this.setState({
        value: await this.reset()
      })
    }

    let theValue = value
    if (!Array.isArray(theValue)) {
      if (typeof theValue !== 'string') {
        theValue = (theValue as object).toString()
      }
      if (multiple && typeof multiple !== 'boolean' && multiple.type === 'split' && multiple.split) {
        theValue = (theValue as string).split(multiple.split)
      } else {
        theValue = (theValue as string).split(',')
      }
    }
    if (options && options.from === 'manual') {
      if (options.data) {
        if (multiple === undefined || multiple === false) {
          const option = options.data.find((currentOption) => currentOption.value === value)
          this.setState({
            value: option ? option.label : (value as object).toString()
          })
        } else if (multiple === true || multiple.type) {
          if (Array.isArray(theValue)) {
            this.setState({
              value: theValue
                .map((item) => {
                  const option = options.data.find((currentOption) => {
                    return currentOption.value === Number(item)
                  })
                  return option ? option.label : item.toString()
                })
                .join(',')
            })
          } else {
            this.setState({
              value: '-'
            })
          }
        }
      } else {
        this.setState({
          value
        })
      }
    } else if (options && options.from === 'interface') {
      if (options.interface) {
        this.interfaceHelper
          .request(
            options.interface,
            {},
            {
              record: this.props.record,
              data: this.props.data,
              step: this.props.step,
              containerPath: this.props.containerPath
            },
            { loadDomain: this.props.loadDomain }
          )
          .then((data) => {
            if (options.format) {
              type OptionItem = { value: string; label: string }
              let tempOptions: Array<OptionItem> = []
              if (options.format.type === 'kv') {
                tempOptions = Object.keys(data as object).map((key) => ({
                  value: key,
                  label: (data as object)[key]
                }))
                this.setState({
                  value: (theValue as OptionItem[])
                    .map((item: OptionItem) => {
                      const option = tempOptions.find((currentOption) => {
                        return currentOption.value === String(item)
                      })
                      return option ? option.label : item.toString()
                    })
                    .join(',')
                })
              } else if (options.format.type === 'list') {
                tempOptions = ((data as unknown[]) || []).map((item: unknown) => {
                  if (options.format && options.format.type === 'list') {
                    return {
                      value: getValue(item, options.format.keyField),
                      label: getValue(item, options.format.labelField)
                    }
                  }
                  return item as { value: unknown; label: unknown }
                })
                this.setState({
                  value: (theValue as OptionItem[])
                    .map((item: OptionItem) => {
                      const option = tempOptions.find((currentOption) => {
                        return currentOption.value === String(item)
                      })
                      return option ? option.label : item.toString()
                    })
                    .join(',')
                })
              }
            }
          })
      } else {
        return value
      }
    } else {
      return value
    }
  }

  render = () => {
    // const value = this.getValue()
    const { value } = this.state
    return (
      <>
        {this.renderComponent({
          value
        })}
      </>
    )
  }
}
