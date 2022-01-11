import React from 'react'
import { FieldError } from '../../common'
import SelectField, { SelectFieldConfig, ISelectFieldOption } from '../common'
import { getBoolean } from '../../../../util/value'

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

export default class SelectSingleField extends SelectField<SelectSingleFieldConfig, {}, string | number | boolean | undefined> {
  // reset = async () => {
  //   const defaults = await this.defaultValue()

  //   if (defaults === undefined) {
  //     const {
  //       config: {
  //         options
  //       }
  //     } = this.props

  //     if (options && options.from === 'interface' && options.interface) {
  //       const response = await this.interfaceHelper.request(options.interface, { record: this.props.record, data: this.props.data, step: this.props.step })

  //       if (options.format?.type === 'kv') {
  //         interfaceOptionsData = Object.keys(response).map((key) => ({
  //           value: key,
  //           label: response[key]
  //         }))
  //       } else if (options.response.data?.type === 'list') {
  //         interfaceOptionsData = response.map((item: any) => {
  //           if (options.response.data?.type === 'list') {
  //             return ({
  //               value: getValue(item, options.response.data.keyField),
  //               label: getValue(item, options.response.data.labelField)
  //             })
  //           }
  //           return {}
  //         })
  //       }
  //       return options.defaultIndex === undefined ? undefined : interfaceOptionsData[options.defaultIndex || 0].value
  //     }
  //     return undefined
  //   } else {
  //     if (typeof defaults === 'string' || typeof defaults === 'number') {
  //       return defaults
  //     } else {
  //       console.warn('单项选择框的值需要是字符串或数值。')
  //       return undefined
  //     }
  //   }
  // }

  validate = async (_value: string | number | boolean | undefined): Promise<true | FieldError[]> => {
    const {
      config: {
        label,
        required
      }
    } = this.props

    const errors: FieldError[] = []

    if (getBoolean(required)) {
      if (_value === '' || _value === undefined || (_value && _value.toString().length === 0)) {
        errors.push(new FieldError(`请选择${label}`))
      }
    }

    return errors.length ? errors : true
  }

  renderDorpdownComponent = (props: ISelectSingleField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现SelectSingleField组件的SelectSingle模式。
      <div style={{ display: 'none' }}>
        <button onClick={() => props.onChange('onChange')}>onChange</button>
      </div>
    </React.Fragment>
  }

  renderRadioComponent = (props: ISelectSingleField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现SelectSingleField组件的Radio模式。
      <div style={{ display: 'none' }}>
        <button onClick={() => props.onChange('onChange')}>onChange</button>
      </div>
    </React.Fragment>
  }

  renderButtonComponent = (props: ISelectSingleField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现SelectSingleField组件的Button模式。
      <div style={{ display: 'none' }}>
        <button onClick={() => props.onChange('onChange')}>onChange</button>
      </div>
    </React.Fragment>
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
        placeholder
      }
    } = this.props

    const props: ISelectSingleField = {
      value: undefined,
      options: this.options(optionsConfig),
      onChange: async (value) => { await this.props.onValueSet('', value, await this.validate(value)) },
      onClear: this.props.config.canClear ? async () => { await this.props.onValueSet('', undefined, await this.validate(undefined)) } : undefined,
      disabled: getBoolean(disabled),
      readonly: getBoolean(readonly),
      placeholder
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      if (props.options.map((option) => option.value).includes(value)) {
        props.value = value
      } else {
        console.warn(`选择框的当前值${value}不在选项中。`)
        props.value = undefined
      }
    } else if (value !== undefined) {
      props.value = undefined
      console.warn('单项选择框的值需要是字符串或数值。')
    } else if (value === undefined) {
      if (defaultSelect !== undefined && defaultSelect !== false && props.options.length) {
        (async () => {
          const value = props.options[defaultSelect === true ? 0 : defaultSelect].value
          props.value = value
          this.props.onValueSet('', value, await this.validate(value))
        })()
      }
    }

    if (mode === 'radio') {
      return this.renderRadioComponent(props)
    } else if (mode === 'button') {
      return this.renderButtonComponent(props)
    } else {
      return this.renderDorpdownComponent(props)
    }
  }
}
