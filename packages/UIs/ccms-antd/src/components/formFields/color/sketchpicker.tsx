import React, { PureComponent } from 'react'
import { Input } from 'antd'
import { SketchPicker } from 'react-color'
import styles from './index.less'

type Props = {
  defaultValue?: string,
  value: string,
  readonly?: boolean
  disabled?: boolean
  placeholder?: string
  onChange: (value: string) => Promise<void>
};

export default class ColorComponent extends PureComponent<Props, {}> {
  isOnComposition = false
  selectionStart: number | null = null
  selectionEnd: number | null = null

  state = {
    flag: false,
    show: false,
    color: this.props.value || '#ffffff',
    position: { top: '10', left: '50' }
  }

  showPicker = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { readonly, disabled } = this.props
    if (readonly || disabled) return
    if (e) {
      let position;
      if (document.body.clientHeight - e.clientY > 421) {
        position = {
          top: `${e.clientY}px`,
          left: `${e.clientX}px`
        }
      } else {
        position = {
          bottom: `0px`,
          left: `${e.clientX}px`
        }
      }
      this.setState({
        position,
        show: true 
      })
    }
  }
  handleComposition = (e: any) => {
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

  handleChange = (e: any) => {
    const { onChange } = this.props
    this.setState({
      color: e.target.value
    })
    if (this.isOnComposition) return
    onChange && onChange(e.target.value)
  }

  render() {
    return (
      <React.Fragment>
        <Input
          prefix={(
            <div
              className={styles['ccms-antd-color-preview']}
              style={{ background: this.state.flag ? this.state.color : this.props.value }}
              onClick={(e) => this.showPicker(e)}
            ></div>
          )}
          value={this.state.flag ? this.state.color : this.props.value}
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
        {
          this.state.show && (
            <div
              className={styles['ccms-antd-color-picker']}
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
                className={styles['mask']}
                onClick={() => {
                  this.setState({
                    show: false
                  })
                }}
              ></div>
              <div className={styles['picker']}>
                <SketchPicker
                  color={this.state.flag ? this.state.color : this.props.value}
                  onChange={(color) => {
                    this.props.onChange(color.hex)
                  }}
                />
              </div>
            </div>
          )
        }
      </React.Fragment>
    )
  }
}
