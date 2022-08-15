import React from 'react'
import { getBoolean, transformValueType } from '../../../../util/value'
import { FieldError } from '../../common'
import SelectField, { ISelectFieldOption, SelectFieldConfig } from '../common'

export interface SelectMultipleFieldConfig extends SelectFieldConfig {
  type: 'select_multiple'
  mode?: 'dropdown' | 'checkbox'
  multiple?: true | SelectMultipleArrayConfig | SelectMultipleSplitConfig
  placeholder?: string
  canClear?: boolean
}

interface SelectMultipleArrayConfig {
  type: 'array'
}

interface SelectMultipleSplitConfig {
  type: 'split'
  split?: string
  valueType?: 'string' | 'number' | 'boolean' | undefined
}

export interface ISelectMultipleField {
  value: undefined | Array<string | number>
  options: Array<ISelectFieldOption>
  onChange: (value: Array<string | number>) => Promise<void>
  onClear?: () => Promise<void>
  disabled: boolean
  readonly: boolean
  placeholder?: string
}

export default class SelectMultipleField extends SelectField<
  SelectMultipleFieldConfig,
  unknown,
  string | Array<string | number> | undefined
> {
  reset = async () => {
    const {
      config: { multiple }
    } = this.props

    const defaults = await this.defaultValue()

    if (defaults === undefined) {
      if (multiple === true || multiple?.type === 'array') {
        return []
      }
      if (multiple?.type === 'split') {
        return ''
      }
      return undefined
    }
    if (multiple === true || multiple?.type === 'array') {
      if (Array.isArray(defaults)) {
        return defaults.filter((v) => typeof v === 'string' || typeof v === 'number')
      }
      return []
    }
    if (multiple?.type === 'split') {
      return String(defaults)
    }
    return defaults
  }

  validate = async (_value: string | Array<string | number> | undefined): Promise<true | FieldError[]> => {
    const {
      config: { label, required }
    } = this.props

    const errors: FieldError[] = []

    if (getBoolean(required)) {
      if (_value === '' || _value === undefined || (_value && _value.length === 0)) {
        errors.push(new FieldError(`请选择${label}`))
      }
    }

    return errors.length ? errors : true
  }

  renderDorpdownComponent: (props: ISelectMultipleField) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现SelectMultipleField组件的SelectMultiple模式。</>
  }

  renderCheckboxComponent: (props: ISelectMultipleField) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现SelectMultipleField组件的Checkbox模式。</>
  }

  render = () => {
    const {
      value,
      config: { mode = 'dropdown', multiple, options: optionsConfig, disabled, readonly, placeholder }
    } = this.props

    const props: ISelectMultipleField = {
      value: undefined,
      options: this.options(optionsConfig),
      onChange: async (valueChange: string | Array<string | number> | undefined) => {
        let useV = valueChange
        if (Array.isArray(useV) && multiple !== true && multiple?.type === 'split') {
          useV = useV.join(multiple.split || ',')
        }
        return this.props.onValueSet('', useV, await this.validate(useV))
      },
      onClear: this.props.config.canClear
        ? async () => {
            await this.props.onValueSet('', undefined, await this.validate(undefined))
          }
        : undefined,
      disabled: getBoolean(disabled),
      readonly: getBoolean(readonly),
      placeholder
    }

    if (multiple === true || multiple?.type === 'array') {
      if (Array.isArray(value)) {
        props.value = value as Array<string | number>
      } else if (value !== undefined) {
        props.value = undefined
      }
    } else if (multiple?.type === 'split') {
      if (typeof value === 'string' && value !== '') {
        props.value = transformValueType(String(value).split(multiple.split || ','), multiple?.valueType) as (
          | string
          | number
        )[]
      } else if (value !== undefined) {
        props.value = undefined
      }
    } else {
      props.value = Array.isArray(value) ? value : undefined
    }

    if (props.value !== undefined) {
      const values = props.options.map((option) => option.value)
      props.value.filter((v) => {
        if (values.includes(v)) {
          return true
        }
        return false
      })
    }

    if (mode === 'checkbox') {
      return this.renderCheckboxComponent(props)
    }
    return this.renderDorpdownComponent(props)
  }
}
