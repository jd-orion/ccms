import React from 'react'
import { FieldError } from '../../common'
import SelectField, { SelectFieldConfig, ISelectFieldOption } from '../common'
import { getBoolean, getValue, setValue } from '../../../../util/value'

export interface SelectSingleFieldConfig extends SelectFieldConfig {
  type: 'select_single'
  mode?: 'dropdown' | 'radio' | 'button'
  placeholder?: string
  canClear?: boolean
}

export interface ISelectSingleField {
  value: undefined | string | number | boolean
  options: Array<ISelectFieldOption>
  onChange: (value: string | number | boolean) => Promise<void>
  onClear?: () => Promise<void>
  disabled: boolean
  readonly: boolean
  placeholder?: string
}

export default class SelectSingleField<UIState = object> extends SelectField<
  SelectSingleFieldConfig,
  UIState,
  string | number | boolean | { [key: string]: unknown } | undefined
> {
  validate = async (
    _value: string | number | boolean | { [key: string]: unknown } | undefined
  ): Promise<true | FieldError[]> => {
    const {
      config: { label, required }
    } = this.props

    const errors: FieldError[] = []

    if (getBoolean(required)) {
      if (_value === '' || _value === undefined || (_value && _value.toString().length === 0)) {
        errors.push(new FieldError(`请选择${label}`))
      }
    }

    return errors.length ? errors : true
  }

  get = async () => {
    const {
      value,
      config: { moreSubmit }
    } = this.props
    if (moreSubmit && moreSubmit.valueField) {
      let result = {}

      const currentValue = getValue(value, moreSubmit.valueField)
      result = setValue(result, moreSubmit.valueField, currentValue) as { [key: string]: unknown }

      const options = this.options(this.props.config.options)
      const option = options.find((currentOption) => currentOption.value === currentValue)

      if (option) {
        if (moreSubmit.labelField) {
          result = setValue(result, moreSubmit.labelField, option.label) as { [key: string]: unknown }
        }
        if (option.extra) {
          result = setValue(result, '', option.extra) as { [key: string]: unknown }
        }
      }

      return result
    }
    return value
  }

  renderDorpdownComponent: (props: ISelectSingleField) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现SelectSingleField组件的SelectSingle模式。</>
  }

  renderRadioComponent: (props: ISelectSingleField) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现SelectSingleField组件的Radio模式。</>
  }

  renderButtonComponent: (props: ISelectSingleField) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现SelectSingleField组件的Button模式。</>
  }

  handleChange = async (valueChange, options) => {
    const {
      config: { moreSubmit }
    } = this.props
    if (moreSubmit && moreSubmit.valueField) {
      let value: { [key: string]: unknown } = setValue({}, moreSubmit.valueField, valueChange) as {
        [key: string]: unknown
      }

      const option = options.find((currentOption) => currentOption.value === valueChange)
      if (option) {
        if (moreSubmit.labelField) {
          value = setValue(value, moreSubmit.labelField, option.label) as { [key: string]: unknown }
        }
        if (option.extra) {
          value = setValue(value, '', option.extra) as { [key: string]: unknown }
        }
      }

      await this.props.onValueSet('', value, await this.validate(value))
    } else {
      await this.props.onValueSet('', valueChange, await this.validate(valueChange))
    }
  }

  render = () => {
    const {
      value,
      config: {
        mode = 'dropdown',
        options: optionsConfig,
        defaultSelect,
        disabled,
        readonly,
        placeholder,
        moreSubmit,
        canClear
      }
    } = this.props

    const options = this.options(optionsConfig)

    const props: ISelectSingleField = {
      value: undefined,
      options,
      onChange: async (valueChange) => this.handleChange(valueChange, options),
      onClear: canClear
        ? async () => {
            await this.props.onValueSet('', undefined, await this.validate(undefined))
          }
        : undefined,
      disabled: getBoolean(disabled),
      readonly: getBoolean(readonly),
      placeholder
    }

    let currentValue = value
    if (moreSubmit && moreSubmit.valueField && typeof value === 'object') {
      currentValue = getValue(value, moreSubmit.valueField)
    }
    if (currentValue === undefined) {
      if (defaultSelect !== undefined && defaultSelect !== false && props.options.length) {
        currentValue = props.options[defaultSelect === true || defaultSelect < 0 ? 0 : defaultSelect]?.value
        this.handleChange(currentValue, options)
      }
    } else if (
      !(typeof currentValue === 'string' || typeof currentValue === 'number' || typeof currentValue === 'boolean') ||
      !props.options.map((option) => option.value).includes(currentValue)
    ) {
      currentValue = undefined
    }

    props.value = currentValue

    if (mode === 'radio') {
      return this.renderRadioComponent(props)
    }
    if (mode === 'button') {
      return this.renderButtonComponent(props)
    }
    return this.renderDorpdownComponent(props)
  }
}
