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
type State = {
  wait: boolean
  flag:  boolean
  input: string
  firstComposition: boolean
}
export default class TextComponent extends PureComponent<Props, {}> {
  isOnComposition = false
  selectionStart: number | null = null
  selectionEnd: number | null = null
  timer: NodeJS.Timeout | null = null
  ref: any
  state = {
    wait: false,
    flag: false,
    input: this.props.value || '',
    firstComposition: true
  }
  componentDidUpdate (prevProps: Props, prevState: State) {
    if (prevProps.value != this.props.value && prevState.wait === false) {
      this.ref.input.selectionStart = this.selectionStart
      this.ref.input.selectionEnd = this.selectionEnd
    }
  }
  handleComposition = (e: any) => {
    const { flag, firstComposition } = this.state
    if (firstComposition) {
      e.target.value = this.props.value
      this.setState({
        firstComposition: false
      })
    }

    if ('compositionstart' === e.type) {
      if (e.target.value && (e.target.value != 'undefined')) {
        this.setState({
          input: e.target.value || ''
        })
      }else{
        this.setState({
          input: ''
        })
      }
    }

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
      flag: flag
    })
  }

  setInput = (value: string) => {
    this.setState({
      input: value,
      wait: true
    })
  }
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props
    const value = e.target.value
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

    const Component = Input

    return <Component
      ref={(e)=>{ this.ref= e }}
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
  }
}

