import React from 'react'
import { LongTextDisplay } from 'ccms'
import { ILongtextField } from 'ccms/dist/components/formFields/longtext/display'

export default class LongTextDisplayComponent extends LongTextDisplay {
  renderComponent = (props: ILongtextField) => {
    const { value } = props
    const reg = /((ht|f)tp(s?)):\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-.?,'/\\+&amp;%$#_]*)?/
    return (
      <div style={{ wordBreak: 'break-all' }}>
        {reg.test(value) ? (
          <a href={value} target="_blank" rel="noreferrer">
            {value}
          </a>
        ) : (
          value
        )}
      </div>
    )
  }
}
