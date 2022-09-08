import React, { PureComponent } from 'react'
import { Input } from 'antd'
import 'antd/lib/input/style'
import { TextAreaRef } from 'antd/lib/input/TextArea'

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
  wait: boolean
  flag: boolean
  input: string
  firstComposition: boolean
}
export default class TextComponent extends PureComponent<Props, State> {
  isOnComposition = false

  selectionStart: number | null = null

  selectionEnd: number | null = null

  timer: NodeJS.Timeout | null = null

  ref: TextAreaRef | undefined

  constructor(props) {
    super(props)
    this.state = {
      wait: false,
      flag: false,
      input: props.value || '',
      firstComposition: true
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { value } = this.props
    if (prevProps.value !== value && prevState.wait === false) {
      if (this.ref && this.ref.resizableTextArea && this.selectionStart)
        this.ref.resizableTextArea.textArea.selectionStart = this.selectionStart
      if (this.ref && this.ref.resizableTextArea && this.selectionEnd)
        this.ref.resizableTextArea.textArea.selectionEnd = this.selectionEnd
    }
  }

  handleComposition = (e) => {
    const { value } = this.props
    const { flag, firstComposition } = this.state
    if (firstComposition) {
      e.target.value = value
      this.setState({
        firstComposition: false
      })
    }

    if (e.type === 'compositionstart') {
      if (e.target.value && e.target.value !== 'undefined') {
        this.setState({
          input: e.target.value || ''
        })
      } else {
        this.setState({
          input: ''
        })
      }
    }

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

  setFlag = (flag: boolean) => {
    this.setState({
      flag
    })
  }

  setInput = (value: string) => {
    this.setState({
      input: value,
      wait: true
    })
  }

  handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { onChange } = this.props
    const { value } = e.target
    this.selectionStart = e.target.selectionStart
    this.selectionEnd = e.target.selectionEnd
    this.setInput(e.target.value)
    if (this.isOnComposition) return
    if (this.timer !== null) clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.setState({
        wait: false
      })

      onChange && onChange(value)
    }, 100)
  }

  render() {
    const { value, readonly, disabled, placeholder } = this.props
    const { wait, flag, input } = this.state

    const Component = TextArea

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
          this.handleChange(e)
        }}
      />
    )
  }
}
