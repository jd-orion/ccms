import React, { Component } from 'react'
import { Button } from 'antd'
import { ChromePicker } from 'react-color'
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
    color: this.props.value || '#ffffff',
    position: { top: '10', left: '50' }
  }

  onChange = () => {
    const { onChange } = this.props
    this.showPicker(false, '')
    onChange && onChange(this.state.color)
  }

  showPicker = (type: boolean, e: any) => {
    const { readonly, disabled } = this.props
    if (readonly || disabled) return

    if (e) {
      this.setState({
        position: {
          top: e.clientY,
          left: e.clientX
        }
      })
    }

    this.setState({
      show: type
    })
  }

  render() {
    const { show, color, position } = this.state
    const { value } = this.props
    return <div className="color-input" style={style.color_input as React.CSSProperties}>
      <div className="color-dom" onClick={(e) => this.showPicker(true, e)} style={style.color_dom}>
        <div style={{ backgroundColor: value, width: '100%', height: '100%' }} />
      </div>
      <div>{value}</div>
      {
        show && <div className="color-picker" style={{
          backgroundColor: '#fff',
          padding: '10px',
          position: 'fixed',
          zIndex: 1000, top: `${position.top}px`, left: `${position.left}px`
        } as React.CSSProperties}>
          <ChromePicker color={color} onChange={(color) => {
            this.setState({
              color: color.hex
            })
          }} />
          <div style={style.btn}>
            <Button onClick={() => this.showPicker(false, '')}>取消</Button>
            <Button onClick={this.onChange}>确定</Button>
          </div>
        </div>
      }
    </div>
  }
}
