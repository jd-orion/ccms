import React, { PureComponent } from 'react'
import { Input } from 'antd'
import 'antd/lib/input/style'
import { SketchPicker } from 'react-color'
import './index.less'

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
  show: boolean
  color: string
}

export default class ColorComponent extends PureComponent<Props, State> {
  isOnComposition = false

  selectionStart: number | null = null

  selectionEnd: number | null = null

  constructor(props) {
    super(props)

    this.state = {
      flag: false,
      show: false,
      color: props.value || '#ffffff'
    }
  }

  showPicker = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { readonly, disabled } = this.props
    if (readonly || disabled) return
    if (e) {
      this.setState({
        show: true
      })
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
      this.setState({
        flag: this.isOnComposition
      })
    }
  }

  handleChange = (e) => {
    const { onChange } = this.props
    this.setState({
      color: e.target.value
    })
    if (this.isOnComposition) return
    onChange && onChange(e.target.value)
  }

  render() {
    const { flag, color, show } = this.state
    const { value, onChange } = this.props
    return (
      <>
        <Input
          prefix={
            <div
              className="ccms-antd-color-preview"
              style={{ background: flag ? color : value }}
              onClick={(e) => this.showPicker(e)}
            />
          }
          value={flag ? color : value}
          onCompositionStart={this.handleComposition}
          onCompositionUpdate={this.handleComposition}
          onCompositionEnd={this.handleComposition}
          onChange={(e) => {
            this.selectionStart = e.target.selectionStart
            this.selectionEnd = e.target.selectionEnd
            this.handleChange(e)
            const eTaget = e.target
            setTimeout(() => {
              eTaget.selectionStart = this.selectionStart
              eTaget.selectionEnd = this.selectionEnd
            })
          }}
        />
        {show && (
          <div
            className="ccms-antd-color-picker"
            ref={(node) => {
              if (node) {
                const picker = node.children[1] as HTMLDivElement
                const handle = node.parentElement
                if (picker && handle) {
                  const { bottom, height } = picker.getBoundingClientRect()
                  if (bottom > window.innerHeight) {
                    picker.style.marginTop = `${0 - handle.clientHeight - height}px`
                  }
                }
              }
            }}
          >
            <div
              className="mask"
              onClick={() => {
                this.setState({
                  show: false
                })
              }}
            />
            <div className="picker">
              <SketchPicker
                color={flag ? color : value}
                onChange={(colorChange) => {
                  onChange(colorChange.hex)
                }}
              />
            </div>
          </div>
        )}
      </>
    )
  }
}
