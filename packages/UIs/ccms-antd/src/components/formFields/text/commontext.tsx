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

  state = {
    flag: false,
    input: this.props.value || '',
    firstCompositon: true
  }

  handleComposition = (e: any) => {
    const { flag, firstCompositon } = this.state
    if (firstCompositon) {
      e.target.value = this.props.value
      this.setState({
        firstCompositon: false
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
      flag: this.isOnComposition
    })
  }

  setInput = (value: string) => {
    this.setState({
      input: value
    })
  }
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props
    this.setInput(e.target.value)
    if (this.isOnComposition) return
    onChange && onChange(e.target.value)
  }

  render() {
    const { value, readonly, disabled, placeholder } = this.props
    const { flag, input } = this.state

    const Component = Input

    return <Component
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
        const eTaget = e.target
        this.handleChange(e)
        setTimeout(() => {
          eTaget.selectionStart = this.selectionStart
          eTaget.selectionEnd = this.selectionEnd
        })
      }}
    />
  }
}

