import React, { PureComponent } from 'react'
import { Input, InputRef } from 'antd'
import 'antd/lib/input/style'

type Props = {
  defaultValue?: string
  value: string
  readonly?: boolean
  disabled?: boolean
  placeholder?: string
  onChange: (value: string) => Promise<void>
}

type State = {
  wait: boolean
  flag: boolean
  input: string
}
export default class TextComponent extends PureComponent<Props, State> {
  isOnComposition = false

  selectionStart: number | null = null

  selectionEnd: number | null = null

  timer: NodeJS.Timeout | null = null

  ref: InputRef | undefined

  constructor(props) {
    super(props)
    this.state = {
      wait: false,
      flag: false,
      input: ''
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { value } = this.props
    if (prevProps.value !== value && prevState.wait === false) {
      if (this.ref && this.ref.input) this.ref.input.selectionStart = this.selectionStart
      if (this.ref && this.ref.input) this.ref.input.selectionEnd = this.selectionEnd
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

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props
    const { value } = e.target

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
      if (onChange) {
        onChange(value)
      }
    }, 500)
  }

  render() {
    const { value, readonly, disabled, placeholder } = this.props
    const { wait, flag, input } = this.state

    const Component = Input

    return (
      <Component
        ref={(e) => {
          if (e) {
            this.ref = e
          }
        }}
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
    )
  }
}
