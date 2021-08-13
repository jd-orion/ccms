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

  state = {
    flag: false,
    input: '',
    cursorPositionX: 0
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
      this.setFlag(this.isOnComposition)
    }
    // const element = e.target;
    // element.selectionStart = element.selectionEnd = this.state.cursorPositionX;
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

  handleChange = (e: any) => {
    const { onChange } = this.props
    this.setInput(e.target.value)
    // const element = e.target;
    // element.selectionStart = element.selectionEnd = this.state.cursorPositionX;
    if (this.isOnComposition) return
    onChange && onChange(e.target.value)
  }

  /**
       * 计算光标位置
       * @param {*} prePos 格式化前光标位置，光标位置从 0 开始
       * @param {*} preCtrlVal 输入前输入框的内容，例如：1234 1234 1234 123
       * @param {*} beforeFormatVal 格式化前输入框的值
       * @param {*} afterFormatVal 格式化后的值
       * @param {*} placeholderChars 
       * @param {*} maskReg 
       */
  calcPos = (prePos: number, preCtrlVal: string, beforeFormatVal: string, afterFormatVal: string, placeholderChars: any) => {
    // debugger
    const editLength = beforeFormatVal.length - preCtrlVal.length;  // 输入后的值 - 输入前的值，用来判断是输入还是删除，新输入字符串长度
    const isAddition = editLength > 0;  // true 表示输入，false 表示删除
    let pos = prePos;
    if (isAddition) {  // 输入操作，光标移动方案
      const additionStr = beforeFormatVal.substring(pos - editLength, pos);  // pos - editLength 表示输入前光标位置，pos 表示输入后光标位置, additionStr 表示输入的字符串
      // var additionStr = beforeFormatVal.substr(pos - editLength, editLength);
      let ctrlCharCount = additionStr.length;  // ’1234 1234‘ -> '12341234' 有效字符长度
      // pos = pos - (editLength - ctrlCharCount);
      pos = pos - editLength + ctrlCharCount;
      let placeholderCharCount = 0;
      while (ctrlCharCount > 0) {
        if (placeholderChars.indexOf(afterFormatVal.charAt(pos - ctrlCharCount + placeholderCharCount)) === -1) {
          ctrlCharCount--;
        } else {
          placeholderCharCount++;
        }
      }
      pos = pos + placeholderCharCount;
    } else {  // 删除操作，光标移动方案
      if (pos > 0 && pos % 5 === 0) {
        pos = pos - 1;
      }
    }
    return pos;
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
      onChange={this.handleChange}
    />
  }
}
