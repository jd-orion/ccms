import React from 'react'
import { TextDisplay } from 'ccms'
import { ITextField } from 'ccms/dist/src/components/formFields/text/display'

export default class TextDisplayComponent extends TextDisplay {
  renderComponent = (props: ITextField) => {
    const {
      value
    } = props
    const reg = /((ht|f)tp(s?))\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%$#_]*)?/
    return <div style={{wordBreak: 'break-all'}}>
      {
        reg.test(value) ? <a href={value} target="_blank" rel="noreferrer" >{value}</a> : value
      }
    </div>
  }
}
