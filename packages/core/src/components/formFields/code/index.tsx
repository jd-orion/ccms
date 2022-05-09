import React, { KeyboardEvent } from 'react'
import { Field, FieldConfig, FieldError, IField } from '../common'
import { getBoolean } from '../../../util/value'

/**
 * code编辑器配置项
 * - codeType: 语言类型
 * - height: 代码编辑器高度
 * - theme: 编辑器主题风格
 * - fullScreen: 是否支持全屏
 * - maxLength: 最大字符长度
 * - minLength: 最小字符长度
 * - cjkLength: 中文占字符数
 * - regExp: 正则校验配置
 */
export interface CodeFieldConfig extends FieldConfig {
  type: 'code'
  codeType: 'xml' | 'json' | 'javascript' | 'java'
  height: number
  theme: 'white' | 'black'
  fullScreen: boolean
  maxLength?: number
  minLength?: number
  cjkLength?: number
  regExp?: { expression: string, message?: string }
}

export interface ICodeField {
  codeType: 'xml' | 'json' | 'javascript' | 'java'
  fullScreenStatus: boolean
  height: number
  theme: 'white' | 'black'
  value: string
  onChange: (value: string) => Promise<void>
}

/**
 * code编辑器配置项
 * - codeType: 语言类型
 * - height: 代码编辑器高度
 * - onResetValue: 编辑器重置为默认值
 * - fullScreen: 是否支持全屏
 * - fullScreenStatus: 编辑器是不是处于全屏状态
 */
export interface ICodeFieldContainer {
  fullScreen: boolean
  fullScreenStatus: boolean
  theme: 'white' | 'black'
  children: React.ReactNode
  onResetValue: (value: string) => Promise<void>
  keydownCallback: (value: KeyboardEvent) => Promise<void>
  enterFull: () => void
  exitFull: () => void
}
interface State {
  fullScreenStatus: boolean // 编辑器是不是处于全屏状态
}
export default class CodeField extends Field<CodeFieldConfig, ICodeField, string> implements IField<string> {
  state:State = {
    fullScreenStatus: false
  }

  reset: () => Promise<string> = async () => {
    const defaults = await this.defaultValue()
    return (defaults === undefined) ? '' : defaults
  }

  validate = async (value: string): Promise<true | FieldError[]> => {
    const {
      config: {
        label,
        required,
        maxLength,
        minLength,
        cjkLength,
        regExp
      }
    } = this.props

    const errors: FieldError[] = []

    if (getBoolean(required)) {
      if (value === '' || value === undefined || value === null || String(value).trim() === '') {
        errors.push(new FieldError(`输入${label}`))
        return errors
      }
    }
    if (maxLength !== undefined) {
      let valueMaxLength = value
      if (cjkLength !== undefined) {
        let valueMaxCJKLength = ''
        for (let valueMaxCJKIndex = 0; valueMaxCJKIndex < cjkLength; valueMaxCJKIndex++) {
          valueMaxCJKLength += '*'
        }
        valueMaxLength = valueMaxLength.replace(/[\u4e00-\u9fa5]/g, valueMaxCJKLength)
      }
      if (valueMaxLength && maxLength >= 0 && valueMaxLength.length > maxLength) {
        errors.push(new FieldError(`最长可输入${maxLength}个字符。`))
      }
    }

    if (minLength !== undefined) {
      let valueMinLength = value
      if (cjkLength !== undefined) {
        let valueMinCJKLength = ''
        for (let valueMinCJKIndex = 0; valueMinCJKIndex < cjkLength; valueMinCJKIndex++) {
          valueMinCJKLength += '*'
        }
        valueMinLength = valueMinLength.replace(/[\u4e00-\u9fa5]/g, valueMinCJKLength)
      }
      if (valueMinLength && minLength >= 0 && valueMinLength.length < minLength) {
        errors.push(new FieldError(`最短需输入${minLength}个字符。`))
      }
    }

    if (regExp !== undefined) {
      if (!(new RegExp(regExp.expression)).test(value)) {
        if (regExp.message) {
          errors.push(new FieldError(regExp.message))
        } else {
          errors.push(new FieldError('格式错误'))
        }
      }
    }

    return errors.length ? errors : true
  }

  keydownCallback = (e: KeyboardEvent) => {
    e.stopPropagation()
    const keyCode = e.keyCode || e.which || e.charCode
    const ctrlKey = e.ctrlKey || e.metaKey
    if (this.props.config.fullScreen) {
      if ((e.key === 'j' || keyCode === 74) && ctrlKey) {
        this.enterFull()
      } else if ((e.key === 'Escape' || keyCode === 27)) {
        this.exitFull()
      }
    }
  }

  enterFull = () => {
    this.setState({ fullScreenStatus: true })
  }

  exitFull = () => {
    this.setState({ fullScreenStatus: false })
  }

  renderContainer = (props: ICodeFieldContainer) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现CodeField的container组件。
      <div style={{ display: 'none' }}>
        <button onClick={() => props.onResetValue('onResetValue')}>onResetValue</button>
      </div>
    </React.Fragment>
  }

  renderComponent = (props: ICodeField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现CodeField组件。
      <div style={{ display: 'none' }}>
        <button onClick={() => props.onChange('onChange')}>onChange</button>
      </div>
    </React.Fragment>
  }

  render = () => {
    const {
      value,
      config: {
        theme,
        fullScreen,
        height,
        codeType
      }
    } = this.props
    const { fullScreenStatus } = this.state

    return (
      <React.Fragment>
        {this.renderContainer({
          fullScreenStatus,
          fullScreen,
          theme,
          onResetValue: async (defaultCodeValue: string) => await this.props.onValueSet('', defaultCodeValue, await this.validate(defaultCodeValue)),
          keydownCallback: async (e: KeyboardEvent) => await this.keydownCallback(e),
          enterFull: this.enterFull,
          exitFull: this.exitFull,
          children: this.renderComponent({
            codeType,
            fullScreenStatus,
            value,
            theme,
            height,
            onChange: async (value: string) => await this.props.onValueSet('', value, await this.validate(value))
          })
        })}
      </React.Fragment>
    )
  }
}
