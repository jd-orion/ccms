import React, { PureComponent } from 'react'
import { Input } from 'antd'
import 'antd/lib/input/style'

const { TextArea } = Input
type Props = {
  defaultValue?: string
  value: string
  readonly?: boolean
  disabled?: boolean
  placeholder?: string
  onChange: (value: string) => Promise<void>
}
type State = {
  flag: boolean
  input: string
}

export default class TextComponent extends PureComponent<Props, State> {
  isOnComposition = false

  selectionStart = 0

  selectionEnd = 0

  constructor(props) {
    super(props)
    this.state = {
      flag: false,
      input: ''
    }
  }

  handleComposition = (e) => {
    const { flag } = this.state
    if (e.type === 'compositionend') {
      this.isOnComposition = false
      this.handleChange(e)
    } else {
      this.isOnComposition = true
    }
    if (flag !== this.isOnComposition) {
      this.setFlag(this.isOnComposition)
    }
  }

  setFlag = (flag) => {
    this.setState({
      flag
    })
  }

  setInput = (value: string) => {
    this.setState({
      input: value
    })
  }

  handleChange = (e) => {
    const { onChange } = this.props
    this.setInput(e.target.value)
    if (this.isOnComposition) return
    onChange && onChange(e.target.value)
  }

  render() {
    const { value, readonly, disabled, placeholder } = this.props
    const { flag, input } = this.state

    const Component = TextArea

    return (
      <Component
        readOnly={readonly}
        disabled={disabled}
        placeholder={placeholder}
        value={!flag ? value : input}
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
    )
  }
}
