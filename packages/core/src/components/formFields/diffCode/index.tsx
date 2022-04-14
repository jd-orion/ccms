import React, { KeyboardEvent } from 'react'
import { get } from 'lodash'
import { Field, FieldConfig, FieldError, IField } from '../common'

/**
 * diffCode编辑器配置项
 * - codeType: 语言类型
 * - height: 代码编辑器高度
 * - theme: 编辑器主题风格
 * - fullScreen: 是否支持全屏
 * - originalCodeField: 代码原始值入参字段
 * - modifiedCodeField: 代码修改值入参字段
 */
export interface DiffCodeFieldConfig extends FieldConfig {
  type: 'diffcode'
  codeType: 'xml' | 'json' | 'javascript' | 'java'
  height: number
  theme: 'white' | 'black'
  fullScreen: boolean
  originalCodeField: string
  modifiedCodeField: string
}

export interface IDiffCodeField {
  codeType: 'xml' | 'json' | 'javascript' | 'java'
  fullScreenStatus: boolean
  height: number
  theme: 'white' | 'black'
  originalCode: string
  modifiedCode: string
}

/**
 * diffCode编辑器配置项
 * - codeType: 语言类型
 * - height: 代码编辑器高度
 * - fullScreen: 是否支持全屏
 * - fullScreenStatus: 编辑器是不是处于全屏状态
 */
export interface IDiffCodeFieldContainer {
  fullScreen: boolean
  fullScreenStatus: boolean
  theme: 'white' | 'black'
  children: React.ReactNode
  keydownCallback: (value: KeyboardEvent) => Promise<void>
  enterFull: () => void
  exitFull: () => void
}
interface DiffCodeFieldValue {
   [field: string]: any
}
interface State {
  fullScreenStatus: boolean // 编辑器是不是处于全屏状态
}

export default class DiffCodeField extends Field<DiffCodeFieldConfig, IDiffCodeField, DiffCodeFieldValue> implements IField<DiffCodeFieldValue> {
  state:State = {
    fullScreenStatus: false
  }

  get: () => Promise<DiffCodeFieldValue> = async () => {
    return {}
  }

  reset: () => Promise<DiffCodeFieldValue> = async () => {
    const defaults = await this.defaultValue()
    return (defaults === undefined) ? '' : defaults
  }

  validate = async (value: DiffCodeFieldValue): Promise<true | FieldError[]> => {
    return true
  }

  keydownCallback = (e: KeyboardEvent) => {
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

  renderContainer = (props: IDiffCodeFieldContainer) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现CodeField的container组件。
      <div style={{ display: 'none' }}>
      </div>
    </React.Fragment>
  }

  renderComponent = (props: IDiffCodeField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现CodeField组件。
      <div style={{ display: 'none' }}>
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
        codeType,
        originalCodeField,
        modifiedCodeField
      }
    } = this.props
    const { fullScreenStatus } = this.state
    const originalCode = get(value, originalCodeField) || ''
    const modifiedCode = get(value, modifiedCodeField) || ''
    return (
      <React.Fragment>
        {this.renderContainer({
          fullScreenStatus,
          fullScreen,
          theme,
          keydownCallback: async (e: KeyboardEvent) => await this.keydownCallback(e),
          enterFull: this.enterFull,
          exitFull: this.exitFull,
          children: this.renderComponent({
            codeType,
            fullScreenStatus,
            originalCode,
            modifiedCode,
            theme,
            height
          })
        })}
      </React.Fragment>
    )
  }
}
