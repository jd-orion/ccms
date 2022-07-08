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

export default class EnumColumn extends Column<EnumColumnConfig, IEnumColumn, any, EnumColumnState> {
  interfaceHelper = new InterfaceHelper()

  renderComponent = (props: IEnumColumn) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现EnumColumn组件。
    </React.Fragment>
  }

  getValue = () => {
    const {
      value,
      config: {
        multiple,
        options,
        defaultValue
      }
    } = this.props

    if (value === '' || value === undefined) return defaultValue

    let theValue = value
    if (Object.prototype.toString.call(theValue) !== "[object Array]") {
      if (typeof theValue !== 'string') { theValue = theValue?.toString() }
      if (multiple && typeof multiple !== 'boolean' && multiple.type === 'split' && multiple.split) {
        theValue = theValue?.split(multiple.split)
      } else {
        theValue = theValue?.split(',')
      }
    }

    if (options) {
      EnumerationHelper.options(
        options,
        (config, source) => this.interfaceHelper.request(config, source, { record: this.props.record, data: this.props.data, step: this.props.step }, { loadDomain: this.props.loadDomain }),
        { record: this.props.record, data: this.props.data, step: this.props.step }
      ).then((options) => {
        if (multiple === undefined || multiple === false) {
          const option = options.find((option) => option.value === value)
          const label = option ? option.label : value.toString()
          if (label !== this.state.value) {
            this.setState({ value: label })
          }
        } else if (multiple === true || multiple.type) {
          if (Array.isArray(theValue)) {
            const label = theValue.map((item) => {
              const option = options.find((option) => {
                return option.value === item
              })
              return option ? option.label : item.toString()
            }).join(',')
            if (JSON.stringify(label) !== JSON.stringify(this.state.value)) {
              this.setState({
                value: label
              })
            }
          } else {
            if ('-' !== this.state.value) {
              this.setState({ value: '-' })
            }
          }
        }
      })
    }
  }

  render = () => {
    this.getValue()

    return (
      <React.Fragment>
        {this.renderComponent({ value: this.state.value })}
      </React.Fragment>
    )
  }
}
