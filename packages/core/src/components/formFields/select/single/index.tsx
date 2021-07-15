import React from 'react'
import { FieldError } from '../../common'
import SelectField, { SelectFieldConfig, ISelectFieldOption } from '../common'
import { request } from '../../../../util/request'
import { getBoolean, getValue } from '../../../../util/value'

export interface SelectSingleFieldConfig extends SelectFieldConfig {
  type: 'select_single'
  mode?: 'dropdown' | 'radio' | 'button'

}

export interface ISelectSingleField {
  value: undefined | string | number
  options: Array<ISelectFieldOption>
  onChange: (value: string | number) => Promise<void>
  disabled: boolean
}

export default class SelectSingleField extends SelectField<SelectSingleFieldConfig, {}, string | number | undefined> {
  reset = async () => {
    const defaults = await this.defaultValue()

    if (defaults === undefined) {
      const {
        config: {
          options
        }
      } = this.props

      if (options && options.from === 'interface' && options.api) {
        let interfaceOptionsData: any = []
        await request(options.api, {}).then((_response: any) => {
          if (options.response) {
            const response = getValue(_response, options.response.root || '')
            if (options.response.data) {
              if (options.response.data.type === 'kv') {
                interfaceOptionsData = Object.keys(response).map((key) => ({
                  value: key,
                  label: response[key]
                }))
              } else if (options.response.data?.type === 'list') {
                interfaceOptionsData = response.map((item: any) => {
                  if (options.response.data?.type === 'list') {
                    return ({
                      value: getValue(item, options.response.data.keyField),
                      label: getValue(item, options.response.data.labelField)
                    })
                  }
                  return {}
                })
              }
            }
          }
        })
        return options.defaultIndex === undefined ? undefined : interfaceOptionsData[options.defaultIndex || 0].value
      }
      return undefined
    } else {
      if (typeof defaults === 'string' || typeof defaults === 'number') {
        return defaults
      } else {
        console.warn('单项选择框的值需要是字符串或数值。')
        return undefined
      }
    }
  }

  validate = async (_value: string | number | undefined): Promise<true | FieldError[]> => {
    const {
      config: {
        required
      }
    } = this.props

    const errors: FieldError[] = []

    if (getBoolean(required)) {
      if (_value === '' || _value === undefined) {
        errors.push(new FieldError('不能为空'))
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
        disabled
      },
      onChange,
      record,
      data,
      step
    } = this.props

    const props: ISelectSingleField = {
      value: undefined,
      options: this.options(optionsConfig, { record, data, step }),
      onChange: async (value) => { await onChange(value) },
      disabled: getBoolean(disabled)
    }

    if (typeof value === 'string' || typeof value === 'number') {
      if (props.options.map((option) => option.value).includes(value.toString())) {
        props.value = value.toString()
      } else {
        console.warn(`选择框的当前值${value}不在选项中。`)
        props.value = undefined
      }
    } else if (value !== undefined) {
      props.value = undefined
      console.warn('单项选择框的值需要是字符串或数值。')
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
