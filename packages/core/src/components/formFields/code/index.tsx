import React, { KeyboardEvent } from 'react'
import { Field, FieldConfig, FieldError, IField } from '../common'
import { getBoolean } from '../../../util/value'

/**
 * code编辑器配置项
 * - codeType: 语言类型
 * - height: 代码编辑器高度
 * - theme: 编辑器主题风格
 * - fullScreen: 是否支持全屏
 */
export interface CodeFieldConfig extends FieldConfig {
  type: 'code'
  codeType: 'xml' | 'json' | 'javascript' | 'java'
  height: number
  theme: 'white' | 'black'
  fullScreen: boolean
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
        required
      }
    } = this.props

    const errors: FieldError[] = []

    if (getBoolean(required)) {
      if (value === '' || value === undefined || value === null || String(value).trim() === '') {
        errors.push(new FieldError(`输入${label}`))
        return errors
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
