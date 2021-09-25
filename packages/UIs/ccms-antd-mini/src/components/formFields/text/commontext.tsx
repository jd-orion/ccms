import React, { PureComponent } from 'react'
import { Input } from 'antd'
type Props = {
  defaultValue?: string,
  value: string,
  readonly?: boolean
  disabled?: boolean
  placeholder?: string
  onChange: (value: string) => Promise<void>
};

export default class TextComponent extends PureComponent<Props, {}> {
  isOnComposition = false
  selectionStart: number | null = null
  selectionEnd: number | null = null
  timer: NodeJS.Timeout | null = null

  state = {
    wait: false,
    flag: false,
    input: ''
  }

  handleComposition = (e: any) => {
    const { flag } = this.state
    if ('compositionend' === e.type) {
      this.isOnComposition = false
      this.handleChange(e)
    } else {
      this.isOnComposition = true
    }
    if (flag !== this.isOnComposition) {
      this.setFlag(this.isOnComposition)
    }
  }

  setFlag = (flag: boolean) => {
    this.setState({
      flag: this.isOnComposition
    })
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    this.setState({
      input: value,
      wait: true
    })
    if (this.isOnComposition) return

    if (this.timer !== null) clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.setState({
        wait: false
      })
      if (this.props.onChange) {
        this.props.onChange(value)
      }

    }, 500)
  }

  render() {
    const { value, readonly, disabled, placeholder } = this.props
    const { wait, flag, input } = this.state

    let Component = Input

    return <Component
      readOnly={readonly}
      disabled={disabled}
      placeholder={placeholder}
      value={!flag && !wait ? value : input}
      onCompositionStart={this.handleComposition}
      onCompositionUpdate={this.handleComposition}
      onCompositionEnd={this.handleComposition}
      onChange={(e) => {
        this.selectionStart = e.target.selectionStart
        this.selectionEnd = e.target.selectionEnd
        this.handleChange(e)
        setTimeout(() => {
          e.target.selectionStart = this.selectionStart
          e.target.selectionEnd = this.selectionEnd
        })
      }}
    />
  }
}

