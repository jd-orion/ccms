import React from 'react'
import { DetailField, DetailFieldConfig, IDetailField } from '../common'

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
export interface CodeDetailConfig extends DetailFieldConfig {
  type: 'code'
  codeType: 'xml' | 'json' | 'javascript' | 'java'
  height: number
  theme: 'white' | 'black'
  fullScreen: boolean
  maxLength?: number
  minLength?: number
  cjkLength?: number
  regExp?: { expression: string; message?: string }
}

export interface ICodeField {
  codeType: 'xml' | 'json' | 'javascript' | 'java'
  fullScreenStatus: boolean
  height: number
  theme: 'white' | 'black'
  value: string
}

/**
 * code编辑器配置项
 * - codeType: 语言类型
 * - height: 代码编辑器高度
 * - fullScreen: 是否支持全屏
 * - fullScreenStatus: 编辑器是不是处于全屏状态
 */
export interface ICodeFieldContainer {
  fullScreen: boolean
  fullScreenStatus: boolean
  theme: 'white' | 'black'
  children: React.ReactNode
  enterFull: () => void
  exitFull: () => void
}
interface State {
  fullScreenStatus: boolean // 编辑器是不是处于全屏状态
}
export default class CodeDetail
  extends DetailField<CodeDetailConfig, ICodeField, string>
  implements IDetailField<string>
{
  state: State = {
    fullScreenStatus: false
  }

  reset: () => Promise<string> = async () => {
    const defaults = await this.defaultValue()
    return defaults === undefined ? '' : defaults
  }

  enterFull = () => {
    this.setState({ fullScreenStatus: true })
  }

  exitFull = () => {
    this.setState({ fullScreenStatus: false })
  }

  renderContainer: (props: ICodeFieldContainer) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现CodeField的container组件。</>
  }

  renderComponent: (props: ICodeField) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现CodeField组件。</>
  }

  render = () => {
    const {
      value,
      config: { theme, fullScreen, height, codeType }
    } = this.props
    const { fullScreenStatus } = this.state

    return (
      <>
        {this.renderContainer({
          fullScreenStatus,
          fullScreen,
          theme,
          enterFull: this.enterFull,
          exitFull: this.exitFull,
          children: this.renderComponent({
            codeType,
            fullScreenStatus,
            value,
            theme,
            height
          })
        })}
      </>
    )
  }
}
