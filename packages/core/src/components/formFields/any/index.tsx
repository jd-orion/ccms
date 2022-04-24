
import React, { ReactNode } from 'react'
import { Field, FieldConfig, IField, FieldInterface } from '../common'
import { getChainPath } from '../../../util/value'
import TextField from '../text'
import * as _ from 'lodash'
import NumberField from '../number'
import BooleanField from '../switch'

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
  BooleanField = BooleanField

  handleChangeType = (type: 'null' | 'string' | 'number' | 'boolean') => {
    const {
      value
    } = this.props
    if (type === 'null') {
      this.props.onValueSet('', null, true)
    } else if (type === 'string') {
      this.props.onValueSet('', value?.toString() || '', true)
    } else if (type === 'number') {
      const number = Number(value)
      if (Number.isNaN(number)) {
        this.props.onValueSet('', 0, true)
      } else {
        this.props.onValueSet('', number, true)
      }
    } else if (type === 'boolean') {
      this.props.onValueSet('', !!value, true)
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
          valueContent:
            type === 'string'
              ? <this.TextField
                ref={() => {}}
                form={this.props.form}
                formLayout={'horizontal'}
                value={typeof value === 'string' ? value : ''}
                record={record}
                data={_.cloneDeep(data)}
                step={step}
                config={{ type: 'text', field: '', label: '' }}
                onChange={async (value: string) => { await onChange(value) }}
                onValueSet={this.props.onValueSet}
                onValueUnset={this.props.onValueUnset}
                onValueListAppend={this.props.onValueListAppend}
                onValueListSplice={this.props.onValueListSplice}
                onValueListSort={this.props.onValueListSort}
                baseRoute={this.props.baseRoute}
                loadDomain={this.props.loadDomain}
                containerPath={getChainPath(this.props.containerPath, '')}
                loadPageList={this.props.loadPageList}
              />
              : (
                  type === 'number'
                    ? <this.NumberField
                      ref={() => {}}
                      form={this.props.form}
                      formLayout={'horizontal'}
                      record={record}
                      value={typeof value === 'number' ? value : ''}
                      data={_.cloneDeep(data)}
                      step={step}
                      config={{ type: 'number', field: '', label: '' }}
                      onChange={async (value) => { await onChange(Number(value)) }}
                      onValueSet={async (path, value, validation) => await this.props.onValueSet(path, Number(value), validation)}
                      onValueUnset={this.props.onValueUnset}
                      onValueListAppend={this.props.onValueListAppend}
                      onValueListSplice={this.props.onValueListSplice}
                      onValueListSort={this.props.onValueListSort}
                      baseRoute={this.props.baseRoute}
                      loadDomain={this.props.loadDomain}
                      containerPath={getChainPath(this.props.containerPath, '')}
                      loadPageList={this.props.loadPageList}
                    />
                    : <this.BooleanField
                      ref={() => {}}
                      form={this.props.form}
                      formLayout={'horizontal'}
                      record={record}
                      value={typeof value === 'boolean' ? value : false}
                      data={_.cloneDeep(data)}
                      step={step}
                      config={{ type: 'switch', field: '', label: '' }}
                      onChange={async (value) => { await onChange(Boolean(value)) }}
                      onValueSet={this.props.onValueSet}
                      onValueUnset={this.props.onValueUnset}
                      onValueListAppend={this.props.onValueListAppend}
                      onValueListSplice={this.props.onValueListSplice}
                      onValueListSort={this.props.onValueListSort}
                      baseRoute={this.props.baseRoute}
                      loadDomain={this.props.loadDomain}
                      containerPath={getChainPath(this.props.containerPath, '')}
                      loadPageList={this.props.loadPageList}
                    />)
        })}
      </React.Fragment>
    )
  }
}
