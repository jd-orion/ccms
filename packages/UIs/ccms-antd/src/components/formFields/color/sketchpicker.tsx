import React, { Component } from 'react'
import { Button } from 'antd'
import { SketchPicker } from 'react-color'
import style from './style.js'

type Props = {
  defaultValue?: string,
  value: string,
  readonly?: boolean
  disabled?: boolean
  placeholder?: string
  onChange: (value: string) => Promise<void>
};

export default class ColorComponent extends Component<Props, {}> {
  isOnComposition = false

  state = {
    show: false,
    color: this.props.value || ''
  }

  onChange = () => {
    const { onChange } = this.props
    this.showPicker(false)
    onChange && onChange(this.state.color)
  }

  showPicker = (type: boolean) => {
    const { readonly, disabled } = this.props
    if (readonly || disabled) return
    this.setState({ show: type })
  }

  render() {
    const { show, color } = this.state
    const { value } = this.props

    return <div className="color-input" style={style.color_input as React.CSSProperties}>
      <div className="color-dom" onClick={() => this.showPicker(true)} style={style.color_dom}>
        <div style={{ backgroundColor: value, width: '100%', height: '100%' }} />
      </div>
      {
        show && <div className="color-picker" style={style.color_picker as React.CSSProperties}>
          <SketchPicker color={color} onChange={(color) => {
            this.setState({
              color: color.hex
            })
          }} />
          <div style={style.btn}>
            <Button onClick={() => this.showPicker(false)}>取消</Button>
            <Button onClick={this.onChange}>确定</Button>
          </div>
        </div>
      }
    </div>
  }
}
