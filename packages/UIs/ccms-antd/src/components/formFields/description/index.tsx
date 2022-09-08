import React from 'react'
import { DescField } from 'ccms'
import { IDescField } from 'ccms/dist/components/formFields/description'

export default class DescFieldComponent extends DescField {
  renderComponent = (props: IDescField) => {
    const { desc, link, style } = props
    return <div style={{ ...style }}>{link ? <a href={link}>{desc}</a> : desc}</div>
  }
}
