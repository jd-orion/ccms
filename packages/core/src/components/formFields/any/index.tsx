
import React, { ReactNode } from 'react'
import { Field, FieldConfig, IField, FieldInterface } from '../common'
import TextField from '../text'
import * as _ from 'lodash'
import NumberField from '../number'

export interface AnyFieldConfig extends FieldConfig, FieldInterface {
  type: 'any'
}

export interface IAnyField {
  type: 'null' | 'string' | 'number' | 'boolean'
  value: null | string | number | boolean
  typeContent: ReactNode
  valueContent: ReactNode
}

export interface IAnyTypeField {
  type: 'null' | 'string' | 'number' | 'boolean'
  onChange: (type: 'null' | 'string' | 'number' | 'boolean') => void
}

export default class AnyField extends Field<AnyFieldConfig, IAnyField, null | string | number | boolean> implements IField<null | string | number | boolean> {
  TextField = TextField
  NumberField = NumberField

  handleChangeType = (type: 'null' | 'string' | 'number' | 'boolean') => {
    const {
      value,
      onChange
    } = this.props
    if (type === 'null') {
      onChange(null)
    } else if (type === 'string') {
      onChange(value?.toString() || '')
    } else if (type === 'number') {
      const number = Number(value)
      if (Number.isNaN(number)) {
        onChange(0)
      } else {
        onChange(number)
      }
    } else if (type === 'boolean') {
      onChange(!!value)
    }
  }

  renderTypeComponent = (props: IAnyTypeField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现AnyField组件的TypeComponent。
    </React.Fragment>
  }

  renderComponent = (props: IAnyField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现AnyField组件。
    </React.Fragment>
  }

  render = () => {
    const {
      value,
      record,
      data,
      step,
      onChange
    } = this.props

    const type = typeof value

    return (
      <React.Fragment>
        {this.renderComponent({
          type: type === 'string' || type === 'number' || type === 'boolean' ? type : 'null',
          value,
          typeContent: this.renderTypeComponent({
            type: type === 'string' || type === 'number' || type === 'boolean' ? type : 'null',
            onChange: (type) => this.handleChangeType(type)
          }),
          valueContent: type === 'string' ? <this.TextField
            ref={() => {}}
            formLayout={'horizontal'}
            value={typeof value === 'string' ? value : ''}
            record={record}
            data={_.cloneDeep(data)}
            step={step}
            config={{ type: 'text', field: '', label: '' }}
            onChange={async (value: string) => { await onChange(value) }}
          /> : (
            type === 'number' ? <this.NumberField
              ref={() => {}}
              formLayout={'horizontal'}
              record={record}
              value={typeof value === 'number' ? value : ''}
              data={_.cloneDeep(data)}
              step={step}
              config={{ type: 'number', field: '', label: '' }}
              onChange={async (value) => { await onChange(Number(value)) }}
            /> : null
          )
        })}
      </React.Fragment>
    )
  }
}
