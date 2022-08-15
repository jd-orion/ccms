import React from 'react'
import EnumerationHelper, { EnumerationOptionsConfig } from '../../../util/enumeration'
import InterfaceHelper from '../../../util/interface'
import Column, { ColumnConfig } from '../common'

export interface EnumColumnConfig extends ColumnConfig {
  type: 'Aenum'
  valueType?: 'string' | 'number' | 'boolean'
  multiple: boolean | ArrayMultipleConfig | SplitMultipleConfig
  options: EnumerationOptionsConfig
}

interface ArrayMultipleConfig {
  type: 'array'
}

interface SplitMultipleConfig {
  type: 'split'
  split: string
}

export interface IEnumColumn {
  value: string | string[]
}

interface EnumColumnState {
  value: string | string[]
}

export default class EnumColumn extends Column<EnumColumnConfig, IEnumColumn, unknown, EnumColumnState> {
  interfaceHelper = new InterfaceHelper()

  renderComponent: (props: IEnumColumn) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现EnumColumn组件。</>
  }

  getValue = () => {
    const {
      value,
      config: { multiple, options, defaultValue }
    } = this.props

    if (value === '' || value === undefined) return defaultValue

    let theValue = value
    if (!Array.isArray(theValue)) {
      if (typeof theValue !== 'string') {
        theValue = (theValue as string)?.toString()
      }
      if (multiple && typeof multiple !== 'boolean' && multiple.type === 'split' && multiple.split) {
        theValue = (theValue as string)?.split(multiple.split)
      } else {
        theValue = (theValue as string)?.split(',')
      }
    }

    if (options) {
      // TODO: 兼容1.3.0以下老版本的表格option.data下的值为key
      if (options.from === 'manual' && options.data) {
        options.data.forEach((option: any) => {
          if (option.key && option.value === undefined) {
            // eslint-disable-next-line no-param-reassign
            option.value = option.key
          }
        })
      }

      EnumerationHelper.options(
        options,
        (config, source) =>
          this.interfaceHelper.request(
            config,
            source,
            { record: this.props.record, data: this.props.data, step: this.props.step, containerPath: '' },
            { loadDomain: this.props.loadDomain }
          ),
        { record: this.props.record, data: this.props.data, step: this.props.step, containerPath: '' }
      ).then((currentOptions) => {
        if (multiple === undefined || multiple === false) {
          const option = currentOptions.find((option: any) => option.value === value)
          const label = option ? option.label : (value as string).toString()
          if (label !== this.state.value) {
            this.setState({ value: label })
          }
        } else if (multiple === true || multiple.type) {
          if (Array.isArray(theValue)) {
            const label = theValue
              .map((item) => {
                const option = currentOptions.find((currentOption) => {
                  return currentOption.value === item
                })
                return option ? option.label : item.toString()
              })
              .join(',')
            if (JSON.stringify(label) !== JSON.stringify(this.state.value)) {
              this.setState({
                value: label
              })
            }
          } else if (this.state.value !== '-') {
            this.setState({ value: '-' })
          }
        }
      })
    }
  }

  render = () => {
    this.getValue()

    return <>{this.renderComponent({ value: this.state.value })}</>
  }
}
